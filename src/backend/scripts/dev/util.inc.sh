#!/usr/bin/env bash

projectRoot=$( cd "$(dirname "$BASH_SOURCE")/../../../.." ; pwd -P )
backendRoot="$projectRoot/src/backend"
devScriptsRoot="$backendRoot/scripts/dev"
localInfrastructureRoot="$projectRoot/infrastructure/local"

backendEnvFile="$backendRoot/src/.env"

function outputHeadline {
    echo ""
    echo "---"
    echo "$1"
    echo "---"
    echo ""
}

function outputError {
    echo ""
    echo -e "\033[0;31m✗ $1\033[0m" 1>&2
    echo ""
}

function outputSuccess {
    echo ""
    echo -e "\033[0;32m✓ $1\033[0m"
    echo ""
}

function outputWarning {
    echo ""
    echo -e "\033[0;33m⚠ $1\033[0m"
    echo ""
}

function exitWithErrorIfLastCommandFailed {
    if [ $? -ne 0 ]; then
        if [ ! -z "$1" ]; then
            outputError "$1"
        fi
        exit 1
    fi
}

function prepareBackendEnvFile {
  # load env variables from local infrastructure environment (we need the value for $LOCAL_SENSOR_DATA_MOUNTPOINT)
  source $localInfrastructureRoot/.env

   # prepare .env file for backend (overwriting vars for dev environment)
  cp "$localInfrastructureRoot/.env" "$backendEnvFile.tmp" \
    && sed -i.bak -e "/BACKEND_MORPHEUS_SENSORS_LOCAL_DATA/d" -- "$backendEnvFile.tmp" \
    && sed -i.bak -e "/BACKEND_POSTGRES_HOST/d" -- "$backendEnvFile.tmp" \
    && sed -i.bak -e "/BACKEND_MONGO_HOST/d" -- "$backendEnvFile.tmp" \
    && sed -i.bak -e "/BACKEND_APP_ROOT_PATH/d" -- "$backendEnvFile.tmp" \
    && mv "$backendEnvFile.tmp" "$backendEnvFile" \
    && rm -f "$backendEnvFile.tmp.bak" \
    && echo "" >> "$backendEnvFile" \
    && echo "# overwrite vars for dev environment" >> "$backendEnvFile" \
    && echo "# (automatically generated by $0)" >> "$backendEnvFile" \
    && echo "" >> "$backendEnvFile" \
    && echo "BACKEND_MORPHEUS_SENSORS_LOCAL_DATA=$LOCAL_SENSOR_DATA_MOUNTPOINT" >> "$backendEnvFile" \
    && echo "BACKEND_POSTGRES_HOST=localhost" >> "$backendEnvFile" \
    && echo "BACKEND_MONGO_HOST=localhost" >> "$backendEnvFile" \
    && echo "BACKEND_APP_ROOT_PATH=$backendRoot" >> "$backendEnvFile" \
    && echo "PYTHONUNBUFFERED=1" >> "$backendEnvFile" \
    && echo "FLASK_ENV=development" >> "$backendEnvFile" \
    && echo "FLASK_DEBUG=1" >> "$backendEnvFile" \
    && echo "FLASK_APP=wsgi:app" >> "$backendEnvFile" \
    && echo "SSL_CERT_FILE=$localInfrastructureRoot/tls_certificates/rootCA.pem" >> "$backendEnvFile" \
    && echo "REQUESTS_CA_BUNDLE=$localInfrastructureRoot/tls_certificates/rootCA.pem" >> "$backendEnvFile"
    exitWithErrorIfLastCommandFailed "Error preparing .env file $backendEnvFile"
    outputSuccess "Successfully prepared file $backendEnvFile"
}

function removeBackendEnvFile {
  rm -f $backendEnvFile
}
