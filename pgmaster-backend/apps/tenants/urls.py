"""
URL routes for Tenants App.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TenantViewSet

router = DefaultRouter()
router.register(r'', TenantViewSet, basename='tenant')

urlpatterns = [
    path('active_tenants/', TenantViewSet.as_view({'get': 'active_tenants'}), name='active-tenants'),
    path('vacated_tenants/', TenantViewSet.as_view({'get': 'vacated_tenants'}), name='vacated-tenants'),
    path('', include(router.urls)),
]
