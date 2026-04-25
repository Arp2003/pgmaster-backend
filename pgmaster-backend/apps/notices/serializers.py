"""
Serializers for Notices App.
"""

from rest_framework import serializers
from .models import Notice


class NoticeSerializer(serializers.ModelSerializer):
    """Serializer for Notice model."""
    
    class Meta:
        model = Notice
        fields = [
            'id', 'pg', 'title', 'notice_type', 'content', 'send_to_all',
            'target_rooms', 'is_sent', 'sent_date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'sent_date', 'created_at', 'updated_at']
