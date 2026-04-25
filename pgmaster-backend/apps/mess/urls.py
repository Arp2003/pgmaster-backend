from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MessProfileViewSet, MenuItemViewSet

router = DefaultRouter()
router.register(r'profile', MessProfileViewSet, basename='mess-profile')
router.register(r'menu', MenuItemViewSet, basename='mess-menu')

urlpatterns = [
    path('', include(router.urls)),
]
