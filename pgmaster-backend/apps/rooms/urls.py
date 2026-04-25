"""
URL routes for Rooms App.
"""

from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import RoomViewSet, BedViewSet

router = DefaultRouter()
router.register(r'beds', BedViewSet, basename='bed')
router.register(r'', RoomViewSet, basename='room')

urlpatterns = router.urls
