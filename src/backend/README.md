# Morpheus Backend

The Morpheus backend is a groundwater modeling API built with Python.

## Technology Stack

- **Frameworks**: FastAPI (core API), Flask (legacy/wrapper)
- **Task Queue**: Celery with RabbitMQ
- **Database**: MongoDB (Event Store, Project/Sensor/User data)
- **Auth**: Keycloak (OIDC/JWT)
- **Modeling**: FloPy (MODFLOW 2005)
- **Deployment**: Docker, Traefik

## Quick Start

1. **Install dependencies**:
   ```bash
   cd src/backend
   make install-dev
   ```
2. **Start Infrastructure**:
   ```bash
   make start-dev
   ```
3. **Run API**:
   ```bash
   make run-flask-app
   ```

## Testing

Run the test suite using `uv`:
```bash
cd src/backend
uv run pytest
```

## Architecture

The backend follows a **CQRS and Event Sourcing** pattern.
- **Write side**: Commands are handled by `CommandHandler` classes and result in domain events.
- **Read side**: Events are consumed by `Projector` classes to build optimized read models in MongoDB.
- **Infrastructure**: Uses `Repository` patterns for data access.

For a detailed overview of the backend architecture, see the [Deep Analysis Report](#deep-analysis).
