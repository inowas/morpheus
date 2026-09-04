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

# Frontend Visual Regression Baselines

The visual tests (`npm run test:visual`) run the real built app with Playwright
and mocked Keycloak OIDC + API (no Storybook). Snapshots in
`src/frontend/e2e/visual.spec.ts-snapshots/` are compared against the **Linux**
Playwright CI image, so baselines must be `-linux.png`. macOS-generated
`-darwin.png` snapshots are never compared and must not be committed.

## Generate baselines locally

Requires OrbStack (docker daemon) running:

```bash
mise run frontend-visual-baselines
```

This starts `mcr.microsoft.com/playwright:v1.44.1-jammy` (the same image as CI),
installs deps, builds `dist/morpheus`, and writes
`src/frontend/e2e/visual.spec.ts-snapshots/*-linux.png`. Then commit them:

```bash
git add src/frontend/e2e/visual.spec.ts-snapshots
git commit -m "test: commit linux visual baselines"
```

## Trigger baselines via CI instead

Run the manual GitLab job `update-frontend-visual-baselines`, which generates
the Linux snapshots in CI (`VISUAL_UPDATE_SNAPSHOTS=1`). Download its artifacts
from `src/frontend/e2e` and commit them as above.

Keep the Playwright image tag in `mise.toml` and `.gitlab-ci.tests.yml` in sync
when the version is bumped.

