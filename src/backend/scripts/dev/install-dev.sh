#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/util.inc.sh"

cd $backendRoot

outputHeadline "Setup local python venv"

venvPath=$backendRoot/.venv
python -m venv "$venvPath"
exitWithErrorIfLastCommandFailed "Could not setup Pyenv in $venvPath"
outputSuccess "Successfully setup local python venv in $venvPath"


outputHeadline "Installing requirements"

cd $backendRoot
source $backendRoot/.venv/bin/activate && pip install -r requirements/dev.txt && get-modflow :python

exitWithErrorIfLastCommandFailed "Error installing requirements"
outputSuccess "Successfully installed requirements"
