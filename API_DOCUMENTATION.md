# PGMaster API Documentation

Base URL: `http://localhost:8000/api/v1`

## Authentication

All endpoints (except registration and login) require JWT authentication.

### Header Format
```
Authorization: Bearer <access_token>
```

### Token Refresh
When access token expires (401 response), use the refresh token to get a new one:
```
POST /auth/token/refresh/
{
  "refresh": "<refresh_token>"
}
```

---

## Auth Endpoints

### Register User
```
POST /auth/register/

Request:
{
  "username": "string",
  "email": "string",
  "password": "string",
  "password2": "string",
  "first_name": "string",
  "last_name": "string",
  "phone": "string",
  "role": "pg_owner|staff|tenant|super_admin"
}

Response (201):
{
  "user": {
    "id": 1,
    "username": "string",
    "email": "string",
    "role": "pg_owner"
  },
  "message": "User registered successfully"
}
```

### Login
```
POST /auth/login/

Request:
{
  "username": "string",
  "password": "string"
}

Response (200):
{
  "access": "JWT_ACCESS_TOKEN",
  "refresh": "JWT_REFRESH_TOKEN",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string",
    "role": "pg_owner",
    "first_name": "string",
    "last_name": "string"
  }
}
```

### Get Current User Profile
```
GET /auth/profile/me/

Authentication: Required
Response (200):
{
  "id": 1,
  "username": "string",
  "email": "string",
  "first_name": "string",
  "last_name": "string",
  "phone": "string",
  "role": "pg_owner",
  "is_verified": true,
  "created_at": "2024-01-15T10:00:00Z"
}
```

### Update Profile
```
PUT /auth/profile/update_profile/

Authentication: Required
Request:
{
  "first_name": "string",
  "last_name": "string",
  "phone": "string"
}

Response (200): Updated user object
```

### Logout
```
POST /auth/logout/

Authentication: Required
Request:
{
  "refresh": "refresh_token_string"
}

Response (200):
{
  "message": "User logged out successfully"
}
```

---

## Room Management

### List Rooms
```
GET /rooms/?page=1&page_size=20

Authentication: Required
Query Params:
  - page: int (default: 1)
  - page_size: int (default: 20)
  - floor: int (optional filter)
  - room_type: string (optional filter)

Response (200):
{
  "count": 10,
  "next": "url?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "pg": 1,
      "room_number": "101",
      "floor": 1,
      "sharing_type": 2,
      "room_type": "AC",
      "monthly_rent": 5000,
      "amenities": ["WiFi", "Cooler"],
      "occupancy_percentage": 50,
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Create Room
```
POST /rooms/

Authentication: Required (PG Owner)
Request:
{
  "room_number": "101",
  "floor": 1,
  "sharing_type": 2,
  "room_type": "AC",
  "monthly_rent": 5000,
  "amenities": ["WiFi", "Cooler"]
}

Response (201): Room object
```

### Get Room Details
```
GET /rooms/{id}/

Authentication: Required
Response (200): Room object with beds and occupancy
```

### Update Room
```
PUT /rooms/{id}/
PATCH /rooms/{id}/

Authentication: Required (Owner/Admin)
Request: Partial room data
Response (200): Updated room object
```

### Delete Room
```
DELETE /rooms/{id}/

Authentication: Required (Owner/Admin)
Response (204): No content
```

### Get Occupancy Summary
```
GET /rooms/occupancy_summary/

Authentication: Required
Response (200):
{
  "total_rooms": 10,
  "total_beds": 40,
  "occupied_beds": 35,
  "vacant_beds": 5,
  "occupancy_percentage": 87.5,
  "room_details": [...]
}
```

### List Beds
```
GET /rooms/beds/?room_id=1

Authentication: Required
Query Params:
  - room_id: int (optional filter)
  - occupied: boolean (optional filter)

Response (200):
{
  "count": 4,
  "results": [
    {
      "id": 1,
      "room": 1,
      "bed_number": "A",
      "monthly_rent": 2500,
      "occupied": false,
      "current_tenant": null
    }
  ]
}
```

---

## Tenant Management

### List Tenants
```
GET /tenants/?status=active&page=1

Authentication: Required
Query Params:
  - status: active|notice_period|vacated|inactive (optional)
  - page: int
  - page_size: int

Response (200): Paginated tenant list
```

### Create Tenant
```
POST /tenants/

Authentication: Required (PG Owner)
Request:
{
  "tenant_name": "string",
  "phone": "string",
  "email": "string",
  "aadhar_number": "string (12 digits)",
  "id_proof": "string",
  "institution_name": "string",
  "join_date": "YYYY-MM-DD",
  "monthly_rent": 2500,
  "security_deposit": 5000,
  "bed": 1
}

Response (201): Tenant object
```

### Get Tenant Details
```
GET /tenants/{id}/

Authentication: Required
Response (200): Tenant object with bed and room details
```

### Update Tenant
```
PUT /tenants/{id}/
PATCH /tenants/{id}/

Authentication: Required (Owner/Staff/Self)
Response (200): Updated tenant object
```

### Vacate Tenant
```
POST /tenants/{id}/vacate/

Authentication: Required (Owner/Staff)
Response (200):
{
  "message": "Tenant vacated successfully",
  "tenant": {...}
}
```

### Move Tenant to Room
```
POST /tenants/{id}/move_to_room/

Authentication: Required (Owner/Staff)
Request:
{
  "bed_id": 5
}

Response (200): Updated tenant object
```

### Issue Notice
```
POST /tenants/{id}/issue_notice/

Authentication: Required (Owner/Staff)
Request:
{
  "notice_period_days": 30
}

Response (200):
{
  "message": "Notice issued",
  "tenant": {...}
}
```

### Get Active Tenants
```
GET /tenants/active_tenants/

Authentication: Required
Response (200): List of active tenants
```

---

## Payment Management

### List Payments
```
GET /payments/?month=2024-01&status=pending

Authentication: Required
Query Params:
  - month: YYYY-MM (optional filter)
  - status: pending|partial|paid|overdue (optional)
  - tenant_id: int (optional)

Response (200): Paginated payment list
```

### Create Payment
```
POST /payments/

Authentication: Required
Request:
{
  "tenant": 1,
  "amount": 2500,
  "month": "2024-01",
  "payment_method": "upi|card|bank_transfer|cash|cheque"
}

Response (201): Payment object
```

### Record Payment
```
POST /payments/{id}/record_payment/

Authentication: Required
Request:
{
  "amount": 2500,
  "payment_method": "upi",
  "transaction_id": "TXN123456"
}

Response (200):
{
  "message": "Payment recorded",
  "payment": {...}
}
```

### Generate Monthly Rent
```
POST /payments/generate_monthly_rent/

Authentication: Required (Owner/Admin)
Request:
{
  "month": "2024-01"
}

Response (201):
{
  "message": "Monthly rent generated for X tenants",
  "count": 15
}
```

### Get Pending Payments
```
GET /payments/pending_payments/

Authentication: Required
Response (200):
{
  "count": 5,
  "total_pending_amount": 12500,
  "results": [...]
}
```

### Get Tenant Payment History
```
GET /payments/my_payments/

Authentication: Required (Tenant)
Response (200): Tenant's payment history
```

---

## Complaint Management

### List Complaints
```
GET /complaints/?status=open

Authentication: Required
Query Params:
  - status: open|in_progress|resolved|closed|rejected
  - priority: low|medium|high|urgent
  - category: water|electricity|cleaning|food|wifi|maintenance|noise|other

Response (200): Complaint list
```

### Create Complaint
```
POST /complaints/

Authentication: Required (Tenant/Staff)
Request:
{
  "title": "string",
  "description": "string",
  "category": "water|electricity|cleaning|food|wifi|maintenance|noise|other",
  "priority": "low|medium|high|urgent",
  "attachment": file (optional)
}

Response (201): Complaint object
```

### Update Complaint Status
```
POST /complaints/{id}/update_status/

Authentication: Required (Owner/Staff)
Request:
{
  "status": "in_progress|resolved|closed|rejected",
  "resolution_notes": "string (required if status=resolved)"
}

Response (200): Complaint with update history
```

### Get My Complaints
```
GET /complaints/my_complaints/

Authentication: Required (Tenant)
Response (200): Tenant's complaints
```

### Get Open Complaints
```
GET /complaints/open_complaints/

Authentication: Required (Owner/Staff)
Response (200): All open/in_progress complaints
```

---

## Reports & Analytics

### Occupancy Report
```
GET /reports/occupancy_report/

Authentication: Required (Owner/Admin)
Response (200):
{
  "property_name": "Test PG",
  "total_rooms": 10,
  "total_beds": 40,
  "occupied_beds": 35,
  "vacant_beds": 5,
  "occupancy_percentage": 87.5,
  "room_details": [...]
}
```

### Rent Pending Report
```
GET /reports/rent_pending_report/

Authentication: Required
Response (200):
{
  "total_pending_amount": 12500,
  "pending_count": 5,
  "overdue_count": 2,
  "payments": [
    {
      "tenant_name": "string",
      "amount": 2500,
      "days_overdue": 15,
      "status": "overdue"
    }
  ]
}
```

### Monthly Income Report
```
GET /reports/monthly_income_report/

Authentication: Required (Owner/Admin)
Response (200):
{
  "total_income": 50000,
  "monthly_data": [
    {
      "month": "2024-01",
      "income": 50000
    }
  ]
}
```

### Export Occupancy CSV
```
GET /reports/export_occupancy_csv/

Authentication: Required
Response (200): CSV file download
Content-Type: text/csv
```

---

## Notice Management

### List Notices
```
GET /notices/?is_sent=true

Authentication: Required
Query Params:
  - is_sent: boolean
  - notice_type: rent_reminder|maintenance|rules_update|event|other

Response (200): Notice list
```

### Create Notice
```
POST /notices/

Authentication: Required (Owner/Staff)
Request:
{
  "title": "string",
  "notice_type": "rent_reminder|maintenance|rules_update|event|other",
  "content": "string",
  "send_to_all": true,
  "target_rooms": [1, 2, 3]  # if send_to_all = false
}

Response (201): Notice object
```

### Send Notice
```
POST /notices/{id}/send_notice/

Authentication: Required (Owner/Staff)
Response (200):
{
  "message": "Notice sent to X tenants",
  "notice": {...}
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "field_name": ["Error message"]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Server Error
```json
{
  "detail": "Internal server error."
}
```

---

## Response Status Codes

| Code | Meaning |
|------|---------|
| 200  | OK - Success |
| 201  | Created |
| 204  | No Content - Delete successful |
| 400  | Bad Request - Validation error |
| 401  | Unauthorized - Auth required |
| 403  | Forbidden - Permission denied |
| 404  | Not Found |
| 500  | Server Error |

---

## Pagination

List endpoints use cursor-based pagination:

```json
{
  "count": 100,
  "next": "http://api.example.com/accounts/?page=2",
  "previous": "http://api.example.com/accounts/?page=1",
  "results": [...]
}
```

Query Params:
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20, max: 100)

---

## Rate Limiting

- **Anonymous users**: 100 requests/hour
- **Authenticated users**: 1000 requests/hour

Header: `X-RateLimit-Remaining`

---

## Example cURL Requests

### Register
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

### List Rooms (Authenticated)
```bash
curl -X GET http://localhost:8000/api/v1/rooms/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create Room
```bash
curl -X POST http://localhost:8000/api/v1/rooms/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "room_number": "101",
    "floor": 1,
    "sharing_type": 2,
    "room_type": "AC",
    "monthly_rent": 5000
  }'
```
