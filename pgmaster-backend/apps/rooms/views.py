"""
Views for Rooms App.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from utils.permissions import IsPGOwner
from apps.pg.models import PGProfile
from .models import Room, Bed
from .serializers import RoomSerializer, BedSerializer, RoomCreateUpdateSerializer


class RoomViewSet(viewsets.ModelViewSet):
    """ViewSet for Room Management."""
    
    permission_classes = [IsAuthenticated]
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['floor', 'room_type', 'sharing_type']
    search_fields = ['room_number', 'description']
    ordering_fields = ['room_number', 'floor', 'monthly_rent']
    ordering = ['floor', 'room_number']
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'super_admin':
            return Room.objects.all()
        elif user.role == 'pg_owner':
            pg = PGProfile.objects.filter(owner=user).first()
            if pg:
                return Room.objects.filter(pg=pg)
        elif user.role == 'staff':
            pg_staff = user.pg_staff
            if pg_staff:
                return Room.objects.filter(pg=pg_staff.pg)
        
        return Room.objects.none()
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return RoomCreateUpdateSerializer
        return RoomSerializer
    
    def perform_create(self, serializer):
        user = self.request.user
        pg, created = PGProfile.objects.get_or_create(
            owner=user,
            defaults={
                'name': f"{user.first_name}'s PG",
                'owner_name': user.get_full_name(),
                'phone': user.phone or '0000000000',
                'email': user.email,
                'address': 'TBD',
                'city': 'TBD',
                'state': 'TBD',
                'pincode': '000000'
            }
        )
        
        room = serializer.save(pg=pg)
        
        # Auto-create beds based on sharing type
        sharing_type = room.sharing_type
        for i in range(sharing_type):
            bed_label = Bed.BED_LABELS[i]
            Bed.objects.create(
                room=room,
                bed_number=bed_label,
                monthly_rent=room.monthly_rent / sharing_type
            )
        
        # Update total rooms count
        pg.total_rooms = Room.objects.filter(pg=pg, is_active=True).count()
        pg.total_beds = Bed.objects.filter(room__pg=pg, is_active=True).count()
        pg.save()
    
    @action(detail=True, methods=['post'])
    def add_beds(self, request, pk=None):
        """Add beds to a room."""
        room = self.get_object()
        
        # Delete existing beds
        room.beds.all().delete()
        
        # Create new beds
        for i in range(room.sharing_type):
            bed_label = Bed.BED_LABELS[i]
            Bed.objects.create(
                room=room,
                bed_number=bed_label,
                monthly_rent=room.monthly_rent / room.sharing_type
            )
        
        return Response(
            {'message': f'{room.sharing_type} beds created for room {room.room_number}.'},
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=['get'])
    def occupancy_summary(self, request):
        """Get occupancy summary."""
        user = request.user
        
        if user.role == 'pg_owner':
            pg = PGProfile.objects.filter(owner=user).first()
            if not pg:
                return Response(
                    {'error': 'PG profile not found.'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            rooms = Room.objects.filter(pg=pg, is_active=True)
            total_beds = Bed.objects.filter(room__pg=pg, is_active=True).count()
            occupied_beds = Bed.objects.filter(room__pg=pg, occupied=True, is_active=True).count()
            vacant_beds = total_beds - occupied_beds
            
            occupancy_percentage = 0
            if total_beds > 0:
                occupancy_percentage = round((occupied_beds / total_beds) * 100, 2)
            
            return Response({
                'total_rooms': rooms.count(),
                'total_beds': total_beds,
                'occupied_beds': occupied_beds,
                'vacant_beds': vacant_beds,
                'occupancy_percentage': occupancy_percentage,
            })
        
        return Response(
            {'error': 'Permission denied.'},
            status=status.HTTP_403_FORBIDDEN
        )


class BedViewSet(viewsets.ModelViewSet):
    """ViewSet for Bed Management."""
    
    permission_classes = [IsAuthenticated]
    queryset = Bed.objects.all()
    serializer_class = BedSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['room', 'bed_number', 'occupied']
    ordering_fields = ['room', 'bed_number']
    ordering = ['room', 'bed_number']
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'super_admin':
            return Bed.objects.all()
        elif user.role == 'pg_owner':
            pg = PGProfile.objects.filter(owner=user).first()
            if pg:
                return Bed.objects.filter(room__pg=pg)
        elif user.role == 'staff':
            pg_staff = user.pg_staff
            if pg_staff:
                return Bed.objects.filter(room__pg=pg_staff.pg)
        
        return Bed.objects.none()
    
    @action(detail=True, methods=['post'])
    def mark_occupied(self, request, pk=None):
        """Mark bed as occupied."""
        bed = self.get_object()
        bed.occupied = True
        bed.save()
        
        return Response(
            {'message': f'Bed {bed.bed_number} marked as occupied.'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def mark_vacant(self, request, pk=None):
        """Mark bed as vacant."""
        bed = self.get_object()
        bed.occupied = False
        bed.save()
        
        return Response(
            {'message': f'Bed {bed.bed_number} marked as vacant.'},
            status=status.HTTP_200_OK
        )
