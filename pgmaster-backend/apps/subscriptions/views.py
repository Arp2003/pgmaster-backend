"""
Views for Subscriptions App.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.pg.models import PGProfile
from .models import SubscriptionPlan, Subscription, Invoice
from .serializers import SubscriptionPlanSerializer, SubscriptionSerializer, InvoiceSerializer


class SubscriptionPlanViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for browsing Subscription Plans."""
    
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [IsAuthenticated]


class SubscriptionViewSet(viewsets.ModelViewSet):
    """ViewSet for Subscription Management."""
    
    permission_classes = [IsAuthenticated]
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'super_admin':
            return Subscription.objects.all()
        elif user.role == 'pg_owner':
            pg = PGProfile.objects.filter(owner=user).first()
            if pg:
                return Subscription.objects.filter(pg=pg)
        
        return Subscription.objects.none()
    
    @action(detail=False, methods=['get'])
    def current_subscription(self, request):
        """Get current subscription for PG."""
        user = request.user
        
        if user.role == 'pg_owner':
            pg = PGProfile.objects.filter(owner=user).first()
            if pg:
                try:
                    subscription = Subscription.objects.filter(pg=pg).latest('start_date')
                    serializer = SubscriptionSerializer(subscription)
                    return Response(serializer.data)
                except Subscription.DoesNotExist:
                    return Response(
                        {'message': 'No active subscription.'},
                        status=status.HTTP_404_NOT_FOUND
                    )
        
        return Response(
            {'error': 'Permission denied.'},
            status=status.HTTP_403_FORBIDDEN
        )


class InvoiceViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Invoice Management."""
    
    permission_classes = [IsAuthenticated]
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'super_admin':
            return Invoice.objects.all()
        elif user.role == 'pg_owner':
            pg = PGProfile.objects.filter(owner=user).first()
            if pg:
                return Invoice.objects.filter(subscription__pg=pg)
        
        return Invoice.objects.none()
