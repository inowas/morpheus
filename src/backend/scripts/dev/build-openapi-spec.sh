#!/usr/bin/env bash

source "$(dirname "$0")/util.inc.sh"

cd $backendRoot

npm install @apidevtools/swagger-cli
exitWithErrorIfLastCommandFailed "Error installing swagger-cli"

swagger-cli bundle -o src/morpheus/openapi.bundle.yml -r -t yaml src/morpheus/openapi.yml
exitWithErrorIfLastCommandFailed "Error bundling openapi spec"
