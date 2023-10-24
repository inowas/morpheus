#!/bin/bash

# stop on errors
set -e

scriptname=$(basename "$0")

# check if script is already running
if pidof -o %PPID -x "$scriptname"; then
    echo "Script is already running"
    exit 1
fi

# run the script
echo "Running ${scriptname} at $(date)"
docker exec -it -u flask morpheus_dev-backend flask sensors sync-uit-sensors
