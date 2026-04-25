"""
Views for Payments App.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.utils import timezone
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import uuid

from utils.permissions import IsPGOwner
from apps.pg.models import PGProfile
from apps.tenants.models import Tenant
from .models import Payment, SecurityDeposit, PaymentReceipt
from .serializers import PaymentSerializer, PaymentCreateUpdateSerializer, SecurityDepositSerializer
from .integrations import StripeIntegration


class PaymentViewSet(viewsets.ModelViewSet):
    """ViewSet for Payment Management."""
    
    permission_classes = [IsAuthenticated]
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'month', 'payment_method']
    search_fields = ['tenant__tenant_name', 'tenant__phone']
    ordering_fields = ['month', 'due_date', 'amount']
    ordering = ['-month']
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'super_admin':
            return Payment.objects.all()
        elif user.role == 'pg_owner':
            pg = PGProfile.objects.filter(owner=user).first()
            if pg:
                return Payment.objects.filter(tenant__pg=pg)
        elif user.role == 'tenant':
            try:
                tenant = Tenant.objects.get(user=user)
                return Payment.objects.filter(tenant=tenant)
            except Tenant.DoesNotExist:
                pass
        elif user.role == 'staff':
            pg_staff = user.pg_staff
            if pg_staff:
                return Payment.objects.filter(tenant__pg=pg_staff.pg)
        
        return Payment.objects.none()
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return PaymentCreateUpdateSerializer
        return PaymentSerializer
    
    @action(detail=False, methods=['post'])
    def generate_monthly_rent(self, request):
        """Generate monthly rent for all active tenants in a PG."""
        user = request.user
        month = request.data.get('month')  # YYYY-MM-DD format
        
        if user.role != 'pg_owner':
            return Response(
                {'error': 'Permission denied.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            pg = PGProfile.objects.get(owner=user)
            month_date = datetime.strptime(month, '%Y-%m-%d').date()
        except (ValueError, PGProfile.DoesNotExist):
            return Response(
                {'error': 'Invalid month format or PG not found.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get all active tenants
        tenants = Tenant.objects.filter(
            pg=pg,
            status__in=['active', 'notice_period']
        )
        
        created_count = 0
        
        for tenant in tenants:
            # Check if payment already exists
            payment_exists = Payment.objects.filter(
                tenant=tenant,
                month__year=month_date.year,
                month__month=month_date.month
            ).exists()
            
            if not payment_exists:
                # Calculate due date based on PG settings
                due_day = pg.settings.rent_due_day
                due_date = month_date.replace(day=min(due_day, 28))
                if due_date < month_date:
                    due_date += relativedelta(months=1)
                
                Payment.objects.create(
                    tenant=tenant,
                    amount=tenant.monthly_rent,
                    month=month_date,
                    due_date=due_date,
                    status='pending'
                )
                created_count += 1
        
        return Response(
            {
                'message': f'Generated rent for {created_count} tenants.',
                'count': created_count
            },
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'])
    def record_payment(self, request, pk=None):
        """Record a payment for rent."""
        payment = self.get_object()
        
        amount = request.data.get('amount')
        payment_method = request.data.get('payment_method')
        
        if not amount or not payment_method:
            return Response(
                {'error': 'amount and payment_method are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            amount = float(amount)
        except ValueError:
            return Response(
                {'error': 'Invalid amount.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update payment
        payment.paid_amount += amount
        payment.payment_method = payment_method
        payment.payment_date = timezone.now()
        
        # Generate receipt number
        payment.receipt_number = f"RCP-{payment.tenant.pg.id}-{uuid.uuid4().hex[:8].upper()}"
        
        # Determine status
        total_due = payment.get_total_amount_due()
        if payment.paid_amount >= total_due:
            payment.status = 'paid'
        elif payment.paid_amount > 0:
            payment.status = 'partial'
        
        payment.save()
        
        # Create receipt
        PaymentReceipt.objects.create(
            payment=payment,
            receipt_number=payment.receipt_number
        )
        
        return Response(
            {
                'message': 'Payment recorded successfully.',
                'payment': PaymentSerializer(payment).data
            },
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def process_stripe_payment(self, request, pk=None):
        """Process payment via Stripe gateway placeholder."""
        payment = self.get_object()
        amount = request.data.get('amount')
        
        if not amount:
            return Response({'error': 'Amount is required.'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            amount = float(amount)
        except ValueError:
            return Response({'error': 'Invalid amount.'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Process with Mock Stripe
        result = StripeIntegration.process_payment(amount=amount)
        
        if result['success']:
            payment.paid_amount += amount
            payment.payment_method = 'online'
            payment.payment_date = timezone.now()
            payment.receipt_number = f"STRIPE-{payment.tenant.pg.id}-{uuid.uuid4().hex[:8].upper()}"
            
            total_due = payment.get_total_amount_due()
            if payment.paid_amount >= total_due:
                payment.status = 'paid'
            elif payment.paid_amount > 0:
                payment.status = 'partial'
                
            payment.save()
            
            PaymentReceipt.objects.create(
                payment=payment,
                receipt_number=payment.receipt_number
            )
            
            return Response({
                'message': 'Stripe payment successful.',
                'transaction_id': result['transaction_id'],
                'payment': PaymentSerializer(payment).data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Payment failed.',
                'details': result['error']
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def pending_payments(self, request):
        """Get all pending payments."""
        user = request.user
        
        if user.role == 'pg_owner':
            pg = PGProfile.objects.filter(owner=user).first()
            if pg:
                payments = Payment.objects.filter(
                    tenant__pg=pg,
                    status__in=['pending', 'partial', 'overdue']
                )
                serializer = PaymentSerializer(payments, many=True)
                return Response(serializer.data)
        
        return Response(
            {'error': 'Permission denied.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    @action(detail=False, methods=['get'])
    def my_payments(self, request):
        """Get current tenant's payment history."""
        user = request.user
        
        if user.role == 'tenant':
            try:
                tenant = Tenant.objects.get(user=user)
                payments = Payment.objects.filter(tenant=tenant)
                serializer = PaymentSerializer(payments, many=True)
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


class SecurityDepositViewSet(viewsets.ModelViewSet):
    """ViewSet for Security Deposit Management."""
    
    permission_classes = [IsAuthenticated]
    queryset = SecurityDeposit.objects.all()
    serializer_class = SecurityDepositSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['tenant__tenant_name']
    ordering_fields = ['deposit_date', 'refund_date']
    ordering = ['-deposit_date']
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'super_admin':
            return SecurityDeposit.objects.all()
        elif user.role == 'pg_owner':
            pg = PGProfile.objects.filter(owner=user).first()
            if pg:
                return SecurityDeposit.objects.filter(tenant__pg=pg)
        elif user.role == 'tenant':
            try:
                tenant = Tenant.objects.get(user=user)
                return SecurityDeposit.objects.filter(tenant=tenant)
            except Tenant.DoesNotExist:
                pass
        
        return SecurityDeposit.objects.none()
