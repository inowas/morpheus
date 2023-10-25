#!/bin/sh
# vim:sw=4:ts=4:et

set -e

entrypoint_log() {
    echo "$@"
}

ME=$(basename "$0")
entrypoint_log "$ME: info: Starting $ME"

cd /app/src
alembic upgrade head

exit 0
