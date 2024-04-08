#!/usr/bin/env bash

source "$(dirname "$0")/util.inc.sh"

cd $backendRoot

exitWithErrorIfLastCommandFailed "Error installing swagger-cli"

# npx @redocly/cli bundle --dereferenced --output src/morpheus/openapi.bundle.yml src/morpheus/openapi.yml
npx @redocly/cli bundle --dereferenced --output src/morpheus/openapi.bundle.json src/morpheus/openapi.yml
exitWithErrorIfLastCommandFailed "Error bundling openapi spec"
