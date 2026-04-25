# PGMaster File Reference Guide

Quick reference for all files in the PGMaster project.

## 📁 Root Directory Files

### Documentation Files
| File | Purpose | Audience |
|------|---------|----------|
| `README.md` | Complete project documentation with installation, features, tech stack, and troubleshooting | Everyone |
| `QUICK_START.md` | 5-minute fast setup guide for getting the app running | Developers |
| `DELIVERY_SUMMARY.md` | Final delivery summary with all deliverables and statistics | Project Managers |
| `PROJECT_SUMMARY.md` | Technical overview of what was built and current status | Developers |
| `API_DOCUMENTATION.md` | Complete API reference with all endpoints and examples | Developers, QA |
| `CONTRIBUTING.md` | Guidelines for contributing to the project | Developers |
| `DEPLOYMENT_CHECKLIST.md` | Step-by-step deployment verification and troubleshooting | DevOps, SRE |

### Infrastructure Files
| File | Purpose |
|------|---------|
| `docker-compose.yml` | Multi-container orchestration (DB, Redis, Backend, Frontend, Celery) |
| `Makefile` | Development commands for setup, testing, running, deployment |

---

## 🐍 Backend Files (`pgmaster-backend/`)

### Configuration
| File | Purpose | Lines |
|------|---------|-------|
| `config/settings.py` | Django settings with production config | 350+ |
| `config/urls.py` | URL routing for API versioning |  |
| `config/wsgi.py` | WSGI entry point for Gunicorn |  |
| `requirements.txt` | Python dependencies (25 packages) |  |
| `.env.example` | Environment variable template |  |
| `manage.py` | Django management command |  |
| `Dockerfile` | Docker image for backend service |  |
| `pytest.ini` | Testing configuration |  |

### Database Models & APIs by App

#### Auth App (`apps/auth/`)
| File | Content | Purpose |
|------|---------|---------|
| `models.py` | User, PasswordResetToken | Custom user with roles, password reset |
| `serializers.py` | Auth serializers | Register, login, profile update |
| `views.py` | 6 ViewSets | Register, login, logout, profile, password reset |
| `urls.py` | Auth routes | API endpoint routing |
| `admin.py` | User admin | Django admin interface |

#### PG App (`apps/pg/`)
| File | Content | Purpose |
|------|---------|---------|
| `models.py` | PGProfile, PGStaff, PGSettings | Business info, staff, settings |
| `serializers.py` | PG serializers | Data serialization for API |
| `views.py` | 2 ViewSets | Profile management, staff management |
| `urls.py` | PG routes | API endpoint routing |
| `admin.py` | PG admin | Django admin interface |

#### Rooms App (`apps/rooms/`)
| File | Content | Purpose |
|------|---------|---------|
| `models.py` | Room, Bed | Room and bed management |
| `serializers.py` | Room, Bed serializers | Occupancy calculations |
| `views.py` | 2 ViewSets | Room CRUD, occupancy, beds |
| `urls.py` | Room routes | API endpoint routing |
| `admin.py` | Room admin | Django admin interface |

#### Tenants App (`apps/tenants/`)
| File | Content | Purpose |
|------|---------|---------|
| `models.py` | Tenant | Complete tenant information |
| `serializers.py` | Tenant serializer | Nested room/bed data |
| `views.py` | TenantViewSet | Full lifecycle management |
| `urls.py` | Tenant routes | API endpoint routing |
| `admin.py` | Tenant admin | Django admin interface |

#### Payments App (`apps/payments/`)
| File | Content | Purpose |
|------|---------|---------|
| `models.py` | Payment, SecurityDeposit, PaymentReceipt | Rent and payment tracking |
| `serializers.py` | Payment serializers | Amount calculations |
| `views.py` | PaymentViewSet | Generate rent, record payment |
| `urls.py` | Payment routes | API endpoint routing |
| `admin.py` | Payment admin | Django admin interface |

#### Complaints App (`apps/complaints/`)
| File | Content | Purpose |
|------|---------|---------|
| `models.py` | Complaint, ComplaintUpdate | Ticket system with history |
| `serializers.py` | Complaint serializers | Status update tracking |
| `views.py` | ComplaintViewSet | File, update, resolve tickets |
| `urls.py` | Complaint routes | API endpoint routing |
| `admin.py` | Complaint admin | Django admin interface |

#### Notices App (`apps/notices/`)
| File | Content | Purpose |
|------|---------|---------|
| `models.py` | Notice | Announcements |
| `serializers.py` | Notice serializer | Serialization |
| `views.py` | NoticeViewSet | Create, send notices |
| `urls.py` | Notice routes | API endpoint routing |
| `admin.py` | Notice admin | Django admin interface |

#### Reports App (`apps/reports/`)
| File | Content | Purpose |
|------|---------|---------|
| `views.py` | ReportViewSet | 5 report types, CSV export |
| `urls.py` | Report routes | API endpoint routing |

#### Subscriptions App (`apps/subscriptions/`)
| File | Content | Purpose |
|------|---------|---------|
| `models.py` | SubscriptionPlan, Subscription, Invoice | Tiered plans, billing |
| `serializers.py` | Subscription serializers | Plan details |
| `views.py` | SubscriptionViewSet | Plan listing, subscriptions |
| `urls.py` | Subscription routes | API endpoint routing |
| `admin.py` | Subscription admin | Django admin interface |

#### Common App (`apps/common/`)
| File | Content | Purpose |
|------|---------|---------|
| `models.py` | BaseModel, AuditLog | Shared models, audit trail |
| `admin.py` | Audit admin | Django admin interface |

### Utilities
| File | Purpose |
|------|---------|
| `utils/permissions.py` | 6 permission classes for RBAC |
| `utils/helpers.py` | Email, SMS notification functions |

### Testing
| File | Purpose | Test Cases |
|------|---------|-----------|
| `tests/test_apis.py` | API endpoint tests | Auth, Rooms, Tenants, Payments |

---

## ⚛️ Frontend Files (`pgmaster-frontend/`)

### Configuration
| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript configuration (strict mode) |
| `next.config.js` | Next.js configuration |
| `tailwind.config.ts` | Tailwind CSS customization |
| `postcss.config.js` | CSS processing |
| `Dockerfile` | Docker image for frontend |

### Pages (`app/`)

#### Authentication Pages
| File | Purpose |
|------|---------|
| `auth/login/page.tsx` | User login form |
| `auth/register/page.tsx` | User registration form |

#### Dashboard Pages (PG Owner)
| File | Purpose | Features |
|------|---------|----------|
| `dashboard/page.tsx` | Dashboard overview | Stat cards, quick links |
| `dashboard/rooms/page.tsx` | Room management | Table, add/edit modal |
| `dashboard/tenants/page.tsx` | Tenant management | Table, add/edit modal |
| `dashboard/payments/page.tsx` | Payment tracking | Stat cards, table |
| `dashboard/complaints/page.tsx` | Complaint view | Card layout, status |
| `dashboard/reports/page.tsx` | Reports | Charts, CSV export |

#### Tenant Portal Pages
| File | Purpose |
|------|---------|
| `tenant/home/page.tsx` | Tenant dashboard |
| `tenant/payments/page.tsx` | Payment history |
| `tenant/complaints/page.tsx` | My complaints |
| `tenant/profile/page.tsx` | Profile management |

#### Admin Pages (Super Admin)
| File | Purpose |
|------|---------|
| `admin/users/page.tsx` | User management |
| `admin/subscriptions/page.tsx` | Subscription management |
| `admin/analytics/page.tsx` | Platform analytics |

#### Layout Files
| File | Purpose |
|------|---------|
| `layout.tsx` | Root layout with QueryClient provider |
| `dashboard/layout.tsx` | Dashboard layout with sidebar |

### Components (`components/`)

#### Shared Components
| File | Purpose | Usage |
|------|---------|-------|
| `shared/Layout.tsx` | Dashboard wrapper | All dashboard pages |
| `shared/Navbar.tsx` | Top navigation | All pages |
| `shared/Sidebar.tsx` | Side navigation | Dashboard pages |
| `shared/Modal.tsx` | Reusable modal | Forms, dialogs |

#### Form Components
| File | Purpose | Features |
|------|---------|----------|
| `dashboard/RoomForm.tsx` | Room CRUD form | Zod validation, error handling |
| `dashboard/TenantForm.tsx` | Tenant CRUD form | Zod validation, bed selection |

### Hooks (`hooks/`)
| File | Purpose | Exports |
|------|---------|---------|
| `useAuth.ts` | Auth state management | Zustand store with localStorage |
| `useAuthMutations.ts` | Auth mutations | Login, register, logout, profile |

### Libraries (`lib/`)
| File | Purpose | Features |
|------|---------|----------|
| `api-client.ts` | Axios instance | JWT interceptor, auto-refresh |
| `api-endpoints.ts` | Centralized API routes | 60+ endpoints organized by module |

### Styling (`styles/`)
| File | Purpose |
|------|---------|
| `globals.css` | Global styles and Tailwind directives |

### Testing (`__tests__/`)
| File | Purpose |
|------|---------|
| `components.test.tsx` | Component tests |

---

## 🧪 Testing & Development

### Backend Testing
```
tests/
├── test_apis.py          # API endpoint tests
    ├── AuthAPITestCase
    ├── RoomAPITestCase
    ├── TenantAPITestCase
    └── PaymentAPITestCase
```

### Frontend Testing
```
__tests__/
└── components.test.tsx   # Component tests
    ├── Modal tests
    ├── RoomForm tests
    └── TenantForm tests
```

---

## 📊 File Organization by Feature

### User Management
- Backend: `apps/auth/`
- Frontend: `app/auth/`, `hooks/useAuth.ts`, `hooks/useAuthMutations.ts`

### Room Management
- Backend: `apps/rooms/`
- Frontend: `app/dashboard/rooms/`, `components/dashboard/RoomForm.tsx`

### Tenant Management
- Backend: `apps/tenants/`
- Frontend: `app/dashboard/tenants/`, `app/tenant/`, `components/dashboard/TenantForm.tsx`

### Payment Management
- Backend: `apps/payments/`
- Frontend: `app/dashboard/payments/`, `app/tenant/payments/`

### Complaint Management
- Backend: `apps/complaints/`
- Frontend: `app/dashboard/complaints/`, `app/tenant/complaints/`

### Reports & Analytics
- Backend: `apps/reports/`
- Frontend: `app/dashboard/reports/`, `app/admin/analytics/`

---

## 🔗 How Files Connect

### API Flow
```
Frontend Page → hooks/useAuthMutations.ts
             → lib/api-endpoints.ts
             → lib/api-client.ts (Axios + JWT)
             → Backend API Endpoint
             → apps/{feature}/views.py (ViewSet)
             → apps/{feature}/serializers.py
             → apps/{feature}/models.py
             → PostgreSQL Database
```

### State Management Flow
```
User Action → React Component
           → hooks/useAuthMutations.ts (React Query)
           → hooks/useAuth.ts (Zustand)
           → localStorage (persistence)
```

### Authentication Flow
```
Login Page → api-endpoints.authAPI.login()
          → Backend /api/v1/auth/login/
          → JWT tokens returned
          → localStorage.setItem('access_token')
          → Stored in Zustand store
          → Added to Authorization header
```

---

## 📋 Quick Reference

### To Find:
- **User Model** → `pgmaster-backend/apps/auth/models.py`
- **Room API** → `pgmaster-backend/apps/rooms/views.py`
- **Dashboard** → `pgmaster-frontend/app/dashboard/page.tsx`
- **API Client** → `pgmaster-frontend/lib/api-client.ts`
- **All Endpoints** → `pgmaster-frontend/lib/api-endpoints.ts`
- **Forms** → `pgmaster-frontend/components/dashboard/`
- **Docker Setup** → `docker-compose.yml`
- **Configuration** → `pgmaster-backend/config/settings.py`
- **Tests** → `pgmaster-backend/tests/test_apis.py`
- **Deployment** → `DEPLOYMENT_CHECKLIST.md`

### Important Counts:
- **Backend Files**: 50+
- **Frontend Files**: 40+
- **API Endpoints**: 45+
- **Database Models**: 15
- **Django Apps**: 9
- **Pages**: 13
- **Components**: 8+
- **Documentation**: 6 guides

---

This reference guide helps you navigate the complete PGMaster codebase efficiently!
