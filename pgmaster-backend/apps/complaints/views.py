"""
Views for Complaints App.
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
from apps.tenants.models import Tenant
from .models import Complaint, ComplaintUpdate
from .serializers import ComplaintSerializer, ComplaintCreateUpdateSerializer, ComplaintUpdateSerializer


class ComplaintViewSet(viewsets.ModelViewSet):
    """ViewSet for Complaint Management."""
    
    permission_classes = [IsAuthenticated]
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'priority', 'status']
    search_fields = ['title', 'description', 'tenant__tenant_name']
    ordering_fields = ['created_at', 'priority', 'status']
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'super_admin':
            return Complaint.objects.all()
        elif user.role == 'pg_owner':
            pg = PGProfile.objects.filter(owner=user).first()
            if pg:
                return Complaint.objects.filter(tenant__pg=pg)
        elif user.role == 'tenant':
            try:
                tenant = Tenant.objects.get(user=user)
                return Complaint.objects.filter(tenant=tenant)
            except Tenant.DoesNotExist:
                pass
        elif user.role == 'staff':
            pg_staff = user.pg_staff
            if pg_staff:
                return Complaint.objects.filter(tenant__pg=pg_staff.pg)
        
        return Complaint.objects.none()
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ComplaintCreateUpdateSerializer
        return ComplaintSerializer
    
    def perform_create(self, serializer):
        user = self.request.user
        print(f"--- Creating Complaint ---")
        print(f"User: {user.email}, Role: {user.role}")
        
        if user.role == 'tenant':
            try:
                tenant = Tenant.objects.get(user=user)
                print(f"Found Tenant: {tenant.tenant_name}")
                serializer.save(tenant=tenant)
            except Tenant.DoesNotExist:
                print(f"Tenant profile NOT FOUND for user {user.email}")
                from rest_framework import serializers
                raise serializers.ValidationError('You do not have an active tenant profile linked to your account. Please ask the PG owner to link your email.')
        else:
            print(f"Non-tenant creating complaint. Data: {serializer.validated_data}")
            serializer.save()
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update complaint status with notes."""
        complaint = self.get_object()
        
        new_status = request.data.get('status')
        update_text = request.data.get('update_text', '')
        
        if not new_status:
            return Response(
                {'error': 'status is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update complaint status
        complaint.status = new_status
        
        if new_status == 'resolved':
            complaint.resolved_date = timezone.now()
        
        complaint.save()
        
        # Create update record
        ComplaintUpdate.objects.create(
            complaint=complaint,
            status=new_status,
            update_text=update_text,
            updated_by=request.user.get_full_name() or request.user.username
        )
        
        return Response(
            {
                'message': 'Complaint status updated.',
                'complaint': ComplaintSerializer(complaint).data
            },
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'])
    def my_complaints(self, request):
        """Get current tenant's complaints."""
        user = request.user
        
        if user.role == 'tenant':
            try:
                tenant = Tenant.objects.get(user=user)
                complaints = Complaint.objects.filter(tenant=tenant)
                serializer = ComplaintSerializer(complaints, many=True)
                return Response(serializer.data)
            except Tenant.DoesNotExist:
                return Response(
                    {'error': 'Tenant profile not found.'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        return Response(
            {'error': 'Permission denied.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    @action(detail=False, methods=['get'])
    def open_complaints(self, request):
        """Get all open complaints in PG."""
        user = request.user
        
        if user.role == 'pg_owner':
            pg = PGProfile.objects.filter(owner=user).first()
            if pg:
                complaints = Complaint.objects.filter(
                    tenant__pg=pg,
                    status__in=['open', 'in_progress']
                )
                serializer = ComplaintSerializer(complaints, many=True)
                return Response(serializer.data)
        
        return Response(
            {'error': 'Permission denied.'},
            status=status.HTTP_403_FORBIDDEN
        )
