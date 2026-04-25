"""
Serializers for Complaints App.
"""

from rest_framework import serializers
from .models import Complaint, ComplaintUpdate


class ComplaintUpdateSerializer(serializers.ModelSerializer):
    """Serializer for Complaint Updates."""
    
    class Meta:
        model = ComplaintUpdate
        fields = [
            'id', 'complaint', 'status', 'update_text', 'updated_by',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ComplaintSerializer(serializers.ModelSerializer):
    """Serializer for Complaint model."""
    
    tenant_details = serializers.SerializerMethodField()
    updates = ComplaintUpdateSerializer(many=True, read_only=True)
    
    class Meta:
        model = Complaint
        fields = [
            'id', 'tenant', 'tenant_details', 'title', 'category', 'description',
            'priority', 'status', 'attachment', 'assigned_to', 'resolution_notes',
            'resolved_date', 'updates', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'resolved_date', 'created_at', 'updated_at']
    
    def get_tenant_details(self, obj):
        return {
            'id': obj.tenant.id,
            'name': obj.tenant.tenant_name,
            'phone': obj.tenant.phone,
        }


class ComplaintCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating complaints."""
    
    class Meta:
        model = Complaint
        fields = [
            'title', 'category', 'description', 'priority',
            'attachment', 'assigned_to', 'status', 'resolution_notes'
        ]
