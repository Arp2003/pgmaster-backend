"""
Views for Tenants App.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.utils import timezone

from utils.permissions import IsPGOwner
from apps.pg.models import PGProfile
from apps.rooms.models import Bed
from .models import Tenant
from .serializers import TenantSerializer, TenantCreateUpdateSerializer
from apps.auth.models import User
import secrets

class TenantViewSet(viewsets.ModelViewSet):
    """ViewSet for Tenant Management."""
    
    permission_classes = [IsAuthenticated]
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'institution_type', 'city']
    search_fields = ['tenant_name', 'phone', 'aadhar_number', 'email']
    ordering_fields = ['join_date', 'tenant_name', 'monthly_rent']
    ordering = ['-join_date']
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'super_admin':
            return Tenant.objects.all()
        elif user.role == 'pg_owner':
            pg = PGProfile.objects.filter(owner=user).first()
            if pg:
                return Tenant.objects.filter(pg=pg)
        elif user.role == 'tenant':
            return Tenant.objects.filter(user=user)
        elif user.role == 'staff':
            pg_staff = user.pg_staff
            if pg_staff:
                return Tenant.objects.filter(pg=pg_staff.pg)
        
        return Tenant.objects.none()
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return TenantCreateUpdateSerializer
        return TenantSerializer
    
    def perform_create(self, serializer):
        user = self.request.user
        pg = PGProfile.objects.get(owner=user)
        
        # Link or create a user account for the tenant
        email = serializer.validated_data.get('email')
        tenant_user = None
        if email:
            tenant_user = User.objects.filter(email=email).first()
            if not tenant_user:
                # Create a placeholder user
                username = email.split('@')[0] + "_" + secrets.token_hex(2)
                tenant_user = User.objects.create_user(
                    username=username,
                    email=email,
                    first_name=serializer.validated_data.get('tenant_name'),
                    role='tenant'
                )
                tenant_user.set_password('Tenant@123') # Default password
                tenant_user.save()
        
        tenant = serializer.save(pg=pg, user=tenant_user)
        
        # Mark bed as occupied
        if tenant.bed:
            tenant.bed.occupied = True
            tenant.bed.save()
    
    @action(detail=True, methods=['post'])
    def move_to_room(self, request, pk=None):
        """Move tenant to another room/bed."""
        tenant = self.get_object()
        
        bed_id = request.data.get('bed_id')
        if not bed_id:
            return Response(
                {'error': 'bed_id is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            new_bed = Bed.objects.get(id=bed_id)
        except Bed.DoesNotExist:
            return Response(
                {'error': 'Bed not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Mark old bed as vacant
        if tenant.bed:
            tenant.bed.occupied = False
            tenant.bed.save()
        
        # Mark new bed as occupied
        new_bed.occupied = True
        new_bed.save()
        
        # Update tenant
        tenant.bed = new_bed
        tenant.save()
        
        return Response(
            {
                'message': f'Tenant moved to {new_bed.room.room_number}-{new_bed.bed_number}.',
                'tenant': TenantSerializer(tenant).data
            },
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def vacate(self, request, pk=None):
        """Vacate a tenant."""
        tenant = self.get_object()
        
        # Mark bed as vacant
        if tenant.bed:
            tenant.bed.occupied = False
            tenant.bed.save()
        
        # Update tenant status
        tenant.status = 'vacated'
        tenant.vacate_date = timezone.now().date()
        tenant.bed = None
        tenant.save()
        
        return Response(
            {
                'message': 'Tenant vacated successfully.',
                'tenant': TenantSerializer(tenant).data
            },
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def issue_notice(self, request, pk=None):
        """Issue notice to tenant."""
        tenant = self.get_object()
        
        notice_days = request.data.get('notice_days', 30)
        tenant.status = 'notice_period'
        tenant.notice_date = timezone.now().date()
        tenant.save()
        
        return Response(
            {
                'message': f'Notice issued. Vacate date: {tenant.notice_date}.',
                'tenant': TenantSerializer(tenant).data
            },
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'])
    def active_tenants(self, request):
        """Get all active tenants."""
        user = request.user
        
        if user.role == 'pg_owner':
            pg = PGProfile.objects.filter(owner=user).first()
            if pg:
                tenants = Tenant.objects.filter(
                    pg=pg,
                    status__in=['active', 'notice_period'],
                    is_active=True
                )
                serializer = TenantSerializer(tenants, many=True)
                return Response(serializer.data)
        
        return Response(
            {'error': 'Permission denied.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    @action(detail=False, methods=['get'])
    def vacated_tenants(self, request):
        """Get all vacated tenants."""
        user = request.user
        
        if user.role == 'pg_owner':
            pg = PGProfile.objects.filter(owner=user).first()
            if pg:
                tenants = Tenant.objects.filter(
                    pg=pg,
                    status='vacated'
                )
                serializer = TenantSerializer(tenants, many=True)
                return Response(serializer.data)
        
        return Response(
            {'error': 'Permission denied.'},
            status=status.HTTP_403_FORBIDDEN
        )
