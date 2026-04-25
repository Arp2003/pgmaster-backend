"""
Admin configuration for PG App.
"""

from django.contrib import admin
from .models import PGProfile, PGStaff, PGSettings


@admin.register(PGProfile)
class PGProfileAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'city', 'state', 'subscription_plan', 'created_at']
    list_filter = ['subscription_plan', 'city', 'state', 'created_at']
    search_fields = ['name', 'owner__email', 'gst_number']
    readonly_fields = ['created_at', 'updated_at', 'total_rooms', 'total_beds']


@admin.register(PGStaff)
class PGStaffAdmin(admin.ModelAdmin):
    list_display = ['user', 'pg', 'designation', 'joining_date', 'is_active']
    list_filter = ['designation', 'pg', 'joining_date', 'is_active']
    search_fields = ['user__email', 'pg__name']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(PGSettings)
class PGSettingsAdmin(admin.ModelAdmin):
    list_display = ['pg', 'rent_due_day', 'late_fee_percentage', 'auto_generate_rent']
    list_filter = ['auto_generate_rent', 'send_email_reminders', 'send_sms_reminders']
    search_fields = ['pg__name']
    readonly_fields = ['created_at', 'updated_at']
