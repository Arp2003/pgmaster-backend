"""
Admin configuration for Complaints App.
"""

from django.contrib import admin
from .models import Complaint, ComplaintUpdate


@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ['title', 'tenant', 'category', 'priority', 'status', 'created_at']
    list_filter = ['category', 'priority', 'status', 'created_at']
    search_fields = ['title', 'description', 'tenant__tenant_name']
    readonly_fields = ['created_at', 'updated_at', 'resolved_date']


@admin.register(ComplaintUpdate)
class ComplaintUpdateAdmin(admin.ModelAdmin):
    list_display = ['complaint', 'status', 'updated_by', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['complaint__title', 'updated_by']
    readonly_fields = ['created_at', 'updated_at']
