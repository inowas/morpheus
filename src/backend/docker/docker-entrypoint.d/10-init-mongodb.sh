#!/bin/sh

set -e

entrypoint_log() {
    echo "$@"
}

ME=$(basename "$0")
entrypoint_log "$ME: info: Starting $ME"

cd ${BACKEND_APP_ROOT_PATH}/src
python init/mongodb.py

exit 0
