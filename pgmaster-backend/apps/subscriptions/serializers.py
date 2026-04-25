"""
Serializers for Subscriptions App.
"""

from rest_framework import serializers
from .models import SubscriptionPlan, Subscription, Invoice


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    """Serializer for Subscription Plan."""
    
    class Meta:
        model = SubscriptionPlan
        fields = [
            'id', 'name', 'slug', 'price', 'duration_days',
            'max_rooms', 'max_tenants', 'max_staff',
            'features', 'description'
        ]


class SubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for Subscription."""
    
    plan_details = SubscriptionPlanSerializer(source='plan', read_only=True)
    
    class Meta:
        model = Subscription
        fields = [
            'id', 'pg', 'plan', 'plan_details', 'start_date', 'end_date',
            'amount', 'is_paid', 'payment_date', 'transaction_id',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class InvoiceSerializer(serializers.ModelSerializer):
    """Serializer for Invoice."""
    
    class Meta:
        model = Invoice
        fields = [
            'id', 'subscription', 'invoice_number', 'amount',
            'due_date', 'paid_date', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
