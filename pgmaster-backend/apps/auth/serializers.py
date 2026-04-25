"""
Serializers for Authentication.
"""

from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils import timezone
from datetime import timedelta
import secrets

from .models import User, PasswordResetToken


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    
    tenant_details = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'phone', 'role', 'is_active', 'is_verified', 'date_joined',
            'tenant_details'
        ]
        read_only_fields = ['id', 'date_joined']

    def get_tenant_details(self, obj):
        if obj.role == 'tenant':
            from apps.tenants.models import Tenant
            tenant = Tenant.objects.filter(user=obj).first()
            if tenant and tenant.bed:
                return {
                    'room_number': tenant.bed.room.room_number,
                    'bed_number': tenant.bed.bed_number,
                    'monthly_rent': float(tenant.monthly_rent),
                    'pg_name': tenant.pg.name
                }
        return None


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        min_length=8
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        min_length=8
    )
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name',
            'phone', 'password', 'password2', 'role'
        ]
    
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'Email already exists.'})
        
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({'username': 'Username already exists.'})
        
        return data
    
    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        # Try to authenticate with username first
        user = authenticate(username=username, password=password)
        
        # If it fails, try to authenticate with email
        if not user:
            try:
                user_obj = User.objects.get(email=username)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass
        
        if not user:
            raise serializers.ValidationError('Invalid credentials. Please check your username/email and password.')
        
        if not user.is_active:
            raise serializers.ValidationError('User account is deactivated.')
        
        data['user'] = user
        return data


class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer for password reset request."""
    
    email = serializers.EmailField()
    
    def validate_email(self, value):
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError('User with this email does not exist.')
        
        return value


class PasswordResetSerializer(serializers.Serializer):
    """Serializer for password reset."""
    
    token = serializers.CharField()
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)
    
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        
        try:
            reset_token = PasswordResetToken.objects.get(token=data['token'])
            
            if reset_token.expires_at < timezone.now():
                raise serializers.ValidationError({'token': 'Token has expired.'})
            
            data['user'] = reset_token.user
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError({'token': 'Invalid token.'})
        
        return data
