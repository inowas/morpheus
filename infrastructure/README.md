# Morpheus Infrastructure

This directory contains the deployment and orchestration configurations for Morpheus.

## Environments

### Local Development (`/local`)
Managed via `docker-compose.yml` in `infrastructure/local/`.
Includes:
- **Traefik**: Reverse proxy and load balancer.
- **MongoDB**: Primary database.
- **RabbitMQ**: Message broker for Celery.
- **Keycloak**: Identity management.
- **Mailcatcher**: Email testing.
- **PostgreSQL**: Keycloak backend.

### Production (`/production`)
Managed via Docker Compose for scalable, production-ready deployment.
Includes:
- **Morpheus stack**: Backend, Celery, Cron.
- **Frontend stack**: Nginx/Static hosting.
- **Infrastructure services**: Traefik, Geonode, Keycloak.

## Deployment

Local development is managed via `make` commands in the root or `src/backend` directories.
- `make install-local` (Root)
- `make start-dev` (Backend)
- `make stop-dev` (Backend)
