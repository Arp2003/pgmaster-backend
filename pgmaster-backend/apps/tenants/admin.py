"""
Admin configuration for Tenants App.
"""

from django.contrib import admin
from .models import Tenant


@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ['tenant_name', 'pg', 'phone', 'aadhar_number', 'status', 'join_date', 'monthly_rent']
    list_filter = ['pg', 'status', 'institution_type', 'join_date']
    search_fields = ['tenant_name', 'phone', 'aadhar_number', 'email']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('tenant_name', 'father_name', 'mother_name', 'phone', 'alternate_phone', 'email')
        }),
        ('Identification', {
            'fields': ('aadhar_number', 'id_proof_type', 'id_proof', 'photo')
        }),
        ('Address', {
            'fields': ('permanent_address', 'city', 'state', 'pincode')
        }),
        ('Institution', {
            'fields': ('institution_type', 'institution_name', 'course_name')
        }),
        ('Emergency Contact', {
            'fields': ('emergency_contact_name', 'emergency_contact_phone')
        }),
        ('Room Assignment', {
            'fields': ('pg', 'bed')
        }),
        ('Rental Information', {
            'fields': ('join_date', 'notice_date', 'vacate_date', 'monthly_rent', 'security_deposit', 'advance_paid', 'status')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
    )
