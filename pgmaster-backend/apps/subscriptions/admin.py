"""
Admin configuration for Subscriptions App.
"""

from django.contrib import admin
from .models import SubscriptionPlan, Subscription, Invoice


@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'price', 'duration_days', 'max_rooms', 'max_tenants']
    list_filter = ['price']
    search_fields = ['name', 'slug']


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['pg', 'plan', 'start_date', 'end_date', 'amount', 'is_paid']
    list_filter = ['plan', 'is_paid', 'start_date']
    search_fields = ['pg__name']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ['invoice_number', 'subscription', 'amount', 'due_date', 'status']
    list_filter = ['status', 'due_date']
    search_fields = ['invoice_number']
    readonly_fields = ['created_at', 'updated_at']
