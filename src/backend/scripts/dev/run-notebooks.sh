#!/usr/bin/env bash

# include file with helper functions
source $(dirname "$0")/util.inc.sh

outputHeadline "Running all notebooks"

cd $backendRoot/src
source $backendRoot/.venv/bin/activate && python $devScriptsRoot/run-notebooks.py
exitCode=$?
if [ $exitCode -ne 0 ]; then
    outputError "Notebooks failed"
else
    outputSuccess "Notebooks passed"
fi

exit $exitCode
