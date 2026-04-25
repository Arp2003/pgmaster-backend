import pytest
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.auth.models import User
from apps.pg.models import PGProfile, PGSettings
from apps.rooms.models import Room, Bed
from apps.tenants.models import Tenant
from datetime import date

User = get_user_model()


@pytest.mark.django_db
class AuthAPITestCase(TestCase):
    """Test Authentication API endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.register_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'password2': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User',
            'phone': '9876543210',
            'role': 'pg_owner'
        }

    def test_user_registration(self):
        """Test user registration endpoint"""
        response = self.client.post('/api/v1/auth/register/', self.register_data)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['user']['email'] == 'test@example.com'

    def test_user_login(self):
        """Test user login endpoint"""
        User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            role='pg_owner'
        )
        login_data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = self.client.post('/api/v1/auth/login/', login_data)
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data

    def test_user_profile_retrieval(self):
        """Test retrieving user profile"""
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            role='pg_owner'
        )
        self.client.force_authenticate(user=user)
        response = self.client.get('/api/v1/auth/profile/me/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['email'] == 'test@example.com'

    def test_user_logout(self):
        """Test user logout endpoint"""
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            role='pg_owner'
        )
        self.client.force_authenticate(user=user)
        response = self.client.post('/api/v1/auth/logout/')
        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class RoomAPITestCase(TestCase):
    """Test Room API endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.pg_owner = User.objects.create_user(
            username='pgowner',
            email='owner@example.com',
            password='pass123',
            role='pg_owner'
        )
        self.pg_profile = PGProfile.objects.create(
            owner=self.pg_owner,
            name='Test PG',
            location='Mumbai',
            phone='9876543210'
        )
        self.client.force_authenticate(user=self.pg_owner)

    def test_create_room(self):
        """Test creating a room"""
        room_data = {
            'pg': self.pg_profile.id,
            'room_number': '101',
            'floor': 1,
            'sharing_type': 2,
            'room_type': 'AC',
            'monthly_rent': 5000
        }
        response = self.client.post('/api/v1/rooms/', room_data)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['room_number'] == '101'

    def test_list_rooms(self):
        """Test listing rooms"""
        Room.objects.create(
            pg=self.pg_profile,
            room_number='101',
            floor=1,
            sharing_type=2,
            room_type='AC',
            monthly_rent=5000
        )
        response = self.client.get('/api/v1/rooms/')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1

    def test_update_room(self):
        """Test updating a room"""
        room = Room.objects.create(
            pg=self.pg_profile,
            room_number='101',
            floor=1,
            sharing_type=2,
            room_type='AC',
            monthly_rent=5000
        )
        update_data = {'monthly_rent': 6000}
        response = self.client.patch(f'/api/v1/rooms/{room.id}/', update_data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['monthly_rent'] == 6000

    def test_delete_room(self):
        """Test deleting a room"""
        room = Room.objects.create(
            pg=self.pg_profile,
            room_number='101',
            floor=1,
            sharing_type=2,
            room_type='AC',
            monthly_rent=5000
        )
        response = self.client.delete(f'/api/v1/rooms/{room.id}/')
        assert response.status_code == status.HTTP_204_NO_CONTENT


@pytest.mark.django_db
class TenantAPITestCase(TestCase):
    """Test Tenant API endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.pg_owner = User.objects.create_user(
            username='pgowner',
            email='owner@example.com',
            password='pass123',
            role='pg_owner'
        )
        self.pg_profile = PGProfile.objects.create(
            owner=self.pg_owner,
            name='Test PG',
            location='Mumbai',
            phone='9876543210'
        )
        self.room = Room.objects.create(
            pg=self.pg_profile,
            room_number='101',
            floor=1,
            sharing_type=2,
            room_type='AC',
            monthly_rent=5000
        )
        self.bed = Bed.objects.create(
            room=self.room,
            bed_number='A',
            monthly_rent=2500,
            occupied=False
        )
        self.client.force_authenticate(user=self.pg_owner)

    def test_create_tenant(self):
        """Test creating a tenant"""
        tenant_data = {
            'tenant_name': 'John Doe',
            'phone': '9876543210',
            'email': 'john@example.com',
            'aadhar_number': '123456789012',
            'join_date': str(date.today()),
            'monthly_rent': 2500,
            'security_deposit': 5000,
            'bed': self.bed.id,
            'pg': self.pg_profile.id
        }
        response = self.client.post('/api/v1/tenants/', tenant_data)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['tenant_name'] == 'John Doe'

    def test_list_tenants(self):
        """Test listing tenants"""
        Tenant.objects.create(
            pg=self.pg_profile,
            bed=self.bed,
            tenant_name='John Doe',
            phone='9876543210',
            email='john@example.com',
            aadhar_number='123456789012',
            join_date=date.today(),
            monthly_rent=2500,
            security_deposit=5000
        )
        response = self.client.get('/api/v1/tenants/')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1

    def test_vacate_tenant(self):
        """Test vacating a tenant"""
        tenant = Tenant.objects.create(
            pg=self.pg_profile,
            bed=self.bed,
            tenant_name='John Doe',
            phone='9876543210',
            email='john@example.com',
            aadhar_number='123456789012',
            join_date=date.today(),
            monthly_rent=2500,
            security_deposit=5000,
            status='active'
        )
        response = self.client.post(f'/api/v1/tenants/{tenant.id}/vacate/')
        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class PaymentAPITestCase(TestCase):
    """Test Payment API endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.pg_owner = User.objects.create_user(
            username='pgowner',
            email='owner@example.com',
            password='pass123',
            role='pg_owner'
        )
        self.pg_profile = PGProfile.objects.create(
            owner=self.pg_owner,
            name='Test PG',
            location='Mumbai',
            phone='9876543210'
        )
        self.client.force_authenticate(user=self.pg_owner)

    def test_pending_payments_list(self):
        """Test listing pending payments"""
        response = self.client.get('/api/v1/payments/pending_payments/')
        assert response.status_code == status.HTTP_200_OK

    def test_generate_monthly_rent(self):
        """Test generating monthly rent"""
        data = {'month': '2024-01-01'}
        response = self.client.post('/api/v1/payments/generate_monthly_rent/', data)
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_201_CREATED]
