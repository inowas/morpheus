#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/util.inc.sh"

cd $backendRoot/src

docker compose -f "$backendRoot/environments/dev/docker_compose.yml" down -v
