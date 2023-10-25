#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/util.inc.sh"

cd $devScriptsRoot

./environment/setup-pyenv.sh
exitWithErrorIfLastCommandFailed "Error setting up pyenv"
./environment/install-requirements.sh
exitWithErrorIfLastCommandFailed "Error installing requirements"

