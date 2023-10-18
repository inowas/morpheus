#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/util.inc.sh"

cd $projectRoot
docker compose -f infrastructure/development/docker-compose.yml exec backend bash -c "cd /app/src && flask $@"
