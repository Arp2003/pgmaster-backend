"""
Views for Reports.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import csv
from io import BytesIO
from django.http import HttpResponse

from apps.pg.models import PGProfile
from apps.rooms.models import Room, Bed
from apps.tenants.models import Tenant
from apps.payments.models import Payment


class ReportsViewSet(viewsets.ViewSet):
    """ViewSet for generating various reports."""
    
    permission_classes = [IsAuthenticated]
    
    def get_pg_or_404(self, user):
        """Get user's PG or return None."""
        if user.role == 'pg_owner':
            return PGProfile.objects.filter(owner=user).first()
        return None
    
    @action(detail=False, methods=['get'])
    def occupancy_report(self, request):
        """Generate occupancy report."""
        user = request.user
        pg = self.get_pg_or_404(user)
        
        if not pg:
            return Response(
                {'error': 'PG not found or permission denied.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        rooms = Room.objects.filter(pg=pg, is_active=True)
        
        total_rooms = rooms.count()
        total_beds = Bed.objects.filter(room__pg=pg, is_active=True).count()
        occupied_beds = Bed.objects.filter(
            room__pg=pg,
            occupied=True,
            is_active=True
        ).count()
        vacant_beds = total_beds - occupied_beds
        
        occupancy_percentage = 0
        if total_beds > 0:
            occupancy_percentage = round((occupied_beds / total_beds) * 100, 2)
        
        room_data = []
        for room in rooms:
            room_data.append({
                'room_number': room.room_number,
                'floor': room.floor,
                'sharing_type': room.sharing_type,
                'room_type': room.room_type,
                'occupied_beds': room.get_occupied_beds(),
                'vacant_beds': room.get_vacant_beds(),
                'occupancy_percentage': room.get_occupancy_percentage(),
            })
        
        return Response({
            'pg_name': pg.name,
            'total_rooms': total_rooms,
            'total_beds': total_beds,
            'occupied_beds': occupied_beds,
            'vacant_beds': vacant_beds,
            'occupancy_percentage': occupancy_percentage,
            'room_details': room_data,
        })
    
    @action(detail=False, methods=['get'])
    def rent_pending_report(self, request):
        """Generate pending rent report."""
        user = request.user
        pg = self.get_pg_or_404(user)
        
        if not pg:
            return Response(
                {'error': 'PG not found or permission denied.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        pending_payments = Payment.objects.filter(
            tenant__pg=pg,
            status__in=['pending', 'partial', 'overdue']
        )
        
        total_pending = pending_payments.aggregate(Sum('amount'))['amount__sum'] or 0
        
        payment_data = []
        for payment in pending_payments:
            payment_data.append({
                'tenant_name': payment.tenant.tenant_name,
                'amount': float(payment.amount),
                'paid_amount': float(payment.paid_amount),
                'month': payment.month.strftime('%B %Y'),
                'due_date': payment.due_date,
                'status': payment.status,
                'days_overdue': (timezone.now().date() - payment.due_date).days if payment.due_date < timezone.now().date() else 0,
            })
        
        return Response({
            'pg_name': pg.name,
            'total_pending_amount': float(total_pending),
            'pending_count': pending_payments.count(),
            'pending_payments': payment_data,
        })
    
    @action(detail=False, methods=['get'])
    def monthly_income_report(self, request):
        """Generate monthly income report."""
        user = request.user
        pg = self.get_pg_or_404(user)
        
        if not pg:
            return Response(
                {'error': 'PG not found or permission denied.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Last 12 months
        data = []
        for i in range(11, -1, -1):
            month_date = timezone.now().date() - relativedelta(months=i)
            month_start = month_date.replace(day=1)
            month_end = (month_start + relativedelta(months=1)) - timedelta(days=1)
            
            income = Payment.objects.filter(
                tenant__pg=pg,
                payment_date__date__range=[month_start, month_end],
                status='paid'
            ).aggregate(Sum('paid_amount'))['paid_amount__sum'] or 0
            
            data.append({
                'month': month_date.strftime('%B %Y'),
                'income': float(income),
            })
        
        return Response({
            'pg_name': pg.name,
            'monthly_data': data,
        })
    
    @action(detail=False, methods=['get'])
    def tenant_register_report(self, request):
        """Generate tenant register report."""
        user = request.user
        pg = self.get_pg_or_404(user)
        
        if not pg:
            return Response(
                {'error': 'PG not found or permission denied.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        tenants = Tenant.objects.filter(pg=pg)
        
        tenant_data = []
        for tenant in tenants:
            tenant_data.append({
                'tenant_name': tenant.tenant_name,
                'phone': tenant.phone,
                'aadhar': tenant.aadhar_number,
                'room': tenant.bed.room.room_number if tenant.bed else 'N/A',
                'bed': tenant.bed.bed_number if tenant.bed else 'N/A',
                'join_date': tenant.join_date,
                'monthly_rent': float(tenant.monthly_rent),
                'status': tenant.status,
            })
        
        return Response({
            'pg_name': pg.name,
            'total_tenants': tenants.count(),
            'active_tenants': tenants.filter(status__in=['active', 'notice_period']).count(),
            'vacated_tenants': tenants.filter(status='vacated').count(),
            'tenant_details': tenant_data,
        })
    
    @action(detail=False, methods=['get'])
    def export_occupancy_csv(self, request):
        """Export occupancy report as CSV."""
        user = request.user
        pg = self.get_pg_or_404(user)
        
        if not pg:
            return Response(
                {'error': 'Permission denied.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="occupancy_report.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Room Number', 'Floor', 'Sharing Type', 'Room Type', 'Occupied', 'Vacant', 'Occupancy %'])
        
        rooms = Room.objects.filter(pg=pg, is_active=True)
        for room in rooms:
            writer.writerow([
                room.room_number,
                room.floor,
                room.sharing_type,
                room.room_type,
                room.get_occupied_beds(),
                room.get_vacant_beds(),
                room.get_occupancy_percentage(),
            ])
        
        return response
