"""
URL routes for Authentication.
"""

from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView, LoginView, LogoutView, UserProfileView,
    PasswordResetRequestView, PasswordResetView, GoogleLoginView
)

router = DefaultRouter()
router.register(r'register', RegisterView, basename='register')
router.register(r'login', LoginView, basename='login')
router.register(r'google-login', GoogleLoginView, basename='google-login')
router.register(r'logout', LogoutView, basename='logout')
router.register(r'profile', UserProfileView, basename='profile')
router.register(r'password-reset-request', PasswordResetRequestView, basename='password-reset-request')
router.register(r'password-reset', PasswordResetView, basename='password-reset')

urlpatterns = [
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] + router.urls
