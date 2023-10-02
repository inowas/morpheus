#!/usr/bin/env bash

projectRoot=$( cd "$(dirname "$BASH_SOURCE")/../../.." ; pwd -P )
infrastructureRoot=$projectRoot/infrastructure/development
if [[ "$(uname)" = "Darwin" ]] ; then isMacOs=true; else isMacOs=false; fi

function outputHeadline {
    echo ""
    echo "---"
    echo "$1"
    echo "---"
    echo ""
}

function outputError {
    echo ""
    echo -e "\033[0;31m✗ $1\033[0m" 1>&2
    echo ""
}

function outputSuccess {
    echo ""
    echo -e "\033[0;32m✓ $1\033[0m"
    echo ""
}

function outputWarning {
    echo ""
    echo -e "\033[0;33m⚠ $1\033[0m"
    echo ""
}

function exitWithErrorIfLastCommandFailed {
    if [ $? -ne 0 ]; then
        if [ ! -z "$1" ]; then
            outputError "$1"
        fi
        exit 1
    fi
}
