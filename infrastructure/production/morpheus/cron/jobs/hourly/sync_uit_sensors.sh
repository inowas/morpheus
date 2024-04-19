#!/bin/bash

# stop on errors
set -e

script_name=$(basename "$0")

# run the script
echo "Running ${script_name} at $(date)"
docker exec -i "${BACKEND_CONTAINER_NAME}" flask sensor sync-uit-sensors
echo "Finished ${script_name} at $(date)"
