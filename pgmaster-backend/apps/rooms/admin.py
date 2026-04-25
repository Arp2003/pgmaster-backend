"""
Admin configuration for Rooms App.
"""

from django.contrib import admin
from .models import Room, Bed


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ['room_number', 'pg', 'floor', 'sharing_type', 'room_type', 'monthly_rent', 'is_active']
    list_filter = ['pg', 'floor', 'sharing_type', 'room_type', 'is_active']
    search_fields = ['room_number', 'pg__name']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Bed)
class BedAdmin(admin.ModelAdmin):
    list_display = ['bed_number', 'room', 'monthly_rent', 'occupied', 'is_active']
    list_filter = ['occupied', 'is_active']
    search_fields = ['room__room_number', 'bed_number']
    readonly_fields = ['created_at', 'updated_at']
