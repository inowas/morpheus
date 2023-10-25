#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/util.inc.sh"

docker compose -f "$localInfrastructureRoot/docker-compose.yml" \
  --profile mailcatcher \
  --profile keycloak \
  --profile backend_db_only \
  down

removeBackendEnvFile

