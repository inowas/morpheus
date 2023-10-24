#!/bin/bash

# stop on errors
set -e

script_name=$(basename "$0")

# run the script
echo "Running ${script_name} at $(date)"
docker exec -i -u flask morpheus_dev-backend flask sensors sync-uit-sensors
echo "Finished ${script_name} at $(date)"
