#!/usr/bin/env bash

source $(dirname $0)/util.inc.sh

while true; do
    read -p "Do you really want to reset your local docker environment? This will delete ignored files from git repository and all docker artifacts for the project (y/n) " yn
    case $yn in
        [Yy]* ) break;;
        [Nn]* ) echo "Environment will not be reset."; exit;;
        * ) echo "Please answer yes or no.";;
    esac
done

if [ -f "$infrastructureRoot/.env" ]; then
    source "$infrastructureRoot/.env"
else
    outputError "Could not read file $infrastructureRoot/.env."
    exit
fi


outputHeadline "Stopping containers"

cd "$infrastructureRoot/scripts"
./stop.sh


outputHeadline "Removing docker containers, volumes and network"

if [[ $(docker ps -a -f name=${COMPOSE_PROJECT_NAME}) == *"${COMPOSE_PROJECT_NAME}"* ]]; then
    docker rm --force $(docker ps -a -q -f name=${COMPOSE_PROJECT_NAME})
fi

if [[ $(docker volume ls -f name=${COMPOSE_PROJECT_NAME}) == *"${COMPOSE_PROJECT_NAME}"* ]]; then
    docker volume rm $(docker volume ls -q -f name=${COMPOSE_PROJECT_NAME})
fi


outputHeadline "Removing local files and directories"

# delete git ignored files from repo
# keep .idea to keep local ide settings
# keep .DS_Store to keep folder settings
cd "$projectRoot"
git clean -fXd \
    --exclude=!.idea --exclude=!.idea/* \
    --exclude=!.DS_Store --exclude=!.DS_Store/*;
