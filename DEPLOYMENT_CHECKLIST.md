# Deployment Checklist for PGMaster

Use this checklist to ensure smooth deployment to production.

## Pre-Deployment (Local Testing)

### Code Quality
- [ ] All tests passing: `make test`
- [ ] No linting errors: `make lint`
- [ ] TypeScript types correct: `make type-check`
- [ ] No console warnings
- [ ] No hardcoded secrets or credentials

### Backend
- [ ] Database migrations tested: `make migrate`
- [ ] Admin interface accessible: http://localhost:8000/admin
- [ ] API endpoints tested with Postman/cURL
- [ ] Email configuration tested
- [ ] Celery tasks working (if async jobs needed)
- [ ] File upload working
- [ ] CORS configuration correct
- [ ] JWT token refresh working

### Frontend
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors
- [ ] All pages loading correctly
- [ ] Forms submitting data to API
- [ ] Authentication flow working (login → dashboard → logout)
- [ ] Mobile responsive design verified
- [ ] Images loading correctly
- [ ] API calls using correct base URL

### Infrastructure
- [ ] Docker images building successfully
- [ ] All containers starting without errors
- [ ] Volumes mounted correctly
- [ ] Network connectivity verified
- [ ] Port conflicts resolved
- [ ] Environment variables configured

## Production Setup

### Environment Configuration
- [ ] Create `.env` file from `.env.example`
- [ ] Set `DEBUG=False`
- [ ] Generate secure `SECRET_KEY`
- [ ] Update `ALLOWED_HOSTS` with production domain
- [ ] Configure PostgreSQL (production instance)
- [ ] Configure Redis (production instance)
- [ ] Set email credentials (production SMTP)
- [ ] Configure AWS S3 (if using media files)
- [ ] Update `FRONTEND_URL` and `CORS_ALLOWED_ORIGINS`

### Database
- [ ] PostgreSQL 15+ installed and running
- [ ] Database created: `CREATE DATABASE pgmaster;`
- [ ] Database user created with permissions
- [ ] Backup strategy configured
- [ ] Point-in-time recovery enabled
- [ ] Database monitored

### Redis
- [ ] Redis 7+ installed and running
- [ ] Redis configured for persistence
- [ ] Redis password set
- [ ] Redis monitored for memory usage
- [ ] Backup strategy configured

### SSL/TLS
- [ ] SSL certificate obtained (Let's Encrypt or paid)
- [ ] Certificate installed on reverse proxy
- [ ] HTTPS enforced (redirect HTTP → HTTPS)
- [ ] Certificate auto-renewal configured
- [ ] Mixed content warnings resolved

### Reverse Proxy (Nginx/Apache)
- [ ] Reverse proxy installed and configured
- [ ] Backend endpoints proxied correctly
- [ ] Frontend assets served
- [ ] Gzip compression enabled
- [ ] Caching headers configured
- [ ] Security headers added
- [ ] Rate limiting configured

### Docker/Kubernetes
- [ ] Docker images built and tagged
- [ ] Images pushed to registry
- [ ] `docker-compose.yml` production version created
- [ ] Or Kubernetes manifests created if using K8s
- [ ] Resource limits configured
- [ ] Health checks configured
- [ ] Logging configured

### Monitoring & Logging
- [ ] Error tracking service configured (Sentry)
- [ ] Log aggregation configured (CloudWatch, Datadog, ELK)
- [ ] Uptime monitoring configured
- [ ] Alert rules created
- [ ] Performance monitoring enabled
- [ ] Database monitoring enabled

### Backups
- [ ] Database backup strategy defined
- [ ] Automated backups scheduled
- [ ] Backup retention policy set
- [ ] Restore procedure tested
- [ ] Media files backup configured
- [ ] Backup monitoring enabled

### Security
- [ ] Firewall rules configured
- [ ] SSH key-based authentication only
- [ ] Regular security updates planned
- [ ] Secrets management configured (Vault/Secrets Manager)
- [ ] API rate limiting configured
- [ ] DDoS protection enabled
- [ ] WAF rules configured (if applicable)
- [ ] Regular security audits scheduled

## Deployment Steps

### 1. Database Migration
```bash
# Connect to production server
ssh user@production-server

# Navigate to project
cd /opt/pgmaster

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Verify migrations
docker-compose exec backend python manage.py showmigrations
```

### 2. Static Files
```bash
# Collect static files
docker-compose exec backend python manage.py collectstatic --noinput

# Verify in media/static directory
ls -la pgmaster-backend/static/
```

### 3. Service Startup
```bash
# Start all services
docker-compose -f docker-compose.yml up -d

# Verify services are running
docker-compose ps

# Check logs for errors
docker-compose logs -f

# Verify API is responding
curl https://yourdomain.com/api/v1/health/  # if health endpoint exists
```

### 4. Verification
```bash
# Test frontend
curl -I https://yourdomain.com
# Should return 200

# Test API
curl -X POST https://yourdomain.com/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"pass"}'
# Should return access token

# Check database connection
docker-compose exec backend python manage.py shell
# Should connect successfully
```

## Post-Deployment

### Initial Operations
- [ ] Verify all services running: `docker-compose ps`
- [ ] Check logs for errors: `docker-compose logs`
- [ ] Test login at frontend
- [ ] Test API endpoints
- [ ] Verify email sending
- [ ] Test file uploads
- [ ] Create test data (rooms, tenants, payments)

### Monitoring First 24 Hours
- [ ] Monitor error logs
- [ ] Check system resources (CPU, memory, disk)
- [ ] Monitor database queries
- [ ] Monitor Redis usage
- [ ] Check for slowness
- [ ] Verify backups running

### Documentation Updates
- [ ] Update DNS records if needed
- [ ] Document deployment steps for future reference
- [ ] Document server access procedures
- [ ] Update runbooks
- [ ] Document emergency procedures

### Communication
- [ ] Notify stakeholders of deployment
- [ ] Provide access credentials to authorized users
- [ ] Set up on-call rotation
- [ ] Share deployment notes with team
- [ ] Create incident response procedures

## Troubleshooting Guide

### Service Won't Start
```bash
# Check Docker
docker-compose logs backend

# Restart service
docker-compose restart backend

# Check system resources
docker stats
```

### Database Connection Error
```bash
# Verify PostgreSQL is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Verify credentials in .env
cat .env | grep DATABASE

# Test connection
docker-compose exec db psql -U pgmaster -d pgmaster
```

### API Returning 500 Errors
```bash
# Check Django logs
docker-compose logs backend

# Run migrations if needed
docker-compose exec backend python manage.py migrate

# Collect static files if needed
docker-compose exec backend python manage.py collectstatic --noinput
```

### High Memory/CPU Usage
```bash
# Check what's consuming resources
docker stats

# Check for slow queries
docker-compose exec db psql -U pgmaster -d pgmaster
> SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;

# Scale up if needed or optimize
```

### SSL/TLS Certificate Issues
```bash
# Check certificate expiration
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates

# Renew certificate (Let's Encrypt)
certbot renew --dry-run
certbot renew
```

## Rollback Procedure

If deployment fails or critical issues emerge:

```bash
# 1. Stop current services
docker-compose down

# 2. Restore from backup
# Database: Use pg_restore or backup tool
# Code: Git checkout previous version

# 3. Start previous version
git checkout <previous-tag>
docker-compose up -d
docker-compose exec backend python manage.py migrate

# 4. Verify
# Run full test suite
# Check all endpoints
# Monitor for errors
```

## Performance Optimization

After deployment, optimize performance:

- [ ] Enable Redis caching
- [ ] Add database indexes
- [ ] Optimize images for web
- [ ] Enable gzip compression
- [ ] Configure CDN (if applicable)
- [ ] Set up query caching
- [ ] Monitor slow queries
- [ ] Configure connection pooling

## Maintenance Schedule

- [ ] Daily: Check error logs, monitor alerts
- [ ] Weekly: Review performance metrics, backup verification
- [ ] Monthly: Security updates, capacity planning
- [ ] Quarterly: Full system audit, optimization review
- [ ] Annually: Disaster recovery drill, architecture review

## Success Criteria

✅ Deployment is successful when:

- [ ] All services running without errors
- [ ] Frontend loads correctly
- [ ] API responding to requests
- [ ] Authentication working
- [ ] Database operations functioning
- [ ] Email notifications sending
- [ ] File uploads working
- [ ] Reports generating correctly
- [ ] No critical errors in logs
- [ ] Uptime monitoring shows 100%
- [ ] Load testing shows acceptable response times
- [ ] Users can access without issues

---

**Notes**:
- Keep this checklist updated as requirements change
- Customize based on your hosting provider
- Document any deviations from this checklist
- Share with your team before deployment

**Questions?** Refer to README.md or API_DOCUMENTATION.md
