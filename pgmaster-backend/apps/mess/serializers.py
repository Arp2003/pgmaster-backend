from rest_framework import serializers
from .models import MessProfile, MenuItem

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = '__all__'

class MessProfileSerializer(serializers.ModelSerializer):
    menu_items = MenuItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = MessProfile
        fields = '__all__'
