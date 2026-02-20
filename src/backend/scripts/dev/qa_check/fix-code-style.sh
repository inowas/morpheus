#!/usr/bin/env bash

# include file with helper functions
source $(dirname "$0")/../util.inc.sh

outputHeadline "Fixing code style"

cd $backendRoot

# Run ruff linter with auto-fix
printf "\e[33mRunning Ruff Linter Fix...\e[0m\n"
uv run ruff check --fix ./src

# Run ruff formatter
printf "\e[33mRunning Ruff Formatter...\e[0m\n"
uv run ruff format ./src

outputSuccess "Code style fixes applied"
