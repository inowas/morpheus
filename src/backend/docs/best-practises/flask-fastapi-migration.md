# FastAPI Migration

The migration from Flask to FastAPI is complete. FastAPI is the only HTTP
application and ASGI is the only API runtime.

## Order

1. Health and schema endpoints.
2. Simple read-only routes such as sensors, users, and projects.
3. Model, calculation, and asset routes.
4. Docker and production entrypoint switch from WSGI to ASGI.
5. Remove the obsolete Flask adapter.

## Rules

- Reuse application and request handlers.
- Keep transport adapters thin.
- Compare status codes, response bodies, headers, auth, and error behavior.

Authentication identity is request-local and uses `contextvars`.
