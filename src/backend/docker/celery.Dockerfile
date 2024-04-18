ARG BACKEND_APP_ROOT_PATH=/app

FROM python:3.12-bookworm as base
ARG BACKEND_APP_ROOT_PATH
ARG CELERY_USER_ID
ARG CELERY_GROUP_ID

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
RUN groupmod -g ${CELERY_GROUP_ID} celery
RUN usermod -u ${CELERY_USER_ID} -g ${CELERY_GROUP_ID} celery


FROM base as celery_worker
ARG BACKEND_APP_ROOT_PATH

# start celery worker as user celery
USER celery
WORKDIR ${BACKEND_APP_ROOT_PATH}/src
CMD ["celery", "-A", "task_queue", "worker", "--loglevel=INFO" ]
