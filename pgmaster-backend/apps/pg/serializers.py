"""
Serializers for PG App.
"""

from rest_framework import serializers
from .models import PGProfile, PGStaff, PGSettings


class PGSettingsSerializer(serializers.ModelSerializer):
    """Serializer for PG Settings."""
    
    class Meta:
        model = PGSettings
        fields = [
            'id', 'pg', 'auto_generate_rent', 'rent_due_day', 'late_fee_percentage',
            'enable_electricity_charges', 'electricity_rate',
            'enable_water_charges', 'water_rate',
            'send_email_reminders', 'send_sms_reminders',
            'default_complaint_priority', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PGStaffSerializer(serializers.ModelSerializer):
    """Serializer for PG Staff."""
    
    user_details = serializers.SerializerMethodField()
    
    class Meta:
        model = PGStaff
        fields = [
            'id', 'pg', 'user', 'user_details', 'designation',
            'joining_date', 'salary', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_user_details(self, obj):
        from apps.auth.serializers import UserSerializer
        return UserSerializer(obj.user).data


class PGProfileSerializer(serializers.ModelSerializer):
    """Serializer for PG Profile."""
    
    owner_details = serializers.SerializerMethodField()
    settings = PGSettingsSerializer(read_only=True)
    staff_count = serializers.SerializerMethodField()
    
    class Meta:
        model = PGProfile
        fields = [
            'id', 'owner', 'owner_details', 'name', 'owner_name',
            'address', 'city', 'state', 'pincode', 'phone', 'email',
            'gst_number', 'bank_account', 'ifsc_code', 'logo',
            'subscription_plan', 'subscription_end_date',
            'total_rooms', 'total_beds', 'settings', 'staff_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'owner', 'total_rooms', 'total_beds', 'created_at', 'updated_at']
    
    def get_owner_details(self, obj):
        from apps.auth.serializers import UserSerializer
        return UserSerializer(obj.owner).data
    
    def get_staff_count(self, obj):
        return obj.staff_members.filter(is_active=True).count()
