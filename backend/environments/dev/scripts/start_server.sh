#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/util.inc.sh"

cd $backendRoot/src
export FLASK_ENV=development
export AUTHLIB_INSECURE_TRANSPORT=1
flask run --debug
