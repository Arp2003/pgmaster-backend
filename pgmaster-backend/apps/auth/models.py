"""
Authentication Models for PGMaster.
"""

from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.common.models import BaseModel


class User(AbstractUser):
    """Custom User model with role-based access."""
    
    ROLE_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('pg_owner', 'PG Owner'),
        ('staff', 'Staff'),
        ('tenant', 'Tenant'),
    ]
    
    phone = models.CharField(max_length=15, unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='tenant')
    is_verified = models.BooleanField(default=False)
    
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="pgmaster_user_set",
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="pgmaster_user_set",
        related_query_name="user",
    )
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.get_role_display()})"
    
    class Meta:
        ordering = ['-date_joined']


class PasswordResetToken(BaseModel):
    """Model to handle password reset tokens."""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='password_reset_token')
    token = models.CharField(max_length=256, unique=True)
    expires_at = models.DateTimeField()
    
    def __str__(self):
        return f"Reset token for {self.user.email}"
