#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/../util.inc.sh"

outputHeadline "Installing requirements"

cd $backendRoot
pip install -r requirements/dev.txt

exitWithErrorIfLastCommandFailed "Error installing requirements"
outputSuccess "Successfully installed requirements"
