ARG DOCKERFILE_BUILD_BASE_STAGE=base

FROM python:3.11-bookworm as base

# add files to image
ADD src/backend/src /app/src
ADD src/backend/requirements/prod.txt /app/requirements/prod.txt
ADD src/backend/docker/docker-entrypoint.sh /app/docker/docker-entrypoint.sh
ADD src/backend/docker/docker-entrypoint.d /app/docker/docker-entrypoint.d

# install python dependencies
RUN pip install --upgrade pip
RUN pip install -r /app/requirements/prod.txt

# prepare python environment
ENV PYTHONUNBUFFERED 1
ENV FLASK_ENV production

# create system user flask
RUN addgroup --system flask && adduser --system --group flask

# prepare mount points for user flask
RUN mkdir -p /mnt/sensors
RUN mkdir -p /mnt/modflow
RUN chown -R flask:flask /mnt


FROM base as local_base

# install mkcert and the CA certificate for local ssl certificates

ARG MKCERT_ROOT_CA_CERTIFICATE
ARG CAROOT

RUN curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64" \
    && chmod +x mkcert-v*-linux-amd64 \
    && cp mkcert-v*-linux-amd64 /usr/local/bin/mkcert

COPY ${MKCERT_ROOT_CA_CERTIFICATE} ${CAROOT}/
RUN mkcert -install
# make python requests library use the system trust store
RUN pip install pip_system_certs


# set user id and group id for user flask to match the ids on the host system

ARG FLASK_USER_ID
ARG FLASK_GROUP_ID

RUN groupmod -g ${FLASK_GROUP_ID} flask
RUN usermod -u ${FLASK_USER_ID} -g ${FLASK_GROUP_ID} flask


FROM ${DOCKERFILE_BUILD_BASE_STAGE} as backend

# start gunicorn as user flask
USER flask
WORKDIR /app/src
ENTRYPOINT ["/app/docker/docker-entrypoint.sh", "gunicorn", "--bind", ":8000", "--workers", "4", "wsgi:app"]
EXPOSE 8000
