"""
Serializers for Tenants App.
"""

from rest_framework import serializers
from .models import Tenant


class TenantSerializer(serializers.ModelSerializer):
    """Serializer for Tenant model."""
    
    bed_details = serializers.SerializerMethodField()
    room_details = serializers.SerializerMethodField()
    rent_due = serializers.SerializerMethodField()
    
    class Meta:
        model = Tenant
        fields = [
            'id', 'pg', 'user', 'tenant_name', 'father_name', 'mother_name',
            'phone', 'alternate_phone', 'email', 'aadhar_number', 'id_proof_type',
            'id_proof', 'photo', 'permanent_address', 'city', 'state', 'pincode',
            'institution_type', 'institution_name', 'course_name',
            'emergency_contact_name', 'emergency_contact_phone',
            'bed', 'bed_details', 'room_details', 'join_date', 'notice_date',
            'vacate_date', 'monthly_rent', 'security_deposit', 'status',
            'advance_paid', 'notes', 'rent_due', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'pg', 'rent_due', 'created_at', 'updated_at']
    
    def get_bed_details(self, obj):
        if obj.bed:
            return {
                'id': obj.bed.id,
                'bed_number': obj.bed.bed_number,
                'room': obj.bed.room.room_number,
            }
        return None
    
    def get_room_details(self, obj):
        if obj.bed:
            room = obj.bed.room
            return {
                'id': room.id,
                'room_number': room.room_number,
                'floor': room.floor,
            }
        return None
    
    def get_rent_due(self, obj):
        return float(obj.get_current_rent_due())


class TenantCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating tenants."""
    
    class Meta:
        model = Tenant
        fields = [
            'tenant_name', 'father_name', 'mother_name', 'phone', 'alternate_phone',
            'email', 'aadhar_number', 'id_proof_type', 'id_proof', 'photo',
            'permanent_address', 'city', 'state', 'pincode',
            'institution_type', 'institution_name', 'course_name',
            'emergency_contact_name', 'emergency_contact_phone',
            'bed', 'join_date', 'monthly_rent', 'security_deposit',
            'advance_paid', 'notes'
        ]
