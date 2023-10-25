#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/util.inc.sh"

localSensorDataMountpoint="$infrastructureRoot/data/morpheus/sensors"


outputHeadline "Preparing local .env file"

envFile="$infrastructureRoot/.env"
envTemplateFile="$infrastructureRoot/.env.dist"
if [[ -f $envFile ]]; then
    echo ""
    outputWarning "File $envFile already in place. You might want to check if it is up-to-date."
    echo ""
else
    cp "$envTemplateFile" "$envFile.tmp" \
    && if [[ "$isMacOs" = "true" ]] ; then userId=1000; else userId=$(id -u); fi \
    && if [[ "$isMacOs" = "true" ]] ; then groupId=1000; else groupId=$(id -g); fi \
    && sed -i.bak -e "s!__replace_with__flask_user_id!$userId!g" -- "$envFile.tmp" \
    && sed -i.bak -e "s!__replace_with__flask_group_id!$groupId!g" -- "$envFile.tmp" \
    && sed -i.bak -e "s!__replace_with__project_root!$projectRoot!g" -- "$envFile.tmp" \
    && sed -i.bak -e "s!__replace_with__local_sensor_data_mountpoint!$localSensorDataMountpoint!g" -- "$envFile.tmp" \
    && mv "$envFile.tmp" "$envFile" \
    && rm "$envFile.tmp.bak"
    exitWithErrorIfLastCommandFailed "Error preparing .env file $envFile"
    outputSuccess "Successfully prepared .env file"
fi



outputHeadline "Installing local tls certificates"

source "$infrastructureRoot/.env" \
&& mkdir -p "$infrastructureRoot/tls_certificates" \
&& export CAROOT="$infrastructureRoot/tls_certificates" \
&& mkcert -install \
&& mkcert \
  -key-file "$infrastructureRoot/tls_certificates/${TLS_KEY_FILE}" \
  -cert-file "$infrastructureRoot/tls_certificates/${TLS_CERT_FILE}" \
       ${DOMAIN} *.${DOMAIN} *.morpheus.${DOMAIN}
exitWithErrorIfLastCommandFailed "Error installing tls certificates"
outputSuccess "Successfully installed tls certificates"


outputHeadline "Preparing local mount points"

mkdir -p "$localSensorDataMountpoint"
exitWithErrorIfLastCommandFailed "Error preparing local mount points"
outputSuccess "Successfully prepared local mount points"
