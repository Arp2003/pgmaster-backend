from django.db import models
from apps.common.models import BaseModel
from apps.pg.models import PGProfile

class MessProfile(BaseModel):
    """Model for Restaurant/Mess profile within a PG."""
    pg = models.OneToOneField(PGProfile, on_delete=models.CASCADE, related_name='mess_profile')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    opening_time = models.TimeField(null=True, blank=True)
    closing_time = models.TimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Mess: {self.name} ({self.pg.name})"

class MenuItem(BaseModel):
    """Model for Mess Menu Items."""
    MEAL_TYPE_CHOICES = [
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('snacks', 'Snacks'),
        ('dinner', 'Dinner'),
    ]
    
    mess = models.ForeignKey(MessProfile, on_delete=models.CASCADE, related_name='menu_items')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0) # For guest meals or ala carte
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPE_CHOICES)
    day_of_week = models.IntegerField(choices=[(i, str(i)) for i in range(7)]) # 0=Monday
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.get_meal_type_display()}"
