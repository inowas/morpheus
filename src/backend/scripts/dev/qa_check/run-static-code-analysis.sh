#!/usr/bin/env bash

# include file with helper functions
source $(dirname "$0")/../util.inc.sh

outputHeadline "Running static code analysis"

cd $backendRoot/src
source $backendRoot/.venv/bin/activate && basedpyright --stats .
exitCode=$?
if [ $exitCode -ne 0 ]; then
    outputError "Static code analysis found errors"
else
    outputSuccess "Static code analysis found no errors"
fi

exit $exitCode
