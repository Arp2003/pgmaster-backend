"""
Room and Bed Models for PGMaster.
"""

from django.db import models
from django.db.models import Q
from django.core.exceptions import ValidationError
from apps.common.models import BaseModel
from apps.pg.models import PGProfile


class Room(BaseModel):
    """Model for Room in PG."""
    
    SHARING_CHOICES = [
        (1, 'Single'),
        (2, 'Double/2-Sharing'),
        (3, '3-Sharing'),
        (4, '4-Sharing'),
    ]
    
    ROOM_TYPE_CHOICES = [
        ('ac', 'AC'),
        ('non_ac', 'Non-AC'),
    ]
    
    pg = models.ForeignKey(
        PGProfile,
        on_delete=models.CASCADE,
        related_name='rooms'
    )
    
    room_number = models.CharField(max_length=20)
    floor = models.IntegerField()
    sharing_type = models.IntegerField(choices=SHARING_CHOICES)
    room_type = models.CharField(max_length=10, choices=ROOM_TYPE_CHOICES)
    
    monthly_rent = models.DecimalField(max_digits=10, decimal_places=2)
    advance_required = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    description = models.TextField(blank=True, null=True)
    amenities = models.JSONField(default=list, blank=True)  # List of amenities
    
    class Meta:
        unique_together = ['pg', 'room_number']
        ordering = ['floor', 'room_number']
    
    def __str__(self):
        return f"Room {self.room_number} - {self.pg.name}"
    
    def clean(self):
        if self.floor < 0:
            raise ValidationError({'floor': 'Floor number cannot be negative.'})
    
    def get_occupied_beds(self):
        return self.beds.filter(occupied=True, is_active=True).count()
    
    def get_vacant_beds(self):
        return self.beds.filter(occupied=False, is_active=True).count()
    
    def get_occupancy_percentage(self):
        total_beds = self.beds.filter(is_active=True).count()
        if total_beds == 0:
            return 0
        occupied = self.get_occupied_beds()
        return round((occupied / total_beds) * 100, 2)


class Bed(BaseModel):
    """Model for Bed in a Room."""
    
    BED_LABELS = ['A', 'B', 'C', 'D']
    
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name='beds'
    )
    
    bed_number = models.CharField(max_length=1)  # A, B, C, D
    monthly_rent = models.DecimalField(max_digits=10, decimal_places=2)
    
    occupied = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ['room', 'bed_number']
        ordering = ['bed_number']
    
    def __str__(self):
        return f"Bed {self.bed_number} - {self.room.room_number}"
    
    def get_current_tenant(self):
        """Get current tenant occupying this bed."""
        from apps.tenants.models import Tenant
        return Tenant.objects.filter(
            bed=self,
            is_active=True,
            status__in=['active', 'notice_period']
        ).first()
