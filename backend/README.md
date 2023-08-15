# Morpheus backend

## Requirements

* we suggest to use [Pyenv](https://github.com/pyenv/pyenv) for python version management and python virtual environments
  * make sure you have your shell setup for `pyenv`: https://github.com/pyenv/pyenv#set-up-your-shell-environment-for-pyenv
  * also make sure to have your shell setup for `pyenv virtualenv`: https://github.com/pyenv/pyenv-virtualenv#installation

* if not using Pyenv, make sure to have the current version of [python](https://www.python.org/) installed

* we suggest PyCharm as IDE
  * make sure to mark folder `backend/src` as "Sources Root"

* docker compose (V2) is required for running the database in the dev environment

## Setup dev environment

* change to backend directory: `cd backend`
* setup python environment and install dependencies: `make install-dev`

## Run dev server

First start the database:
* `make start-dev-database`

There are two ways to start the development server:
1. Start it in your terminal with `make start-dev-server`
2. Create a run/debug configuration with PyCharm (this enables debugging with breakpoints in your PyCharm)
   * Target type: "Module name"
   * Target: "wsgi"
   * FLASK_ENV: "development"
   * FLASK_DEBUG enabled
   * Environment:
     * Python interpreter: should be named something like "inowas-morpheus-backend-x.xx.x" where x.xx.x is the python version
     * Working directory: backend/src (in the repository)
