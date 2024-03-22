#!/usr/bin/env bash

# include file with helper functions
source "$(dirname "$0")/util.inc.sh"

localSensorDataMountpoint="$infrastructureRoot/data/morpheus/sensors"
localProjectAssetDataMountpoint="$infrastructureRoot/data/morpheus/project/assets"
localProjectCalculationDataMountpoint="$infrastructureRoot/data/morpheus/project/calculations"


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
    && sed -i.bak -e "s!__replace_with__local_project_asset_data_mountpoint!$localProjectAssetDataMountpoint!g" -- "$envFile.tmp" \
    && sed -i.bak -e "s!__replace_with__local_project_calculation_data_mountpoint!$localProjectCalculationDataMountpoint!g" -- "$envFile.tmp" \
    && sed -i.bak -e "s!__replace_with__celery_user_id!$userId!g" -- "$envFile.tmp" \
    && sed -i.bak -e "s!__replace_with__celery_group_id!$groupId!g" -- "$envFile.tmp" \
    && mv "$envFile.tmp" "$envFile" \
    && rm "$envFile.tmp.bak"
    exitWithErrorIfLastCommandFailed "Error preparing .env file $envFile"
    outputSuccess "Successfully prepared .env file"
fi


outputHeadline "Preparing local mount points"

mkdir -p "$localSensorDataMountpoint" && \
mkdir -p "$localProjectAssetDataMountpoint" && \
mkdir -p "$localProjectCalculationDataMountpoint"
exitWithErrorIfLastCommandFailed "Error preparing local mount points"
outputSuccess "Successfully prepared local mount points"
