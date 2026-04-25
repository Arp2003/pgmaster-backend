# PGMaster - PG/Hostel ERP Management Platform

A comprehensive, production-ready SaaS platform for managing Paying Guest (PG) and hostel operations in India. Built with Django REST Framework, Next.js, PostgreSQL, and modern web technologies.

![Status](https://img.shields.io/badge/status-production--ready-green)
![Python](https://img.shields.io/badge/python-3.11-blue)
![Django](https://img.shields.io/badge/django-4.2.7-darkgreen)
![React](https://img.shields.io/badge/react-18.2-blue)
![Next.js](https://img.shields.io/badge/next.js-14.0-black)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [User Roles & Permissions](#user-roles--permissions)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### Core Features
- **User Management** - Multi-role authentication (Super Admin, PG Owner, Staff, Tenant)
- **PG Profile Management** - Business info, settings, staff management
- **Room Management** - Room creation, bed allocation, occupancy tracking
- **Tenant Management** - Complete tenant lifecycle from join to vacate
- **Payment Management** - Automated rent generation, payment recording, late fee calculation
- **Complaint System** - Complaint filing, status tracking, resolution management
- **Notice System** - PG-wide announcements and notifications
- **Reports & Analytics** - Occupancy, rent collection, tenant register reports
- **Subscription Plans** - Tiered pricing (Starter, Growth, Premium)

### Advanced Features
- Role-based access control (RBAC) at ViewSet level
- JWT token authentication with auto-refresh
- Email notifications for payments, complaints, notices
- Automatic bed creation on room creation
- Monthly rent auto-generation
- Occupancy percentage tracking
- Payment receipt generation
- CSV export functionality
- Async task processing (Celery + Redis)

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 4.2.7 + Django REST Framework 3.14.0
- **Database**: PostgreSQL 15
- **Task Queue**: Celery 5.3.4 with Redis 5.0.1 broker
- **Authentication**: JWT (djangorestframework-simplejwt 5.3.2)
- **Server**: Gunicorn 21.2.0 + WhiteNoise 6.6.0
- **Testing**: pytest 7.4.3 with pytest-django

### Frontend
- **Framework**: Next.js 14.0 with App Router
- **Language**: TypeScript
- **UI**: Tailwind CSS 3.3.0 + Shadcn UI
- **State Management**: Zustand 4.4.0 (auth store)
- **Data Fetching**: @tanstack/react-query 5.0.0
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts 2.10.0

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (reverse proxy)
- **Email**: SMTP (Gmail/SendGrid compatible)
- **File Storage**: Local media + AWS S3 ready

## 📁 Project Structure

```
pgmaster/
├── pgmaster-backend/              # Django backend
│   ├── config/                    # Django settings
│   │   ├── settings.py           # Main configuration
│   │   ├── urls.py               # URL routing
│   │   └── wsgi.py               # WSGI entry point
│   ├── apps/                     # Django applications
│   │   ├── auth/                 # Authentication & user management
│   │   ├── pg/                   # PG profile & settings
│   │   ├── rooms/                # Room & bed management
│   │   ├── tenants/              # Tenant lifecycle
│   │   ├── payments/             # Payment & rent management
│   │   ├── complaints/           # Complaint system
│   │   ├── notices/              # Announcement system
│   │   ├── reports/              # Analytics & reports
│   │   ├── subscriptions/        # Subscription plans
│   │   └── common/               # Shared models & utilities
│   ├── utils/                    # Helpers & permissions
│   ├── tests/                    # API & unit tests
│   ├── Dockerfile                # Container definition
│   ├── requirements.txt          # Python dependencies
│   └── manage.py                 # Django management
│
├── pgmaster-frontend/             # Next.js frontend
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout
│   │   ├── auth/                 # Authentication pages
│   │   ├── dashboard/            # Owner dashboard
│   │   ├── tenant/               # Tenant portal
│   │   └── admin/                # Admin panel
│   ├── components/               # React components
│   │   ├── shared/               # Layout, Navbar, Sidebar
│   │   └── dashboard/            # Dashboard components
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts            # Auth store (Zustand)
│   │   └── useAuthMutations.ts   # Auth mutations
│   ├── lib/                      # Utilities
│   │   ├── api-client.ts         # Axios with interceptors
│   │   └── api-endpoints.ts      # Centralized API routes
│   ├── styles/                   # Global styles & Tailwind
│   ├── public/                   # Static assets
│   ├── Dockerfile                # Frontend container
│   ├── package.json              # Dependencies
│   ├── tsconfig.json             # TypeScript config
│   └── tailwind.config.ts        # Tailwind theme
│
└── docker-compose.yml            # Multi-container setup
```

## 🚀 Installation

### Prerequisites
- **Local Development**: Python 3.11+, Node.js 18+, PostgreSQL 15, Redis 7
- **Docker**: Docker Desktop (includes Docker Compose)

### Option 1: Docker (Recommended)

```bash
# Clone repository
git clone <repo-url>
cd pgmaster

# Create environment file
cp pgmaster-backend/.env.example pgmaster-backend/.env

# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Access services
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/api/v1
# Admin: http://localhost:8000/admin
```

### Option 2: Local Setup

#### Backend Setup
```bash
cd pgmaster-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from .env.example)
cp .env.example .env

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver 0.0.0.0:8000
```

#### Frontend Setup
```bash
cd pgmaster-frontend

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local

# Start development server
npm run dev
```

#### Redis & Celery (Optional)
```bash
# Start Redis
redis-server

# In another terminal, start Celery worker
celery -A config worker -l info

# And Celery Beat for scheduled tasks
celery -A config beat -l info
```

## ⚙️ Configuration

### Backend Environment Variables (.env)

```env
# Django Settings
DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1,example.com

# Database
DATABASE_NAME=pgmaster
DATABASE_USER=pgmaster
DATABASE_PASSWORD=secure-password
DATABASE_HOST=db
DATABASE_PORT=5432

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Redis & Celery
REDIS_URL=redis://redis:6379
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/1

# AWS S3 (Optional)
USE_S3=False
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_STORAGE_BUCKET_NAME=
AWS_S3_REGION_NAME=us-east-1
```

### Frontend Environment Variables (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## 🏃 Running the Application

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Specific service logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Using Make (if available)

```bash
make setup          # Initial setup
make install-deps   # Install dependencies
make migrate        # Run migrations
make run            # Start all services
make test           # Run tests
make clean          # Clean up
```

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/v1/auth/register/            - User registration
POST   /api/v1/auth/login/               - User login
POST   /api/v1/auth/logout/              - User logout
GET    /api/v1/auth/profile/me/          - Get current user profile
PUT    /api/v1/auth/profile/update_profile/ - Update profile
POST   /api/v1/auth/token/refresh/       - Refresh JWT token
POST   /api/v1/auth/password-reset/      - Password reset
POST   /api/v1/auth/password-reset-request/ - Request password reset
```

### Room Management

```
GET    /api/v1/rooms/                    - List all rooms
POST   /api/v1/rooms/                    - Create room
GET    /api/v1/rooms/{id}/               - Get room details
PUT    /api/v1/rooms/{id}/               - Update room
DELETE /api/v1/rooms/{id}/               - Delete room
GET    /api/v1/rooms/occupancy_summary/  - Get occupancy stats
GET    /api/v1/rooms/beds/               - List all beds
POST   /api/v1/rooms/{id}/add_beds/      - Add beds to room
```

### Tenant Management

```
GET    /api/v1/tenants/                  - List tenants
POST   /api/v1/tenants/                  - Create tenant
GET    /api/v1/tenants/{id}/             - Get tenant details
PUT    /api/v1/tenants/{id}/             - Update tenant
DELETE /api/v1/tenants/{id}/             - Delete tenant
POST   /api/v1/tenants/{id}/move_to_room/- Move tenant to room
POST   /api/v1/tenants/{id}/vacate/      - Vacate tenant
POST   /api/v1/tenants/{id}/issue_notice/- Issue notice
GET    /api/v1/tenants/active_tenants/   - Get active tenants
```

### Payment Management

```
GET    /api/v1/payments/                 - List payments
POST   /api/v1/payments/                 - Create payment
GET    /api/v1/payments/pending_payments/- Get pending payments
POST   /api/v1/payments/generate_monthly_rent/ - Auto-generate monthly rent
POST   /api/v1/payments/{id}/record_payment/  - Record payment
GET    /api/v1/payments/my_payments/     - Get tenant's payment history
```

### Reports & Analytics

```
GET    /api/v1/reports/occupancy_report/  - Occupancy statistics
GET    /api/v1/reports/rent_pending_report/- Pending rent report
GET    /api/v1/reports/monthly_income_report/- Monthly income
GET    /api/v1/reports/tenant_register_report/- Tenant register
GET    /api/v1/reports/export_occupancy_csv/  - CSV export
```

## 👥 User Roles & Permissions

### Super Admin
- Manage all PG profiles
- View platform analytics
- Manage subscriptions
- User management
- System settings

### PG Owner
- Manage own PG profile
- Full room and bed management
- Manage tenants
- View payments and reports
- Handle complaints and notices
- Manage staff

### Staff
- View room details
- Update tenant status
- Record payments
- Manage complaints
- View assigned data

### Tenant
- View own profile
- View payment history
- File complaints
- View notices
- Update profile

## 🗄️ Database Schema

### Key Models Relationships

```
User (AbstractUser)
├── PGProfile
│   ├── Room
│   │   └── Bed
│   │       └── Tenant
│   │           ├── Payment
│   │           ├── Complaint
│   │           └── SecurityDeposit
│   ├── PGStaff
│   └── PGSettings
├── SubscriptionPlan
│   └── Subscription
│       └── Invoice
└── Notice
```

### Core Tables

- **users** - Custom user model with roles
- **pg_profiles** - PG business information
- **rooms** - Room details and amenities
- **beds** - Bed allocation within rooms
- **tenants** - Tenant information and status
- **payments** - Rent and payment records
- **complaints** - Complaint tickets
- **notices** - Announcements
- **subscriptions** - Subscription plans
- **audit_logs** - Audit trail

## 🚢 Deployment

### Production Deployment Steps

1. **Environment Setup**
   ```bash
   # Update .env with production values
   DEBUG=False
   SECRET_KEY=<generate-secure-key>
   ALLOWED_HOSTS=yourdomain.com
   ```

2. **Build & Push Docker Images**
   ```bash
   docker build -t your-registry/pgmaster-backend:latest pgmaster-backend/
   docker build -t your-registry/pgmaster-frontend:latest pgmaster-frontend/
   docker push your-registry/pgmaster-backend:latest
   docker push your-registry/pgmaster-frontend:latest
   ```

3. **Deploy on Kubernetes/VPS**
   - Use kubectl for K8s: `kubectl apply -f k8s/`
   - Use Docker Swarm or Docker Compose on VPS
   - Configure reverse proxy (Nginx/Traefik)
   - Set up SSL/TLS (Let's Encrypt)
   - Configure backup strategy for PostgreSQL

4. **Post-Deployment**
   ```bash
   # Run migrations in production
   docker-compose exec backend python manage.py migrate
   
   # Collect static files
   docker-compose exec backend python manage.py collectstatic --noinput
   
   # Create admin user
   docker-compose exec backend python manage.py createsuperuser
   ```

5. **Monitoring & Logging**
   - Set up Sentry for error tracking
   - Configure CloudWatch/DataDog for logs
   - Set up uptime monitoring
   - Configure email alerts

## 🧪 Testing

### Run Tests

```bash
# Backend tests
docker-compose exec backend pytest tests/test_apis.py -v

# Frontend tests (if available)
cd pgmaster-frontend
npm test

# Coverage report
docker-compose exec backend pytest --cov=apps tests/
```

### Test Files
- `tests/test_apis.py` - API endpoint tests
- Test coverage: Auth, Rooms, Tenants, Payments

### Writing Tests

```python
@pytest.mark.django_db
class AuthAPITestCase(TestCase):
    def test_user_registration(self):
        response = self.client.post('/api/v1/auth/register/', data)
        assert response.status_code == 201
```

## 🆘 Troubleshooting

### Database Connection Issues
```
Error: could not translate host name "db" to address
Solution: Ensure services are on same network (docker-compose handles this)
```

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Migration Errors
```bash
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate --fake-initial
```

### Static Files Not Loading
```bash
docker-compose exec backend python manage.py collectstatic --noinput
```

### CORS Issues
```
Update CORS_ALLOWED_ORIGINS in .env with frontend URL
```

## 📝 API Request Examples

### Register User
```bash
curl -X POST http://localhost:8000/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user1",
    "email": "user@example.com",
    "password": "pass123",
    "password2": "pass123",
    "first_name": "John",
    "phone": "9876543210",
    "role": "pg_owner"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user1",
    "password": "pass123"
  }'
```

### Create Room (Authenticated)
```bash
curl -X POST http://localhost:8000/api/v1/rooms/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "room_number": "101",
    "floor": 1,
    "sharing_type": 2,
    "room_type": "AC",
    "monthly_rent": 5000
  }'
```

## 📞 Support & Contributing

For issues, feature requests, or contributions:

1. Create an issue with detailed description
2. Fork repository and create feature branch
3. Commit changes with clear messages
4. Push to branch and create pull request

## 📄 License

MIT License - See LICENSE file for details

## 🎯 Roadmap

- [ ] SMS integration (Twilio)
- [ ] Payment gateway integration (Razorpay, Stripe)
- [ ] Advanced reporting (PDF generation)
- [ ] Real-time notifications (WebSocket)
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced search and filtering
- [ ] Data analytics dashboard

---

**PGMaster** - Making PG Management Simple & Efficient

For more information, visit [pgmaster.com](https://pgmaster.com) or contact support@pgmaster.com
