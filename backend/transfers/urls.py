from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AccountViewSet

router = DefaultRouter()
router.register(r'accounts', AccountViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('accounts/import_accounts/', AccountViewSet.as_view(
        {'post': 'import_accounts'}), name='account-import_accounts'),
    path('accounts/delete_all_accounts/', AccountViewSet.as_view(
        {'delete': 'delete_all_accounts'}), name='account-delete_all_accounts'),
]
