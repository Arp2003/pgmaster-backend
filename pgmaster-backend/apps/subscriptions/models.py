"""
Subscription Models for PGMaster.
"""

from django.db import models
from apps.common.models import BaseModel
from apps.pg.models import PGProfile


class SubscriptionPlan(BaseModel):
    """Model for Subscription Plans."""
    
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_days = models.IntegerField(default=30)
    
    # Features
    max_rooms = models.IntegerField()
    max_tenants = models.IntegerField()
    max_staff = models.IntegerField()
    
    features = models.JSONField(default=list, blank=True)
    
    description = models.TextField(blank=True)
    
    class Meta:
        ordering = ['price']
    
    def __str__(self):
        return self.name


class Subscription(BaseModel):
    """Model for PG Subscriptions."""
    
    pg = models.OneToOneField(
        PGProfile,
        on_delete=models.CASCADE,
        related_name='subscription'
    )
    
    plan = models.ForeignKey(
        SubscriptionPlan,
        on_delete=models.SET_NULL,
        null=True
    )
    
    # Dates
    start_date = models.DateField()
    end_date = models.DateField()
    
    # Payment
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_paid = models.BooleanField(default=False)
    payment_date = models.DateTimeField(null=True, blank=True)
    transaction_id = models.CharField(max_length=100, blank=True)
    
    class Meta:
        ordering = ['-start_date']
    
    def __str__(self):
        return f"{self.pg.name} - {self.plan.name}"


class Invoice(BaseModel):
    """Model for Invoices."""
    
    subscription = models.ForeignKey(
        Subscription,
        on_delete=models.CASCADE,
        related_name='invoices'
    )
    
    invoice_number = models.CharField(max_length=50, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    due_date = models.DateField()
    paid_date = models.DateField(null=True, blank=True)
    
    status = models.CharField(
        max_length=20,
        choices=[
            ('draft', 'Draft'),
            ('sent', 'Sent'),
            ('paid', 'Paid'),
            ('overdue', 'Overdue'),
        ],
        default='draft'
    )
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.invoice_number
