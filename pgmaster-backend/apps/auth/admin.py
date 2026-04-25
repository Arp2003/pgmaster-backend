from django.contrib import admin
from .models import User, PasswordResetToken


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone']
    readonly_fields = ['date_joined', 'last_login']


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ['user', 'expires_at', 'created_at']
    list_filter = ['created_at', 'expires_at']
    search_fields = ['user__email']
    readonly_fields = ['token', 'created_at', 'updated_at']
