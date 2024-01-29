#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/util.inc.sh"

$devScriptsRoot/start-dev.sh

cd $backendRoot/src
source $backendRoot/.venv/bin/activate && celery -A task_queue worker --loglevel=INFO
