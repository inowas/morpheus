#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/util.inc.sh"

# check if .env file already exists and docker compose has expected number of running services
runningContainersCount=$(docker compose -f "$localInfrastructureRoot/docker-compose.yml" \
  --profile mailcatcher \
  --profile keycloak \
  --profile backend_db_only \
  --profile celery_broker_and_backend_only \
  ps --services --filter "status=running" | wc -l)
if [ -f "$backendEnvFile" ] && [ "$runningContainersCount" -eq 6 ]; then
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
source $backendRoot/.venv/bin/activate && cd $backendRoot/src && python init_mongodb.py
exitWithErrorIfLastCommandFailed "Error running entrypoint script"

outputSuccess "Dev environment started"
