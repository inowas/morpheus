#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/util.inc.sh"


outputHeadline "Installing requirements"

pip install -r requirements/dev.txt

exitWithErrorIfLastCommandFailed "Error installing requirements"
outputSuccess "Successfully installed requirements"


outputHeadline "Preparing local secrets files"

localSecretsFile="$backendRoot"/config/.secrets.toml
devSecretsFile="$backendRoot"/environments/dev/.secrets_dev.toml
if [[ -f $localSecretsFile ]]; then
    echo ""
    outputWarning "File $localSecretsFile already in place. You might want to check if it is up-to-date."
    echo ""
else
    cp "$devSecretsFile" "$localSecretsFile.tmp" \
    && sed -i.bak -e "s!__REPLACE__SECRET_KEY__REPLACE__!$(python -c 'import secrets; print(secrets.token_hex())')!g" -- "$localSecretsFile.tmp" \
    && mv "$localSecretsFile.tmp" "$localSecretsFile" \
    && rm "$localSecretsFile.tmp.bak"
    exitWithErrorIfLastCommandFailed "Error preparing local secrets file $localSecretsFile"
    outputSuccess "Successfully prepared local secrets file"
fi
