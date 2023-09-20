#!/usr/bin/env bash

# include file with helper functions
source $(dirname "$0")/../util.inc.sh

outputHeadline "Checking dependencies in layered architecture"

cd $backendRoot/src
dep_check check morpheus
exitCode=$?
if [ $exitCode -ne 0 ]; then
    outputError "Found errors in dependencies between layers"
else
    outputSuccess "Found no dependency violations in layered architecture"
fi

exit $exitCode
