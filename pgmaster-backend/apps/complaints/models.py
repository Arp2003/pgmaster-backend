"""
Complaint Models for PGMaster.
"""

from django.db import models
from apps.common.models import BaseModel
from apps.tenants.models import Tenant


class Complaint(BaseModel):
    """Model for Tenant Complaints."""
    
    CATEGORY_CHOICES = [
        ('water', 'Water Issue'),
        ('electricity', 'Electricity'),
        ('cleaning', 'Cleaning'),
        ('food', 'Food'),
        ('wifi', 'WiFi'),
        ('maintenance', 'Maintenance'),
        ('noise', 'Noise'),
        ('other', 'Other'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
        ('rejected', 'Rejected'),
    ]
    
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='complaints'
    )
    
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField()
    
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    
    # Attachment
    attachment = models.ImageField(upload_to='complaint_attachments/', null=True, blank=True)
    
    # Handling
    assigned_to = models.CharField(max_length=255, blank=True)  # Staff member name
    resolution_notes = models.TextField(blank=True)
    resolved_date = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.tenant.tenant_name}"


class ComplaintUpdate(BaseModel):
    """Model for Complaint Status Updates."""
    
    complaint = models.ForeignKey(
        Complaint,
        on_delete=models.CASCADE,
        related_name='updates'
    )
    
    status = models.CharField(max_length=20, choices=Complaint.STATUS_CHOICES)
    update_text = models.TextField()
    updated_by = models.CharField(max_length=255)  # User name
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Update for {self.complaint.title}"
