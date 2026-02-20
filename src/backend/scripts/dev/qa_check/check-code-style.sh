#!/usr/bin/env bash

# include file with helper functions
source $(dirname "$0")/../util.inc.sh

outputHeadline "Checking code style"

cd $backendRoot

# Run ruff check
printf "\e[33mRunning Ruff Linter Check...\e[0m\n"
uv run ruff check ./src
lintExitCode=$?

# Run ruff format check
printf "\e[33mRunning Ruff Format Check...\e[0m\n"
uv run ruff format --check ./src
formatExitCode=$?

# Determine overall exit code
exitCode=0
if [ $lintExitCode -ne 0 ] || [ $formatExitCode -ne 0 ]; then
    exitCode=1
    outputError "Found code style violations"
else
    outputSuccess "Code style is fine"
fi

exit $exitCode
