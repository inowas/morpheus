ARG BACKEND_APP_ROOT_PATH=/app

FROM node:20 AS build_openapi_spec
ADD src/backend/src /src
RUN npx @redocly/cli bundle --dereferenced --output /src/morpheus/openapi.bundle.json /src/morpheus/openapi.yml


FROM python:3.12-bookworm AS base
ARG BACKEND_APP_ROOT_PATH
ARG FLASK_USER_ID
ARG FLASK_GROUP_ID

# install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# add files to image
ADD src/backend/src ${BACKEND_APP_ROOT_PATH}/src
ADD src/backend/pyproject.toml ${BACKEND_APP_ROOT_PATH}/pyproject.toml
ADD src/backend/uv.lock ${BACKEND_APP_ROOT_PATH}/uv.lock
ADD src/backend/README.md ${BACKEND_APP_ROOT_PATH}/README.md
ADD src/backend/docker/docker-entrypoint.sh ${BACKEND_APP_ROOT_PATH}/docker/docker-entrypoint.sh
ADD src/backend/docker/docker-entrypoint.d ${BACKEND_APP_ROOT_PATH}/docker/docker-entrypoint.d
COPY --from=build_openapi_spec /src/morpheus/openapi.bundle.json ${BACKEND_APP_ROOT_PATH}/src/morpheus/openapi.bundle.json

# install python dependencies with uv
# Use system python (no venv needed in Docker)
WORKDIR ${BACKEND_APP_ROOT_PATH}
ENV UV_SYSTEM_PYTHON=1
RUN uv pip install --no-cache .

# prepare python environment
ENV PYTHONUNBUFFERED 1
ENV FLASK_ENV production

# create system user flask
RUN addgroup --system flask && adduser --system --group flask
RUN groupmod -g ${FLASK_GROUP_ID} flask
RUN usermod -u ${FLASK_USER_ID} -g ${FLASK_GROUP_ID} flask

# prepare mount points to be not mounted as root in the container (see https://github.com/moby/moby/issues/2259)
# other docker containers do this as well (e.g. mongodb sets the user to mongodb for mount point /data/db)
# so this seems to be the current best practice to solve permission errors when running containers as non-root
RUN mkdir -p /mnt/project/assets
RUN mkdir -p /mnt/project/calculations
RUN mkdir -p /mnt/sensors
RUN chown -R flask:flask /mnt


FROM base AS flask_app


ARG BACKEND_APP_ROOT_PATH

# start gunicorn as user flask
USER flask
WORKDIR ${BACKEND_APP_ROOT_PATH}/src
ENTRYPOINT ["../docker/docker-entrypoint.sh"]
CMD ["gunicorn", "--bind", ":8000", "--workers", "4", "wsgi:app"]
EXPOSE 8000
