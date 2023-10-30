#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/util.inc.sh"

docker compose -f "$localInfrastructureRoot/docker-compose.yml" \
  --profile mailcatcher \
  --profile keycloak \
  --profile backend_db_only \
  up -d --build --force-recreate
exitWithErrorIfLastCommandFailed "Error starting local environment"

prepareBackendEnvFile

set -a # automatically export all variables from .env file
source $backendEnvFile
set +a
$backendRoot/docker/docker-entrypoint.sh
