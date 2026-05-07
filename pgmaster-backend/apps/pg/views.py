from rest_framework.decorators import action
from apps.rooms.models import Room
from apps.tenants.models import Tenant

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
