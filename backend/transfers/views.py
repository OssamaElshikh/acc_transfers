from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import JSONParser, MultiPartParser
from .models import Account
from .serializers import AccountSerializer
import csv
from django.db.models import F


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    parser_classes = [MultiPartParser, JSONParser]  # Add JSONParser here

    @action(detail=False, methods=['post'], parser_classes=[MultiPartParser])
    def import_accounts(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=400)

        try:
            decoded_file = file.read().decode('utf-8').splitlines()
            reader = csv.DictReader(decoded_file)
            accounts = []
            for row in reader:
                account = Account(
                    id=row['ID'],
                    name=row['Name'],
                    balance=row['Balance']
                )
                accounts.append(account)
            Account.objects.bulk_create(accounts)
            return Response({'status': 'Accounts imported successfully'})
        except Exception as e:
            return Response({'error': str(e)}, status=400)

    @action(detail=True, methods=['post'], parser_classes=[JSONParser])
    def transfer(self, request, pk=None):
        from_account = self.get_object()
        to_account_id = request.data.get('to_account_id')
        amount = request.data.get('amount')

        try:
            amount = float(amount)
        except ValueError:
            return Response({'error': 'Invalid amount'}, status=400)

        if from_account.balance < amount:
            return Response({'error': 'Insufficient funds'}, status=400)

        try:
            to_account = Account.objects.get(id=to_account_id)
        except Account.DoesNotExist:
            return Response({'error': 'Target account not found'}, status=404)

        from_account.balance = F('balance') - amount
        to_account.balance = F('balance') + amount
        from_account.save()
        to_account.save()
        return Response({'status': 'Transfer successful'})

    @action(detail=False, methods=['delete'])
    def delete_all_accounts(self, request):
        Account.objects.all().delete()
        return Response({'status': 'All accounts deleted'})
