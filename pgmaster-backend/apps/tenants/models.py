"""
Tenant Models for PGMaster.
"""

from django.db import models
from django.core.validators import RegexValidator
from apps.common.models import BaseModel
from apps.pg.models import PGProfile
from apps.rooms.models import Bed
from apps.auth.models import User


class Tenant(BaseModel):
    """Model for Tenant in PG."""
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('notice_period', 'Notice Period'),
        ('vacated', 'Vacated'),
        ('inactive', 'Inactive'),
    ]
    
    pg = models.ForeignKey(
        PGProfile,
        on_delete=models.CASCADE,
        related_name='tenants'
    )
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='tenant_profile',
        null=True,
        blank=True,
        limit_choices_to={'role': 'tenant'}
    )
    
    # Personal Information
    tenant_name = models.CharField(max_length=255)
    father_name = models.CharField(max_length=255, blank=True)
    mother_name = models.CharField(max_length=255, blank=True)
    
    phone = models.CharField(
        max_length=15,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message='Phone number must be valid.'
            )
        ]
    )
    alternate_phone = models.CharField(max_length=15, blank=True)
    
    email = models.EmailField(blank=True)
    
    # Identification
    aadhar_number = models.CharField(
        max_length=12,
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^\d{12}$',
                message='Aadhar number must be 12 digits.'
            )
        ]
    )
    
    id_proof_type = models.CharField(
        max_length=20,
        choices=[
            ('aadhar', 'Aadhar'),
            ('pan', 'PAN'),
            ('driving_license', 'Driving License'),
            ('passport', 'Passport'),
        ],
        default='aadhar'
    )
    
    id_proof = models.FileField(upload_to='id_proofs/', null=True, blank=True)
    photo = models.ImageField(upload_to='tenant_photos/', null=True, blank=True)
    
    # Address Information
    permanent_address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=6)
    
    # College/Company Information
    institution_type = models.CharField(
        max_length=20,
        choices=[
            ('college', 'College'),
            ('company', 'Company'),
            ('other', 'Other'),
        ],
        default='college'
    )
    institution_name = models.CharField(max_length=255, blank=True)
    course_name = models.CharField(max_length=255, blank=True)
    
    # Emergency Contact
    emergency_contact_name = models.CharField(max_length=255, blank=True)
    emergency_contact_phone = models.CharField(max_length=15, blank=True)
    
    # Room/Bed Assignment
    bed = models.ForeignKey(
        Bed,
        on_delete=models.SET_NULL,
        null=True,
        related_name='tenants'
    )
    
    # Rental Information
    join_date = models.DateField()
    notice_date = models.DateField(null=True, blank=True)
    vacate_date = models.DateField(null=True, blank=True)
    
    monthly_rent = models.DecimalField(max_digits=10, decimal_places=2)
    security_deposit = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    # Extra Charges
    advance_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
    
    class Meta:
        unique_together = ['pg', 'aadhar_number']
        ordering = ['-join_date']
    
    def __str__(self):
        return f"{self.tenant_name} - {self.pg.name}"
    
    def get_current_rent_due(self):
        """Calculate current rent due."""
        from apps.payments.models import Payment
        from django.utils import timezone
        from datetime import datetime
        
        # Get current month's rent
        current_date = timezone.now()
        rent_due = Payment.objects.filter(
            tenant=self,
            status='pending',
            month__year=current_date.year,
            month__month=current_date.month
        ).first()
        
        if rent_due:
            return rent_due.amount
        return 0
