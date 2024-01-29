#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/util.inc.sh"

# if .env file already exists we assume that the dev environment is already running
if [ -f "$backendEnvFile" ]; then
  outputSuccess "Dev environment is already running"
  exit 0
fi

docker compose -f "$localInfrastructureRoot/docker-compose.yml" \
  --profile mailcatcher \
  --profile keycloak \
  --profile backend_db_only \
  --profile celery_broker_and_backend_only \
  up -d --build --force-recreate
exitWithErrorIfLastCommandFailed "Error starting local environment"

prepareBackendEnvFile

set -a # automatically export all variables from .env file
source $backendEnvFile
set +a
$backendRoot/docker/docker-entrypoint.sh
exitWithErrorIfLastCommandFailed "Error running entrypoint script"

outputSuccess "Dev environment started"
