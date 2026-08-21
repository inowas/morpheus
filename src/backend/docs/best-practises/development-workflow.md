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

## Release

Releases are built and deployed by GitLab CI. GitHub is used for the pull
request; GitLab must receive the merged `main` branch.

After merging the pull request on GitHub:

```bash
git fetch origin main
git switch main
git pull --ff-only origin main
git push gitlab main
```

This starts the development pipeline and publishes the `dev` images. Check the
pipeline in GitLab before releasing to production.

For a production release, create and push a version tag from the merged
`main` commit:

```bash
git tag -a v0.14 -m "release v0.14"
git push gitlab v0.14
```

Use the next version instead of `v0.14`. The tag pipeline publishes the
versioned images and `latest`, then deploys production.

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
