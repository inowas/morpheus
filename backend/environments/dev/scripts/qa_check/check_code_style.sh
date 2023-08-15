#!/usr/bin/env bash

# include file with helper functions
source $(dirname "$0")/../util.inc.sh

outputHeadline "Checking code style"

cd $backendRoot/src
flake8 ./
exitCode=$?
if [ $exitCode -ne 0 ]; then
    outputError "Found code style violations"
else
    outputSuccess "Code style is fine"
fi

exit $exitCode
