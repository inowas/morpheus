#!/usr/bin/env bash

source "$(dirname "$0")/util.inc.sh"

$devScriptsRoot/start-dev.sh

cd "$backendRoot/src"
source "$backendRoot/.venv/bin/activate" && python -m morpheus.cli "$@"
