from celery import Celery

from morpheus.settings import settings

task_queue = Celery(
    main='task_queue',
    broker=settings.CELERY_BROKER,
    backend=settings.CELERY_RESULT_BACKEND,
    include=settings.CELERY_INCLUDE_TASK_MODULES,
)
