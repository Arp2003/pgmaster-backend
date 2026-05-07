from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.rooms.models import Room
from apps.tenants.models import Tenant
from .models import PGProfile
from .serializers import PGProfileSerializer


class PGProfileViewSet(viewsets.ModelViewSet):
    serializer_class = PGProfileSerializer
    permission_classes = [IsAuthenticated]
    queryset = PGProfile.objects.all()

    def get_queryset(self):
        user = self.request.user
        if user.role == 'pg_owner':
            return PGProfile.objects.filter(owner=user)
        return PGProfile.objects.none()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    # ✅ Dashboard API
    @action(detail=False, methods=['get'], url_path='dashboard')
    def dashboard(self, request):
        """Dashboard stats for current PG owner"""

        try:
            pg = PGProfile.objects.get(owner=request.user)
        except PGProfile.DoesNotExist:
            return Response(
                {"error": "PG profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        rooms = Room.objects.filter(pg=pg)
        tenants = Tenant.objects.filter(room__pg=pg)

        total_rooms = rooms.count()

        total_beds = sum(
            [room.total_beds for room in rooms]
        ) if rooms.exists() else 0

        occupied_beds = tenants.count()

        occupancy = 0
        if total_beds > 0:
            occupancy = (occupied_beds / total_beds) * 100

        return Response({
            "total_rooms": total_rooms,
            "total_beds": total_beds,
            "occupied_beds": occupied_beds,
            "occupancy": round(occupancy, 2)
        })
