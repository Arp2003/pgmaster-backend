"""
URL routes for PG App.
"""

from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import PGProfileViewSet, PGStaffViewSet

router = DefaultRouter()
router.register(r'profile', PGProfileViewSet, basename='pg-profile')
router.register(r'staff', PGStaffViewSet, basename='pg-staff')

urlpatterns = router.urls
