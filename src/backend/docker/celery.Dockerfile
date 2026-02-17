ARG BACKEND_APP_ROOT_PATH=/app

FROM python:3.12-bookworm AS base
ARG BACKEND_APP_ROOT_PATH
ARG CELERY_USER_ID
ARG CELERY_GROUP_ID

# install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# add files to image
ADD src/backend/src ${BACKEND_APP_ROOT_PATH}/src
ADD src/backend/pyproject.toml ${BACKEND_APP_ROOT_PATH}/pyproject.toml
ADD src/backend/requirements/prod.txt ${BACKEND_APP_ROOT_PATH}/requirements/prod.txt

# install python dependencies with uv
# Use system python (no venv needed in Docker)
WORKDIR ${BACKEND_APP_ROOT_PATH}
ENV UV_SYSTEM_PYTHON=1
RUN uv pip install --no-cache -r requirements/prod.txt
RUN get-modflow :python

# prepare python environment
ENV PYTHONUNBUFFERED 1

# create system user celery
RUN addgroup --system celery && adduser --system --group celery
RUN groupmod -g ${CELERY_GROUP_ID} celery
RUN usermod -u ${CELERY_USER_ID} -g ${CELERY_GROUP_ID} celery

# prepare mount points to be not mounted as root in the container (see https://github.com/moby/moby/issues/2259)
# other docker containers do this as well (e.g. mongodb sets the user to mongodb for mount point /data/db)
# so this seems to be the current best practice to solve permission errors when running containers as non-root
RUN mkdir -p /mnt/project/calculations
RUN chown -R celery:celery /mnt


FROM base AS celery_worker
ARG BACKEND_APP_ROOT_PATH

# start celery worker as user celery
USER celery
WORKDIR ${BACKEND_APP_ROOT_PATH}/src
CMD ["celery", "-A", "task_queue", "worker", "--loglevel=INFO" ]
