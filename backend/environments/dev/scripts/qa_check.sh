#!/usr/bin/env bash

# include file with helper functions
source $(dirname "$0")/util.inc.sh

$devScriptsRoot/qa_check/check_code_style.sh
exitCodeCS=$?

$devScriptsRoot/qa_check/check_layered_architecture.sh
exitCodeDepCheck=$?

$devScriptsRoot/qa_check/run_static_code_analysis.sh
exitCodeSCA=$?

"$devScriptsRoot"/qa_check/run_tests.sh
exitCodeTests=$?


exitCode=0
outputHeadline "Summary"
if [ $exitCodeCS -ne 0 ]; then
    outputError "Code style check failed"
    exitCode=$((exitCode+1))
else
    outputSuccess "Code style check passed"
fi
if [ $exitCodeDepCheck -ne 0 ]; then
    outputError "Layered architecture dependency check failed"
    exitCode=$((exitCode+2))
else
    outputSuccess "Layered architecture dependency check passed"
fi
if [ $exitCodeSCA -ne 0 ]; then
    outputError "Static code analysis check failed"
    exitCode=$((exitCode+4))
else
    outputSuccess "Static code analysis check passed"
fi
if [ $exitCodeTests -ne 0 ]; then
    outputError "Some tests failed"
    exitCode=$((exitCode+8))
else
    outputSuccess "All tests passed"
fi


if [ $exitCode -ne 0 ]; then
    outputError "QA check failed"
else
    outputSuccess "QA check passed"
fi
exit $exitCode
