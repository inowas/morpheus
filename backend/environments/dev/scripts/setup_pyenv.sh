#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/util.inc.sh"

PYTHON_VERSION=3.11.4
PYTHON_VIRTUAL_ENV=inowas-morpheus-backend-$PYTHON_VERSION

command -v pyenv >/dev/null 2>&1 || {
    outputWarning "Pyenv is not installed. Skipping setup of local python env. Make sure to have the proper python version $PYTHON_VERSION installed!"; exit 0;
}

outputHeadline "Setup local python environment"

pyenv install --skip-existing $PYTHON_VERSION \
&& pyenv virtualenv --force $PYTHON_VERSION $PYTHON_VIRTUAL_ENV \
&& pyenv local $PYTHON_VIRTUAL_ENV
exitWithErrorIfLastCommandFailed "Could not setup Pyenv"
outputSuccess "Successfully setup local python virtualenv $PYTHON_VIRTUAL_ENV with version $PYTHON_VERSION"
