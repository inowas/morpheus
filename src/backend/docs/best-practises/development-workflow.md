# Development Workflow

Use Docker for supporting services and run the backend locally for fast edit-test
cycles.

## Infrastructure

After starting or restarting OrbStack:

```bash
cd src/backend
make start-dev
```

This starts MongoDB, RabbitMQ, Keycloak, PostgreSQL, Traefik, and Mailcatcher.
It does not build or start the backend image.

## Flask API

In a second terminal:

```bash
cd src/backend
source .venv/bin/activate
cd src
flask run --host 127.0.0.1 --port 5000
```

The Flask API is available at `http://127.0.0.1:5000`.

## FastAPI API

The parallel ASGI slice can be started with:

```bash
cd src/backend
source .venv/bin/activate
cd src
uvicorn morpheus.asgi:app --host 127.0.0.1 --port 5050
```

The FastAPI API is available at `http://127.0.0.1:5050`.

## Celery

Start Celery locally only when task execution is required:

```bash
cd src/backend
source .venv/bin/activate
cd src
celery -A task_queue worker --loglevel=INFO
```

## Stop

```bash
cd src/backend
make stop-dev
```

Use `make start-local` only for full Docker-stack validation. It rebuilds and
starts the backend, Celery, and cron containers.
