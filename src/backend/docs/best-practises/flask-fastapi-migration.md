# Flask/FastAPI Migration

Flask remains the current main application. FastAPI is introduced incrementally
alongside it.

## Order

1. Health and schema endpoints.
2. Simple read-only routes such as sensors, users, and projects.
3. Model, calculation, and asset routes.
4. Docker and production entrypoint switch from WSGI to ASGI.
5. Remove Flask only after all routes and CLI functions have migrated.

## Rules

- Keep Flask and FastAPI routes available during comparison.
- Reuse application and request handlers.
- Keep transport adapters thin.
- Compare status codes, response bodies, headers, auth, and error behavior.
- Do not change Flask behavior while adding a parallel route unless explicitly
  required by the migration step.
- Remove Flask dependencies only after all Flask imports are gone.

Authentication identity is request-local and must not use `flask.g`.
Framework-neutral OpenAPI validation belongs in shared code; framework-specific
request adapters belong in transport layers.
