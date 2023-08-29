#!/usr/bin/env bash

# include file with helper functions
source $(dirname "$0")/../util.inc.sh

outputHeadline "running tests"

cd $backendRoot
export FLASK_ENV=testing
pytest
exitCode=$?
if [ $exitCode -ne 0 ]; then
    outputError "Some tests failed"
else
    outputSuccess "All tests passed"
fi

exit $exitCode
