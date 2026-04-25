"""
Views for Notices App.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from apps.pg.models import PGProfile
from .models import Notice
from .serializers import NoticeSerializer


class NoticeViewSet(viewsets.ModelViewSet):
    """ViewSet for Notice Management."""
    
    permission_classes = [IsAuthenticated]
    queryset = Notice.objects.all()
    serializer_class = NoticeSerializer
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'super_admin':
            return Notice.objects.all()
        elif user.role == 'pg_owner':
            pg = PGProfile.objects.filter(owner=user).first()
            if pg:
                return Notice.objects.filter(pg=pg)
        
        return Notice.objects.none()
    
    def perform_create(self, serializer):
        user = self.request.user
        pg = PGProfile.objects.get(owner=user)
        serializer.save(pg=pg)
    
    @action(detail=True, methods=['post'])
    def send_notice(self, request, pk=None):
        """Send notice to tenants."""
        notice = self.get_object()
        
        notice.is_sent = True
        notice.sent_date = timezone.now()
        notice.save()
        
        # TODO: Integrate with email and SMS service
        
        return Response(
            {'message': 'Notice sent to all tenants.'},
            status=status.HTTP_200_OK
        )
