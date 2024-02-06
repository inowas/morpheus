#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/util.inc.sh"

docker compose -f "$infrastructureRoot/docker-compose.yml" \
  --profile mailcatcher \
  --profile keycloak \
  --profile backend \
  --profile celery \
  up -d --build --force-recreate --remove-orphans
