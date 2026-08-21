# Backend Development

Use the local backend workflow for fast edit-test cycles.

## Start Infrastructure

Run this once after starting or restarting OrbStack:

```bash
cd src/backend
make start-dev
```

This starts the supporting services in Docker without building the backend:
MongoDB, RabbitMQ, Keycloak, PostgreSQL, Traefik, and Mailcatcher.

## Run API Locally

In a second terminal:

```bash
cd src/backend
source .venv/bin/activate
cd src
flask run --host 127.0.0.1 --port 5000
```

The API is available at `http://127.0.0.1:5000`. Flask debug reloads Python
changes automatically.

## Run Tests

```bash
cd src/backend
uv run pytest
```

Quick checks:

```bash
curl http://127.0.0.1:5000/healthcheck
curl http://127.0.0.1:5000/schema
```

## Run Celery Locally

Only when task execution is needed:

```bash
cd src/backend
source .venv/bin/activate
cd src
celery -A task_queue worker --loglevel=INFO
```

## Stop Infrastructure

```bash
cd src/backend
make stop-dev
```

Use `make start-local` only for full Docker-stack validation. It rebuilds and
starts the backend, Celery, and cron containers.
