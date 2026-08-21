# Morpheus

Morpheus is a full-stack groundwater modeling and decision support system (DSS).

## Project Structure

- [**Backend**](src/backend/README.md): Python-based REST API (FastAPI/Flask), event-sourced domain logic, and Celery task queue.
- [**Frontend**](src/frontend/README.md): React/TypeScript applications for modeling, visualization, and utilities.
- [**Infrastructure**](infrastructure/README.md): Docker-based local and production environment configurations.
- [**Keycloak**](src/keycloak/): Identity and access management configuration.

## Getting Started

1. **Prerequisites**: [Check the main README](../../Readme.md) for requirements (Docker, Python, Node.js, etc.).
2. **Setup**: Run `make install-local` from the root.
3. **Development**:
   - Start backend: `cd src/backend && make start-dev`
   - Start frontend: `cd src/frontend && make start-morpheus-integration-local`

## Development Workflow

- **Backend**: Follow the [Backend README](src/backend/README.md) for running the Flask/FastAPI app and tests.
- **Frontend**: Follow the [Frontend README](src/frontend/README.md) for development and building.
- **Infrastructure**: See the [Infrastructure README](infrastructure/README.md) for Docker and environment details.

## Contributors

Please follow the established patterns in the codebase. For architectural decisions, refer to the `concepts/` directory.
