"""
Admin configuration for Notices App.
"""

from django.contrib import admin
from .models import Notice


@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ['title', 'pg', 'notice_type', 'is_sent', 'created_at']
    list_filter = ['notice_type', 'is_sent', 'created_at']
    search_fields = ['title', 'content']
    readonly_fields = ['sent_date', 'created_at', 'updated_at']
