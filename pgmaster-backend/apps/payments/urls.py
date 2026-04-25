"""
URL routes for Payments App.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, SecurityDepositViewSet

router = DefaultRouter()
router.register(r'security-deposit', SecurityDepositViewSet, basename='security-deposit')
router.register(r'', PaymentViewSet, basename='payment')

urlpatterns = [
    path('my_payments/', PaymentViewSet.as_view({'get': 'my_payments'}), name='my-payments'),
    path('', include(router.urls)),
]
