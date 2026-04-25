"""
URL routes for Notices App.
"""

from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import NoticeViewSet

router = DefaultRouter()
router.register(r'', NoticeViewSet, basename='notice')

urlpatterns = router.urls
