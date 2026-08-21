# Verification

Run the relevant checks after each deployable change.

## Backend Checks

```bash
cd src/backend
uv run pytest
uv run ruff check src/morpheus src/tests
```

## API Checks

```bash
curl http://127.0.0.1:5000/healthcheck
curl http://127.0.0.1:5000/schema
curl http://127.0.0.1:5050/healthcheck
curl http://127.0.0.1:5050/schema
```

## Docker Checks

For Docker-related changes:

```bash
cd infrastructure/local
docker compose --env-file .env \
  --profile backend \
  --profile backend_db_only \
  --profile celery_broker_and_backend_only \
  -f docker-compose.yml build backend
```

For a running stack, verify container health and Celery separately.

## Failure Handling

Do not stack unrelated fixes:

1. Reproduce one failure.
2. Identify the root cause.
3. Make the smallest fix.
4. Rerun the same check.
5. Record the result before continuing.
