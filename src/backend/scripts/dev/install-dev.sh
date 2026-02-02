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

outputHeadline "Installing uv if not present"

if ! command -v uv &> /dev/null
then
    outputInfo "uv not found, installing..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    exitWithErrorIfLastCommandFailed "Could not install uv"
    outputSuccess "Successfully installed uv"
else
    outputSuccess "uv is already installed"
fi

outputHeadline "Setup local python venv and install dependencies with uv"

cd $backendRoot
# uv will automatically create a venv in .venv if it doesn't exist
# and install dependencies from pyproject.toml
uv sync --extra dev
exitWithErrorIfLastCommandFailed "Error installing dependencies with uv"
outputSuccess "Successfully installed dependencies with uv"

outputHeadline "Installing MODFLOW"

cd $backendRoot
source $backendRoot/.venv/bin/activate && get-modflow :python
exitWithErrorIfLastCommandFailed "Error installing MODFLOW"
outputSuccess "Successfully installed MODFLOW"


outputHeadline "Build OpenAPI spec"

cd $backendRoot
scripts/dev/build-openapi-spec.sh
exitWithErrorIfLastCommandFailed "Error building OpenAPI spec"
outputSuccess "Successfully built OpenAPI spec"
