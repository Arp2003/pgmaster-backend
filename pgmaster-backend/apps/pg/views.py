"""
Views for PG App.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from utils.permissions import IsPGOwner, IsPGOwnerOfObject
from .models import PGProfile, PGStaff, PGSettings
from .serializers import PGProfileSerializer, PGStaffSerializer, PGSettingsSerializer


class PGProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for PG Profile Management."""
    
    serializer_class = PGProfileSerializer
    permission_classes = [IsAuthenticated, IsPGOwner]
    queryset = PGProfile.objects.all()
    
    def get_queryset(self):
        if self.request.user.role == 'super_admin':
            return PGProfile.objects.all()
        elif self.request.user.role == 'pg_owner':
            return PGProfile.objects.filter(owner=self.request.user)
        return PGProfile.objects.none()
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        # Create default settings
        pg = serializer.instance
        PGSettings.objects.get_or_create(pg=pg)
    
    @action(detail=False, methods=['get'])
    def my_pg(self, request):
        """Get current user's PG profile."""
        try:
            pg = PGProfile.objects.get(owner=request.user)
            serializer = self.get_serializer(pg)
            return Response(serializer.data)
        except PGProfile.DoesNotExist:
            return Response(
                {'error': 'PG profile not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['put'])
    def update_settings(self, request, pk=None):
        """Update PG settings."""
        pg = self.get_object()
        settings = pg.settings
        serializer = PGSettingsSerializer(settings, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data)


class PGStaffViewSet(viewsets.ModelViewSet):
    """ViewSet for PG Staff Management."""
    
    serializer_class = PGStaffSerializer
    permission_classes = [IsAuthenticated, IsPGOwner]
    queryset = PGStaff.objects.all()
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'super_admin':
            return PGStaff.objects.all()
        elif user.role == 'pg_owner':
            return PGStaff.objects.filter(pg__owner=user)
        elif user.role == 'staff':
            return PGStaff.objects.filter(user=user)
        
        return PGStaff.objects.none()
    
    def perform_create(self, serializer):
        user = self.request.user
        pg = PGProfile.objects.get(owner=user)
        serializer.save(pg=pg)
    
    @action(detail=True, methods=['put'])
    def deactivate(self, request, pk=None):
        """Deactivate staff member."""
        staff = self.get_object()
        staff.is_active = False
        staff.save()
        
        return Response(
            {'message': 'Staff member deactivated.'},
            status=status.HTTP_200_OK
        )
