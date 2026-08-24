ARG BACKEND_APP_ROOT_PATH=/app

FROM python:3.12-bookworm AS base
ARG BACKEND_APP_ROOT_PATH
ARG BACKEND_USER_ID=1000
ARG BACKEND_GROUP_ID=1000

COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

ADD src/backend/src ${BACKEND_APP_ROOT_PATH}/src
ADD src/backend/pyproject.toml ${BACKEND_APP_ROOT_PATH}/pyproject.toml
ADD src/backend/uv.lock ${BACKEND_APP_ROOT_PATH}/uv.lock
ADD src/backend/README.md ${BACKEND_APP_ROOT_PATH}/README.md
ADD src/backend/docker/docker-entrypoint.sh ${BACKEND_APP_ROOT_PATH}/docker/docker-entrypoint.sh
ADD src/backend/docker/docker-entrypoint.d ${BACKEND_APP_ROOT_PATH}/docker/docker-entrypoint.d

WORKDIR ${BACKEND_APP_ROOT_PATH}
ENV UV_SYSTEM_PYTHON=1
ENV UV_PROJECT_ENVIRONMENT=/usr/local
RUN uv sync --frozen --no-dev

ENV PYTHONUNBUFFERED=1

RUN addgroup --system morpheus && adduser --system --group morpheus
RUN groupmod -g ${BACKEND_GROUP_ID} morpheus
RUN usermod -u ${BACKEND_USER_ID} -g ${BACKEND_GROUP_ID} morpheus
RUN mkdir -p /mnt/project/assets /mnt/project/calculations /mnt/sensors
RUN chown -R morpheus:morpheus /mnt

FROM base AS api_app
ARG BACKEND_APP_ROOT_PATH

USER morpheus
WORKDIR ${BACKEND_APP_ROOT_PATH}/src
ENTRYPOINT ["../docker/docker-entrypoint.sh"]
CMD ["gunicorn", "--bind", ":8000", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "morpheus.asgi:app"]
EXPOSE 8000
