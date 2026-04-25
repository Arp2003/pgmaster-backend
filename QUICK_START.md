# PGMaster Quick Start Guide

Get PGMaster running in 5 minutes! 🚀

## Prerequisites

- **Docker & Docker Compose** installed ([Get Docker](https://www.docker.com/products/docker-desktop))
- **Git** for cloning the repository

## Fast Setup (Docker)

### 1. Clone & Enter Project
```bash
git clone <repository-url>
cd pgmaster
```

### 2. Setup Environment
```bash
# Copy example .env file
cp pgmaster-backend/.env.example pgmaster-backend/.env
```

### 3. Start Everything
```bash
# Start all services
docker-compose up -d

# Watch the startup
docker-compose logs -f
```

### 4. Run Migrations
```bash
# In another terminal
docker-compose exec backend python manage.py migrate
```

### 5. Create Admin User
```bash
docker-compose exec backend python manage.py createsuperuser
# Follow prompts to create admin account
```

### 6. Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000/api/v1 |
| Django Admin | http://localhost:8000/admin |
| API Docs | http://localhost:8000/api/v1/docs |

## Quick Verification

### Test Login
1. Open http://localhost:3000
2. Go to Login page
3. Enter your admin credentials
4. You should see the dashboard ✅

### Test API
```bash
# Get access token
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your_password"
  }'

# Copy the access token and list rooms
curl -X GET http://localhost:8000/api/v1/rooms/ \
  -H "Authorization: Bearer <token>"
```

## Using Make Commands (Optional)

If you have `make` installed:

```bash
make help              # Show all commands
make run              # Start services
make migrate          # Run migrations
make createsuperuser  # Create admin
make logs             # View logs
make stop             # Stop services
make clean            # Clean everything
```

## Project Logins

### Test User Accounts

After creation, you can use these for testing:

1. **Admin/PG Owner**
   - Username: `admin` (or your chosen username)
   - Password: (as you set during createsuperuser)

2. **Create More Users** via Registration at http://localhost:3000/auth/register

## Useful Commands

### View Database
```bash
# Connect to PostgreSQL
docker-compose exec db psql -U pgmaster -d pgmaster

# List tables
\dt

# Exit
\q
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend    # Backend
docker-compose logs frontend   # Frontend
docker-compose logs db         # Database

# Follow (live updates)
docker-compose logs -f
```

### Run Tests
```bash
docker-compose exec backend pytest tests/ -v
```

### Create Rooms & Tenants

Use the admin panel or API:

```bash
# Login and get token first
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"pass"}' | grep -o '"access":"[^"]*' | cut -d'"' -f4)

# Create a room
curl -X POST http://localhost:8000/api/v1/rooms/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "room_number":"101",
    "floor":1,
    "sharing_type":2,
    "room_type":"AC",
    "monthly_rent":5000
  }'
```

## Troubleshooting

### Port Already in Use
```bash
# On Mac/Linux
lsof -ti:8000 | xargs kill -9  # Kill process on 8000

# On Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Database Connection Error
```bash
# Check if DB container is running
docker-compose ps

# Restart just the database
docker-compose restart db
docker-compose exec backend python manage.py migrate
```

### Can't Access Frontend
```bash
# Check if frontend container is running
docker-compose logs frontend

# Rebuild and restart
docker-compose up -d --build frontend
```

### Migrations Failed
```bash
# Reset and remigrate
docker-compose exec backend python manage.py migrate --fake-initial
docker-compose exec backend python manage.py migrate
```

## Next Steps

1. **Explore the Dashboard** - Add rooms, tenants, manage payments
2. **Read API Docs** - See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
3. **Customize** - Update branding, add features
4. **Deploy** - Follow [README.md Deployment section](README.md#-deployment)

## File Structure Quick Reference

```
pgmaster/
├── pgmaster-backend/     # Django API
├── pgmaster-frontend/    # Next.js UI
├── docker-compose.yml    # Multi-container setup
├── README.md             # Full documentation
├── API_DOCUMENTATION.md  # API reference
├── CONTRIBUTING.md       # Contribution guide
└── Makefile             # Convenience commands
```

## Features to Try

### As PG Owner
1. Create rooms and beds
2. Add tenants
3. Generate monthly rent
4. View occupancy reports
5. Manage complaints

### As Tenant
1. View payment history
2. File complaints
3. View profile
4. Check notices

## Support

- **Docs**: Check README.md and API_DOCUMENTATION.md
- **Issues**: Create GitHub issue with detailed description
- **Contributing**: See CONTRIBUTING.md

## Common Tasks

### Backup Database
```bash
docker-compose exec db pg_dump -U pgmaster pgmaster > backup.sql
```

### Restore Database
```bash
docker-compose exec -T db psql -U pgmaster pgmaster < backup.sql
```

### View Celery Tasks
```bash
# In Redis
docker-compose exec redis redis-cli
> KEYS *celery*
```

### Access Django Shell
```bash
docker-compose exec backend python manage.py shell
>>> from apps.rooms.models import Room
>>> Room.objects.all()
```

---

**You're all set!** 🎉 

Start exploring PGMaster at http://localhost:3000

For more details, check the main [README.md](README.md)
