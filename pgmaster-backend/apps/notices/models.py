"""
Notice Models for PGMaster.
"""

from django.db import models
from apps.common.models import BaseModel
from apps.pg.models import PGProfile


class Notice(BaseModel):
    """Model for Notices/Announcements."""
    
    NOTICE_TYPE_CHOICES = [
        ('rent_reminder', 'Rent Reminder'),
        ('maintenance', 'Maintenance/Shutdown'),
        ('rules_update', 'Rules Update'),
        ('event', 'Event Notice'),
        ('other', 'Other'),
    ]
    
    pg = models.ForeignKey(
        PGProfile,
        on_delete=models.CASCADE,
        related_name='notices'
    )
    
    title = models.CharField(max_length=255)
    notice_type = models.CharField(max_length=20, choices=NOTICE_TYPE_CHOICES)
    content = models.TextField()
    
    # Targeting
    send_to_all = models.BooleanField(default=True)
    target_rooms = models.JSONField(default=list, blank=True)  # List of room IDs
    
    # Status
    is_sent = models.BooleanField(default=False)
    sent_date = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.pg.name}"
