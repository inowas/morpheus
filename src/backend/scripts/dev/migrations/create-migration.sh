#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/../util.inc.sh"


cd $backendRoot/src

name=$1
echo $name
if [ -z "$name" -o "$name" == "" ]; then
  outputError "Please provide a name for the migration as first argument"
  exit 1
fi

alembic revision -m "$1"
