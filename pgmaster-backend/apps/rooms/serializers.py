"""
Serializers for Rooms App.
"""

from rest_framework import serializers
from .models import Room, Bed


class BedSerializer(serializers.ModelSerializer):
    """Serializer for Bed model."""
    
    current_tenant = serializers.SerializerMethodField()
    room_number = serializers.CharField(source='room.room_number', read_only=True)
    sharing_type = serializers.IntegerField(source='room.sharing_type', read_only=True)
    
    class Meta:
        model = Bed
        fields = [
            'id', 'room', 'room_number', 'sharing_type', 'bed_number', 'monthly_rent', 'occupied',
            'current_tenant', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_current_tenant(self, obj):
        tenant = obj.get_current_tenant()
        if tenant:
            return {
                'id': tenant.id,
                'name': tenant.tenant_name,
                'phone': tenant.phone,
                'join_date': tenant.join_date,
            }
        return None


class RoomSerializer(serializers.ModelSerializer):
    """Serializer for Room model."""
    
    beds = BedSerializer(many=True, read_only=True)
    occupied_beds = serializers.SerializerMethodField()
    vacant_beds = serializers.SerializerMethodField()
    occupancy_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = Room
        fields = [
            'id', 'pg', 'room_number', 'floor', 'sharing_type', 'room_type',
            'monthly_rent', 'advance_required', 'description', 'amenities',
            'beds', 'occupied_beds', 'vacant_beds', 'occupancy_percentage',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'occupied_beds', 'vacant_beds', 'occupancy_percentage', 'created_at', 'updated_at']
    
    def get_occupied_beds(self, obj):
        return obj.get_occupied_beds()
    
    def get_vacant_beds(self, obj):
        return obj.get_vacant_beds()
    
    def get_occupancy_percentage(self, obj):
        return obj.get_occupancy_percentage()


class RoomCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating rooms."""
    
    class Meta:
        model = Room
        fields = [
            'room_number', 'floor', 'sharing_type', 'room_type',
            'monthly_rent', 'advance_required', 'description', 'amenities'
        ]
