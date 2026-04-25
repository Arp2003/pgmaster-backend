"""
Serializers for Payments App.
"""

from rest_framework import serializers
from datetime import datetime, timedelta
from .models import Payment, SecurityDeposit, PaymentReceipt


class PaymentReceiptSerializer(serializers.ModelSerializer):
    """Serializer for Payment Receipt."""
    
    class Meta:
        model = PaymentReceipt
        fields = [
            'id', 'payment', 'receipt_number', 'pdf_file',
            'issued_date', 'issued_by'
        ]
        read_only_fields = ['id', 'issued_date']


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payment model."""
    
    receipt = PaymentReceiptSerializer(read_only=True)
    tenant_details = serializers.SerializerMethodField()
    total_due = serializers.SerializerMethodField()
    is_overdue = serializers.SerializerMethodField()
    
    class Meta:
        model = Payment
        fields = [
            'id', 'tenant', 'tenant_details', 'amount', 'paid_amount',
            'month', 'due_date', 'late_fee', 'extra_charges',
            'status', 'payment_method', 'payment_date', 'receipt_number',
            'receipt', 'total_due', 'is_overdue', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'tenant', 'total_due', 'is_overdue',
            'created_at', 'updated_at'
        ]
    
    def get_tenant_details(self, obj):
        return {
            'id': obj.tenant.id,
            'name': obj.tenant.tenant_name,
            'phone': obj.tenant.phone,
        }
    
    def get_total_due(self, obj):
        return float(obj.get_total_amount_due())
    
    def get_is_overdue(self, obj):
        return obj.is_overdue()


class PaymentCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating payments."""
    
    class Meta:
        model = Payment
        fields = [
            'amount', 'paid_amount', 'month', 'due_date',
            'late_fee', 'extra_charges', 'status',
            'payment_method', 'payment_date', 'receipt_number', 'notes'
        ]


class SecurityDepositSerializer(serializers.ModelSerializer):
    """Serializer for Security Deposit."""
    
    tenant_details = serializers.SerializerMethodField()
    
    class Meta:
        model = SecurityDeposit
        fields = [
            'id', 'tenant', 'tenant_details', 'amount', 'deposit_date',
            'refund_amount', 'refund_date', 'deduction_notes', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_tenant_details(self, obj):
        return {
            'id': obj.tenant.id,
            'name': obj.tenant.tenant_name,
        }
