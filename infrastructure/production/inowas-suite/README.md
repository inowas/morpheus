# INOWAS Suite - Unified Deployment

This directory contains the **all-in-one deployment** for the complete INOWAS platform, including:

- **Traefik** - Reverse proxy with automatic HTTPS
- **Keycloak** - Authentication and identity management
- **Morpheus** - Main groundwater modeling application
- **MfViz** - MODFLOW visualization tool
- **SimpleTools** - Standalone calculation tools

## Quick Start

### 1. Choose Your Environment

**For Development:**
```bash
cp .env.dev .env
```

**For Production:**
```bash
cp .env.prod .env
# Edit .env and change all passwords and secrets!
```

### 2. Configure Environment Variables

Edit `.env` and update:

#### Required Changes for Production
```bash
# Strong passwords (generate random strings)
KEYCLOAK_ADMIN_PASSWORD=<strong-password>
KEYCLOAK_POSTGRES_PASSWORD=<strong-password>
BACKEND_SECRET_KEY=<random-secret-key>
MORPHEUS_MONGO_INITDB_ROOT_PASSWORD=<strong-password>
BACKEND_MONGO_PASSWORD=<strong-password>
RABBITMQ_DEFAULT_PASS=<strong-password>

# Keycloak client secret
BACKEND_KEYCLOAK_CLIENT_SECRET=<client-secret-from-keycloak>

# Email for Let's Encrypt
TRAEFIK_ACME_EMAIL=your-email@example.com

# Sentry DSN (if using Sentry)
BACKEND_SENTRY_DSN=https://your-sentry-dsn
```

#### Domain Configuration

Update domains to match your setup:
```bash
DOMAIN=inowas.com

# Development
MORPHEUS_FRONTEND_HOST=dev.morpheus.inowas.com
MORPHEUS_BACKEND_HOST=api.dev.morpheus.inowas.com
MFVIZ_HOST=dev.mfviz.inowas.com
SIMPLETOOLS_HOST=dev.tools.inowas.com
KEYCLOAK_HOST=identity.inowas.com

# Production
MORPHEUS_FRONTEND_HOST=morpheus.inowas.com
MORPHEUS_BACKEND_HOST=api.morpheus.inowas.com
MFVIZ_HOST=mfviz.inowas.com
SIMPLETOOLS_HOST=tools.inowas.com
KEYCLOAK_HOST=identity.inowas.com
```

### 3. Set Up DNS

Create A records pointing to your server IP:

**Development:**
- `dev.morpheus.inowas.com` → Your server IP
- `api.dev.morpheus.inowas.com` → Your server IP
- `dev.mfviz.inowas.com` → Your server IP
- `dev.tools.inowas.com` → Your server IP
- `identity.inowas.com` → Your server IP

**Production:**
- `morpheus.inowas.com` → Your server IP
- `api.morpheus.inowas.com` → Your server IP
- `mfviz.inowas.com` → Your server IP
- `tools.inowas.com` → Your server IP
- `identity.inowas.com` → Your server IP

### 4. Deploy

```bash
# Start all services
docker compose up -d

# Watch logs
docker compose logs -f

# Check status
docker compose ps
```

---

## Directory Structure

```
inowas-suite/
├── docker-compose.yml       # Main compose file (all services)
├── .env                     # Your environment configuration
├── .env.dev                 # Development template
├── .env.prod                # Production template
├── .env.dist                # Generic template
├── README.md                # This file
├── traefik/
│   ├── config.yml          # Traefik TLS configuration
│   ├── acme/               # SSL certificates (auto-generated)
│   └── logs/               # Access logs
└── cron/
    └── jobs/
        └── hourly/         # Cron jobs (if any)
```

---

## Services Overview

### Traefik (Reverse Proxy)
- **Ports:** 80 (HTTP), 443 (HTTPS)
- **Features:** Automatic HTTPS via Let's Encrypt, HTTP → HTTPS redirect
- **Container:** `inowas_suite_<env>-traefik`

### Keycloak (Authentication)
- **URL:** `https://identity.inowas.com`
- **Admin Console:** `https://identity.inowas.com/admin`
- **Containers:**
  - `inowas_suite_<env>-keycloak` (app)
  - `inowas_suite_<env>-keycloak-db` (PostgreSQL)

### Morpheus (Main Application)
- **Frontend:** `https://dev.morpheus.inowas.com`
- **Backend API:** `https://api.dev.morpheus.inowas.com`
- **Containers:**
  - `inowas_suite_<env>-morpheus-frontend`
  - `inowas_suite_<env>-morpheus-backend`
  - `inowas_suite_<env>-morpheus-worker` (Celery)
  - `inowas_suite_<env>-morpheus-cron`
  - `inowas_suite_<env>-morpheus-db` (MongoDB)
  - `inowas_suite_<env>-morpheus-mq` (RabbitMQ)

### MfViz (Visualizer)
- **URL:** `https://dev.mfviz.inowas.com`
- **Container:** `inowas_suite_<env>-mfviz-frontend`

### SimpleTools
- **URL:** `https://dev.tools.inowas.com`
- **Container:** `inowas_suite_<env>-simpletools-frontend`

---

## Common Operations

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f morpheus-backend
docker compose logs -f traefik
docker compose logs -f keycloak
```

### Restart Services

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart morpheus-backend

# Recreate and restart
docker compose up -d --force-recreate morpheus-backend
```

### Update Images

```bash
# Pull latest images
docker compose pull

# Restart with new images
docker compose up -d
```

### Stop/Start

```bash
# Stop all services
docker compose down

# Stop and remove volumes (WARNING: deletes data!)
docker compose down -v

# Start all services
docker compose up -d
```

### Access Container Shell

```bash
# Backend
docker compose exec morpheus-backend bash

# Database
docker compose exec morpheus-db mongosh

# Keycloak
docker compose exec keycloak bash
```

### Check Service Health

```bash
# All services
docker compose ps

# Specific healthcheck
docker compose exec morpheus-backend curl http://localhost:8000/healthcheck
```

---

## Troubleshooting

### Certificate Issues

**Problem:** `ERR_CERT_INVALID` or certificate errors

**Solutions:**

1. **Check Traefik logs:**
   ```bash
   docker compose logs traefik | grep -i "error\|certificate"
   ```

2. **For TU-Dresden network:** Use `tud-resolver` instead of `letsencrypt`
   ```bash
   # In .env
   TRAEFIK_CERT_RESOLVER=tud-resolver

   # Add TU-Dresden credentials
   TRAEFIK_ACME_TUD_CASERVER=<tud-ca-server>
   TRAEFIK_ACME_TUD_EAB_KID=<eab-kid>
   TRAEFIK_ACME_TUD_EAB_HMAC_ENCODED=<eab-hmac>
   ```

3. **For Hetzner/public servers:** Ensure ports 80 and 443 are open
   ```bash
   # Test from outside
   curl -I http://your-server-ip
   curl -Ik https://your-domain.com
   ```

4. **Force certificate renewal:**
   ```bash
   # Backup existing certificates
   cp -r traefik/acme traefik/acme.backup

   # Remove old certificates
   rm traefik/acme/*.json

   # Restart Traefik
   docker compose restart traefik
   ```

### Backend Not Starting

**Problem:** `ModuleNotFoundError` or backend unhealthy

**Solutions:**

1. **Check backend logs:**
   ```bash
   docker compose logs morpheus-backend
   ```

2. **Verify dependencies are installed:**
   ```bash
   docker compose exec morpheus-backend pip list | grep sentry
   ```

3. **Check MongoDB is healthy:**
   ```bash
   docker compose ps morpheus-db
   docker compose logs morpheus-db
   ```

4. **Rebuild backend image:**
   ```bash
   # If using local build
   docker compose build morpheus-backend
   docker compose up -d morpheus-backend
   ```

### Network Issues

**Problem:** Services can't communicate

**Solutions:**

1. **Check networks:**
   ```bash
   docker network ls | grep inowas
   docker network inspect inowas_suite_<env>-backend
   ```

2. **Verify service connections:**
   ```bash
   docker compose exec morpheus-backend ping morpheus-db
   docker compose exec morpheus-backend curl http://morpheus-mq:15672
   ```

### Database Connection Issues

**Problem:** Backend can't connect to MongoDB

**Solutions:**

1. **Check MongoDB health:**
   ```bash
   docker compose exec morpheus-db mongosh --eval "db.runCommand('ping')"
   ```

2. **Verify credentials in .env:**
   ```bash
   grep MONGO .env
   ```

3. **Check MongoDB logs:**
   ```bash
   docker compose logs morpheus-db
   ```

---

## Security Considerations

### Production Checklist

- [ ] Changed all default passwords
- [ ] Generated strong random secret keys
- [ ] Configured Sentry DSN for error tracking
- [ ] Set up regular backups for volumes
- [ ] Reviewed firewall rules
- [ ] Configured Keycloak properly (realms, clients, users)
- [ ] SSL certificates are valid and auto-renewing
- [ ] Removed or secured any debug endpoints
- [ ] Set up monitoring and alerting

### Backup Important Data

```bash
# MongoDB
docker compose exec morpheus-db mongodump --out /data/backup

# Keycloak PostgreSQL
docker compose exec keycloak-db pg_dump -U keycloak keycloak > keycloak-backup.sql

# Copy volumes
docker run --rm -v inowas_suite_production_morpheus-mongodb-data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb-backup.tar.gz /data
```

---

## Monitoring

### Check Resource Usage

```bash
# All containers
docker stats

# Specific container
docker stats inowas_suite_<env>-morpheus-backend
```

### View Traefik Access Logs

```bash
tail -f traefik/logs/traefik.log
```

---

## Migrating from Individual Deployments

If you're currently running services separately, here's how to migrate:

### 1. Backup Existing Data

```bash
# Export current volumes
docker volume ls | grep morpheus
docker run --rm -v morpheus_production_mongodb_backend_data:/data -v $(pwd):/backup alpine tar czf /backup/old-mongodb.tar.gz /data
```

### 2. Stop Old Services

```bash
cd /srv/docker/morpheus.production
docker compose down

cd /srv/docker/keycloak
docker compose down

# etc...
```

### 3. Restore Data to New Volumes

```bash
# Import into new volume names
docker run --rm -v inowas_suite_production_morpheus-mongodb-data:/data -v $(pwd):/backup alpine tar xzf /backup/old-mongodb.tar.gz -C /
```

### 4. Deploy Unified Stack

```bash
cd /srv/docker/inowas-suite
cp .env.prod .env
# Edit .env with your settings
docker compose up -d
```

---

## Additional Resources

- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Let's Encrypt Rate Limits](https://letsencrypt.org/docs/rate-limits/)

---

## Support

For issues specific to INOWAS applications, contact the development team or open an issue in the repository.

---

**Last Updated:** 2026-02-17
**Version:** 1.0.0
