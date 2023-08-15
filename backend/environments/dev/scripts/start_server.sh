#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/util.inc.sh"

cd $backendRoot/src
FLASK_ENV=development flask run --debug
