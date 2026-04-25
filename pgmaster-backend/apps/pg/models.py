"""
PG Profile and Configuration Models.
"""

from django.db import models
from django.core.validators import RegexValidator
from apps.common.models import BaseModel
from apps.auth.models import User


class PGProfile(BaseModel):
    """Model for PG Profile/Business."""
    
    owner = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='pg_profile',
        limit_choices_to={'role': 'pg_owner'}
    )
    
    name = models.CharField(max_length=255)
    owner_name = models.CharField(max_length=255)
    
    # Address Details
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=6)
    
    # Contact Details
    phone = models.CharField(
        max_length=15,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message='Phone number must be valid.'
            )
        ]
    )
    email = models.EmailField()
    
    # Business Details
    gst_number = models.CharField(max_length=15, blank=True, null=True)
    bank_account = models.CharField(max_length=20, blank=True, null=True)
    ifsc_code = models.CharField(max_length=11, blank=True, null=True)
    
    # Logo and Documents
    logo = models.ImageField(upload_to='pg_logos/', null=True, blank=True)
    
    # Subscription Details
    subscription_plan = models.CharField(
        max_length=20,
        choices=[
            ('starter', 'Starter'),
            ('growth', 'Growth'),
            ('premium', 'Premium'),
        ],
        default='starter'
    )
    subscription_end_date = models.DateField(null=True, blank=True)
    
    # Settings
    total_rooms = models.IntegerField(default=0)
    total_beds = models.IntegerField(default=0)
    
    class Meta:
        verbose_name_plural = 'PG Profiles'
    
    def __str__(self):
        return self.name


class PGStaff(BaseModel):
    """Model for Staff members in PG."""
    
    pg = models.ForeignKey(
        PGProfile,
        on_delete=models.CASCADE,
        related_name='staff_members'
    )
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='pg_staff',
        limit_choices_to={'role': 'staff'}
    )
    
    designation = models.CharField(
        max_length=50,
        choices=[
            ('manager', 'Manager'),
            ('caretaker', 'Caretaker'),
            ('cleaner', 'Cleaner'),
            ('other', 'Other'),
        ]
    )
    
    joining_date = models.DateField()
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    class Meta:
        verbose_name_plural = 'PG Staff'
        unique_together = ['pg', 'user']
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.designation}"


class PGSettings(BaseModel):
    """Model for PG Settings."""
    
    pg = models.OneToOneField(
        PGProfile,
        on_delete=models.CASCADE,
        related_name='settings'
    )
    
    # Payment Settings
    auto_generate_rent = models.BooleanField(default=True)
    rent_due_day = models.IntegerField(default=1)  # 1-31
    late_fee_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=5.00)
    
    # Extra Charges
    enable_electricity_charges = models.BooleanField(default=False)
    electricity_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    enable_water_charges = models.BooleanField(default=False)
    water_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Notification Settings
    send_email_reminders = models.BooleanField(default=True)
    send_sms_reminders = models.BooleanField(default=False)
    
    # Complaint Settings
    default_complaint_priority = models.CharField(
        max_length=20,
        choices=[
            ('low', 'Low'),
            ('medium', 'Medium'),
            ('high', 'High'),
        ],
        default='medium'
    )
    
    class Meta:
        verbose_name_plural = 'PG Settings'
    
    def __str__(self):
        return f"Settings for {self.pg.name}"
