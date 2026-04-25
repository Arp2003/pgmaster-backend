from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import MessProfile, MenuItem
from .serializers import MessProfileSerializer, MenuItemSerializer
from apps.pg.models import PGProfile

class MessProfileViewSet(viewsets.ModelViewSet):
    queryset = MessProfile.objects.all()
    serializer_class = MessProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'pg_owner':
            return MessProfile.objects.filter(pg__owner=user)
        return MessProfile.objects.all()

    @action(detail=False, methods=['get'])
    def my_mess(self, request):
        user = request.user
        pg = PGProfile.objects.filter(owner=user).first()
        if not pg:
            return Response({'error': 'PG profile not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        mess, created = MessProfile.objects.get_or_create(
            pg=pg,
            defaults={'name': f"Mess for {pg.name}"}
        )
        serializer = self.get_serializer(mess)
        return Response(serializer.data)

class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'pg_owner':
            return MenuItem.objects.filter(mess__pg__owner=user)
        return MenuItem.objects.all()
