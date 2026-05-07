"""
URL routes for PG App.
"""

from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import PGProfileViewSet   # ✅ only this

router = DefaultRouter()
router.register(r'profile', PGProfileViewSet, basename='pg-profile')

urlpatterns = router.urls
