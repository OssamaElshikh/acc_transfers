from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Account
import uuid
from django.core.files.uploadedfile import SimpleUploadedFile


class AccountTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.account1 = Account.objects.create(
            id=uuid.uuid4(), name='Account 1', balance=5000)
        self.account2 = Account.objects.create(
            id=uuid.uuid4(), name='Account 2', balance=3000)

    def test_import_accounts(self):
        url = reverse('account-import_accounts')
        csv_data = """ID,Name,Balance
cc26b56c-36f6-41f1-b689-d1d5065b95af,Joy Dean,4497.22
be6acfdc-cae1-4611-b3b2-dfb5167ba5fe,Bryan Rice,2632.76
"""
        file = SimpleUploadedFile(
            "accounts.csv", csv_data.encode(), content_type="text/csv")
        response = self.client.post(url, {'file': file}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Account.objects.count(), 4)

    def test_transfer_funds(self):
        url = reverse('account-transfer', args=[self.account1.id])
        data = {
            'to_account_id': str(self.account2.id),
            'amount': 1000
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.account1.refresh_from_db()
        self.account2.refresh_from_db()
        self.assertEqual(self.account1.balance, 4000)
        self.assertEqual(self.account2.balance, 4000)

    def test_transfer_funds_insufficient_balance(self):
        url = reverse('account-transfer', args=[self.account1.id])
        data = {
            'to_account_id': str(self.account2.id),
            'amount': 10000  # More than account1 balance
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.account1.refresh_from_db()
        self.account2.refresh_from_db()
        self.assertEqual(self.account1.balance, 5000)
        self.assertEqual(self.account2.balance, 3000)

    def test_transfer_funds_invalid_account(self):
        url = reverse('account-transfer', args=[self.account1.id])
        data = {
            'to_account_id': str(uuid.uuid4()),  # Non-existent account ID
            'amount': 1000
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.account1.refresh_from_db()
        self.account2.refresh_from_db()
        self.assertEqual(self.account1.balance, 5000)
        self.assertEqual(self.account2.balance, 3000)

    def test_delete_all_accounts(self):
        url = reverse('account-delete_all_accounts')
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Account.objects.count(), 0)
