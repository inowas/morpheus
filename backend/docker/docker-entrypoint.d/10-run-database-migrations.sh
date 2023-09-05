#!/bin/sh
# vim:sw=4:ts=4:et

set -e

entrypoint_log() {
    echo "$@"
}

ME=$(basename "$0")
entrypoint_log "$ME: info: Starting $ME"

/app/environments/dev/scripts/migrate_up.sh

exit 0
