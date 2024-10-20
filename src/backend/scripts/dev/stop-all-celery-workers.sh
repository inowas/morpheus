#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/util.inc.sh"

cd $backendRoot/src
source $backendRoot/.venv/bin/activate &&  celery -A task_queue control shutdown
