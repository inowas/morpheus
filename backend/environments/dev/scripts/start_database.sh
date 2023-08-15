#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/util.inc.sh"

cd $backendRoot/src
export FLASK_ENV=development
export POSTGRES_DB=$(dynaconf -i wsgi.settings get POSTGRES_DB)
export POSTGRES_USER=$(dynaconf -i wsgi.settings get POSTGRES_USER)
export POSTGRES_PASSWORD=$(dynaconf -i wsgi.settings get POSTGRES_PASSWORD)
export POSTGRES_PORT=$(dynaconf -i wsgi.settings get POSTGRES_PORT)
docker compose -f "$backendRoot/environments/dev/docker_compose.yml" up
