#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/util.inc.sh"

# if .env file already exists we assume that the dev environment is already running
if [ -f "$backendEnvFile" ]; then
  outputSuccess "Dev environment is already running"
  echo "To restart dev environment you must first stop it"
  exit 0
fi

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
exitWithErrorIfLastCommandFailed "Error running entrypoint script"

pip install pip_system_certs
exitWithErrorIfLastCommandFailed "Error installing pip_system_certs"

outputSuccess "Dev environment started"
