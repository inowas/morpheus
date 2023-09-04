#!/usr/bin/env bash

# include file with helper functions
source $(dirname "$0")/../util.inc.sh

outputHeadline "Fixing code style"

cd $backendRoot/src
autopep8 --in-place --recursive ./
