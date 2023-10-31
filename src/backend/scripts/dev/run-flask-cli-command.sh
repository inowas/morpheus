#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/util.inc.sh"

$devScriptsRoot/start-dev.sh

cd $backendRoot/src
flask $@
