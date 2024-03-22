#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/util.inc.sh"

cd $backendRoot

if command -v pyenv &> /dev/null
then
    outputHeadline "Switching to defined python version defined in .python-version file"
    pythonVersion=$(cat $backendRoot/.python-version)
    pyenv install -s $pythonVersion && pyenv local $pythonVersion
    exitWithErrorIfLastCommandFailed "Could not install python version $pythonVersion"
    outputSuccess "Successfully switched to python version $pythonVersion"
fi

outputHeadline "Setup local python venv"

venvPath=$backendRoot/.venv
python -m venv "$venvPath"
exitWithErrorIfLastCommandFailed "Could not setup Pyenv in $venvPath"
outputSuccess "Successfully setup local python venv in $venvPath"


outputHeadline "Installing requirements"

cd $backendRoot
source $backendRoot/.venv/bin/activate && pip install --upgrade pip && pip install -r requirements/dev.txt && get-modflow :python
exitWithErrorIfLastCommandFailed "Error installing requirements"
outputSuccess "Successfully installed requirements"


outputHeadline "Build OpenAPI spec"

cd $backendRoot
scripts/dev/build-openapi-spec.sh
exitWithErrorIfLastCommandFailed "Error building OpenAPI spec"
outputSuccess "Successfully built OpenAPI spec"
