"""
Views for Authentication.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from django.conf import settings
import secrets
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from .models import User, PasswordResetToken
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer,
    PasswordResetRequestSerializer, PasswordResetSerializer
)


class RegisterView(viewsets.ModelViewSet):
    """API endpoint for user registration."""
    
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response(
            {
                'message': 'User registered successfully.',
                'user': UserSerializer(user).data
            },
            status=status.HTTP_201_CREATED
        )


class LoginView(viewsets.ViewSet):
    """API endpoint for user login."""
    
    permission_classes = [AllowAny]
    
    def create(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        
        return Response(
            {
                'message': 'Login successful.',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data
            },
            status=status.HTTP_200_OK
        )


class LogoutView(viewsets.ViewSet):
    """API endpoint for user logout."""
    
    permission_classes = [IsAuthenticated]
    
    def create(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response(
                {'message': 'Logout successful.'},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class UserProfileView(viewsets.ModelViewSet):
    """API endpoint for user profile."""
    
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put'])
    def update_profile(self, request):
        user = request.user
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(
            {
                'message': 'Profile updated successfully.',
                'user': serializer.data
            }
        )


class PasswordResetRequestView(viewsets.ViewSet):
    """API endpoint for password reset request."""
    
    permission_classes = [AllowAny]
    
    def create(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        user = User.objects.get(email=email)
        
        # Delete existing tokens
        PasswordResetToken.objects.filter(user=user).delete()
        
        # Create new token
        token = secrets.token_urlsafe(32)
        reset_token = PasswordResetToken.objects.create(
            user=user,
            token=token,
            expires_at=timezone.now() + timedelta(hours=24)
        )
        
        # Send email
        reset_link = f"{settings.FRONTEND_URL}/auth/reset-password?token={token}"
        message = f"""
        Hello {user.first_name},
        
        Click the link below to reset your password:
        {reset_link}
        
        This link will expire in 24 hours.
        
        Best regards,
        PGMaster Team
        """
        
        send_mail(
            'Password Reset Request',
            message,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        
        return Response(
            {'message': 'Password reset link sent to your email.'},
            status=status.HTTP_200_OK
        )


class PasswordResetView(viewsets.ViewSet):
    """API endpoint for password reset."""
    
    permission_classes = [AllowAny]
    
    def create(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        user.set_password(serializer.validated_data['password'])
        user.save()
        
        # Delete token
        PasswordResetToken.objects.filter(user=user).delete()
        
        return Response(
            {'message': 'Password reset successful. You can now login with your new password.'},
            status=status.HTTP_200_OK
        )
    
    
class GoogleLoginView(viewsets.ViewSet):
    """API endpoint for Google Login."""
    
    permission_classes = [AllowAny]
    
    def create(self, request):
        token = request.data.get('token')
        role = request.data.get('role', 'tenant')
        
        if not token:
            return Response({'error': 'Token is required.'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            # Verify the token
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), settings.GOOGLE_CLIENT_ID)
            
            email = idinfo['email']
            google_id = idinfo['sub']
            
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0] + "_" + google_id[:5],
                    'first_name': idinfo.get('given_name', ''),
                    'last_name': idinfo.get('family_name', ''),
                    'role': role,
                    'is_verified': True,
                    'phone': f"G-{google_id[:10]}" # Placeholder phone
                }
            )
            
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Login successful.',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
            
        except ValueError as e:
            return Response({'error': 'Invalid token.', 'details': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Authentication failed.', 'details': str(e)}, status=status.HTTP_400_BAD_REQUEST)
