#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/util.inc.sh"

cd $projectRoot
docker compose -f infrastructure/development/docker-compose.yml up -d --build --force-recreate
