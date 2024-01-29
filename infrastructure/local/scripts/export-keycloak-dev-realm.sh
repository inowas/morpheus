#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/util.inc.sh"


docker compose -f $infrastructureRoot/docker-compose.yml run keycloak \
  export --file /opt/keycloak/data/import/inowas-realm.json --realm inowas
