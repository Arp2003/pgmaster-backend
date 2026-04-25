"""
URL routes for Complaints App.
"""

from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import ComplaintViewSet

router = SimpleRouter()
router.register(r'', ComplaintViewSet, basename='complaint')

urlpatterns = [
    path('my_complaints/', ComplaintViewSet.as_view({'get': 'my_complaints'}), name='my-complaints'),
    path('', include(router.urls)),
]
