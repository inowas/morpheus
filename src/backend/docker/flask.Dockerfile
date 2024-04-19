ARG BACKEND_APP_ROOT_PATH=/app

FROM node:20 as build_openapi_spec
ADD src/backend/src /src
RUN npx @redocly/cli bundle --dereferenced --output /src/morpheus/openapi.bundle.json /src/morpheus/openapi.yml


FROM python:3.12-bookworm as base
ARG BACKEND_APP_ROOT_PATH
ARG FLASK_USER_ID
ARG FLASK_GROUP_ID

# add files to image
ADD src/backend/src ${BACKEND_APP_ROOT_PATH}/src
ADD src/backend/requirements/prod.txt ${BACKEND_APP_ROOT_PATH}/requirements/prod.txt
ADD src/backend/docker/docker-entrypoint.sh ${BACKEND_APP_ROOT_PATH}/docker/docker-entrypoint.sh
ADD src/backend/docker/docker-entrypoint.d ${BACKEND_APP_ROOT_PATH}/docker/docker-entrypoint.d
COPY --from=build_openapi_spec /src/morpheus/openapi.bundle.json ${BACKEND_APP_ROOT_PATH}/src/morpheus/openapi.bundle.json

# install python dependencies
RUN pip install --upgrade pip
RUN pip install -r ${BACKEND_APP_ROOT_PATH}/requirements/prod.txt

# prepare python environment
ENV PYTHONUNBUFFERED 1
ENV FLASK_ENV production

# create system user flask
RUN addgroup --system flask && adduser --system --group flask
RUN groupmod -g ${FLASK_GROUP_ID} flask
RUN usermod -u ${FLASK_USER_ID} -g ${FLASK_GROUP_ID} flask


FROM base as flask_app
ARG BACKEND_APP_ROOT_PATH

# start gunicorn as user flask
USER flask
WORKDIR ${BACKEND_APP_ROOT_PATH}/src
ENTRYPOINT ["../docker/docker-entrypoint.sh"]
CMD ["gunicorn", "--bind", ":8000", "--workers", "4", "wsgi:app"]
EXPOSE 8000
