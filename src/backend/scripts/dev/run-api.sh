#!/usr/bin/env bash

source "$(dirname "$0")/util.inc.sh"

$devScriptsRoot/start-dev.sh

cd "$backendRoot/src"
source "$backendRoot/.venv/bin/activate" && uvicorn morpheus.asgi:app --host 127.0.0.1 --port 5000
