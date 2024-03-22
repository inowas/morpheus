ARG DOCKERFILE_BUILD_BASE_STAGE=base

FROM python:3.12-bookworm as base

ARG BACKEND_APP_ROOT_PATH

# add files to image
ADD src/backend/src ${BACKEND_APP_ROOT_PATH}/src
ADD src/backend/requirements/prod.txt ${BACKEND_APP_ROOT_PATH}/requirements/prod.txt

# install python dependencies
RUN pip install --upgrade pip
RUN pip install -r ${BACKEND_APP_ROOT_PATH}/requirements/prod.txt
RUN get-modflow :python

# prepare python environment
ENV PYTHONUNBUFFERED 1

# create system user celery
RUN addgroup --system celery && adduser --system --group celery


FROM base as local_base

# set user id and group id for user celery to match the ids on the host system

ARG CELERY_USER_ID
ARG CELERY_GROUP_ID

RUN groupmod -g ${CELERY_USER_ID} celery
RUN usermod -u ${CELERY_USER_ID} -g ${CELERY_GROUP_ID} celery


FROM ${DOCKERFILE_BUILD_BASE_STAGE} as celery_worker

ARG BACKEND_APP_ROOT_PATH

# start celery worker as user celery
USER celery
WORKDIR ${BACKEND_APP_ROOT_PATH}/src
ENTRYPOINT ["celery", "-A", "task_queue", "worker", "--loglevel=INFO" ]
