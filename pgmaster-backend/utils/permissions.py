"""
Custom Permissions for PGMaster.
"""

from rest_framework.permissions import BasePermission


class IsPGOwner(BasePermission):
    """Permission to check if user is a PG owner."""
    
    def has_permission(self, request, view):
        return request.user and request.user.role == 'pg_owner'


class IsStaff(BasePermission):
    """Permission to check if user is staff."""
    
    def has_permission(self, request, view):
        return request.user and request.user.role == 'staff'


class IsTenant(BasePermission):
    """Permission to check if user is a tenant."""
    
    def has_permission(self, request, view):
        return request.user and request.user.role == 'tenant'


class IsSuperAdmin(BasePermission):
    """Permission to check if user is super admin."""
    
    def has_permission(self, request, view):
        return request.user and request.user.role == 'super_admin'


class IsOwnerOrAdmin(BasePermission):
    """Permission to check if user is the owner or admin."""
    
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user or request.user.role == 'super_admin'


class IsPGOwnerOfObject(BasePermission):
    """Permission to check if user owns the PG object."""
    
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'pg'):
            return obj.pg.owner == request.user
        elif hasattr(obj, 'owner'):
            return obj.owner == request.user
        return False
