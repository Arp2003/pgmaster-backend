"""
Admin configuration for Payments App.
"""

from django.contrib import admin
from .models import Payment, SecurityDeposit, PaymentReceipt


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['tenant', 'month', 'amount', 'paid_amount', 'status', 'due_date', 'payment_method']
    list_filter = ['status', 'payment_method', 'month', 'due_date']
    search_fields = ['tenant__tenant_name', 'receipt_number']
    readonly_fields = ['created_at', 'updated_at', 'receipt_number']
    
    fieldsets = (
        ('Tenant', {
            'fields': ('tenant',)
        }),
        ('Payment Details', {
            'fields': ('amount', 'paid_amount', 'late_fee', 'extra_charges')
        }),
        ('Month & Dates', {
            'fields': ('month', 'due_date', 'payment_date')
        }),
        ('Status & Method', {
            'fields': ('status', 'payment_method', 'receipt_number')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
    )


@admin.register(SecurityDeposit)
class SecurityDepositAdmin(admin.ModelAdmin):
    list_display = ['tenant', 'amount', 'refund_amount', 'status', 'deposit_date', 'refund_date']
    list_filter = ['status', 'deposit_date', 'refund_date']
    search_fields = ['tenant__tenant_name']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(PaymentReceipt)
class PaymentReceiptAdmin(admin.ModelAdmin):
    list_display = ['receipt_number', 'payment', 'issued_date', 'issued_by']
    list_filter = ['issued_date']
    search_fields = ['receipt_number', 'payment__receipt_number']
    readonly_fields = ['issued_date', 'created_at', 'updated_at']
