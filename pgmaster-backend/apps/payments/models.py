"""
Payment Models for PGMaster.
"""

from django.db import models
from django.utils import timezone
from datetime import datetime, timedelta
from apps.common.models import BaseModel
from apps.tenants.models import Tenant


class Payment(BaseModel):
    """Model for Rent Payments."""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('partial', 'Partial'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
        ('cancelled', 'Cancelled'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('bank_transfer', 'Bank Transfer'),
        ('upi', 'UPI'),
        ('card', 'Card'),
        ('cheque', 'Cheque'),
    ]
    
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name='payments'
    )
    
    # Payment Details
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Month Reference
    month = models.DateField()  # First day of month for reference
    
    # Due Information
    due_date = models.DateField()
    late_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    extra_charges = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Electricity, water, etc.
    
    # Payment Info
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        null=True,
        blank=True
    )
    
    # Timestamps
    payment_date = models.DateTimeField(null=True, blank=True)
    receipt_number = models.CharField(max_length=50, unique=True, null=True, blank=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        unique_together = ['tenant', 'month']
        ordering = ['-month']
    
    def __str__(self):
        return f"Payment for {self.tenant.tenant_name} - {self.month.strftime('%B %Y')}"
    
    def get_total_amount_due(self):
        """Get total amount due including late fees."""
        if self.status in ['paid', 'cancelled']:
            return 0
        
        total = self.amount + self.extra_charges
        
        # Add late fee if overdue
        if timezone.now().date() > self.due_date:
            total += self.late_fee
        
        return total
    
    def is_overdue(self):
        """Check if payment is overdue."""
        return timezone.now().date() > self.due_date and self.status != 'paid'


class SecurityDeposit(BaseModel):
    """Model for Security Deposit Tracking."""
    
    tenant = models.OneToOneField(
        Tenant,
        on_delete=models.CASCADE,
        related_name='security_deposit_record'
    )
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    deposit_date = models.DateField()
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    refund_date = models.DateField(null=True, blank=True)
    deduction_notes = models.TextField(blank=True)
    
    status = models.CharField(
        max_length=20,
        choices=[
            ('held', 'Held'),
            ('refunded', 'Refunded'),
            ('adjusted', 'Adjusted'),
        ],
        default='held'
    )
    
    class Meta:
        verbose_name_plural = 'Security Deposits'
    
    def __str__(self):
        return f"Security Deposit - {self.tenant.tenant_name}"


class PaymentReceipt(BaseModel):
    """Model for Payment Receipts."""
    
    payment = models.OneToOneField(
        Payment,
        on_delete=models.CASCADE,
        related_name='receipt'
    )
    
    receipt_number = models.CharField(max_length=50, unique=True)
    pdf_file = models.FileField(upload_to='receipts/', null=True, blank=True)
    
    issued_date = models.DateTimeField(auto_now_add=True)
    issued_by = models.CharField(max_length=255, blank=True)
    
    class Meta:
        ordering = ['-issued_date']
    
    def __str__(self):
        return f"Receipt {self.receipt_number}"
