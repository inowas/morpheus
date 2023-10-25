#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/../util.inc.sh"


cd $backendRoot/src
alembic upgrade head
