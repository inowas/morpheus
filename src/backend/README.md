# Morpheus backend

## Requirements

* we suggest [PyCharm](https://www.jetbrains.com/pycharm/) as IDE
  * make sure to mark folder `backend/src` as "Sources Root"
  * make sure to select the virtualenv (from src/backend/.venv) that is created by `make install-dev` as Python interpreter
* an installed local environment (see [main README](../../Readme.md#install-local-environment))
* [Python](https://www.python.org/) (version 3.12.0 or newer)

## Install dev environment

First you need to install the local environment (see [main README](../../Readme.md#install-local-environment)).
Then, in the backend folder, run `make install-dev`.

## Start the dev environment

In backend folder run `make start-dev`. This starts the necessary containers from local environment. It also prepares an
.env file in the backend source folder with adjusted environment variables for the dev environment.

## Stop the dev environment

In backend folder run `make stop-dev`. This stops the containers from local environment and removes the .env file from
the backend source folder.

## Run/Debug the flask server

### Option 1: Run flask app through PyCharm

Create a "**Flask server**" run/debug configuration in PyCharm (
see [PyCharm documentation](https://www.jetbrains.com/help/pycharm/run-debug-configuration-flask-server.html)).

Choose the following settings:

* "Target type": "Module name"
* "FLASK_ENV": "development"
* check "FLASK_DEBUG"
* "Python interpreter": choose your virtualenv (from src/backend/.venv)
* "Working directory": choose the backend source folder (src/backend/src)

To run or debug the flask app through PyCharm you must first [start the dev environment](#start-the-dev-environment).
Now run or debug the flask app with the configuration from PyCharm. You can set breakpoints in your code and use all the
capabilities of PyCharm.

### Option 2: Run flask app from command line

If you don't use PyCharm, you can run the flask app from command line. Just run `make run-flask-app`. The app starts in
debug mode.

## Run/Debug flask cli commands

### Option 1: Run flask cli commands through PyCharm

Create a "**Python**" run/debug configuration in PyCharm (
see [PyCharm documentation](https://www.jetbrains.com/help/pycharm/run-debug-configuration.html#createExplicitly)).

Choose the following settings:

* as python interpreter choose your virtualenv (from src/backend/.venv)
* select "script" and as path to script use the path to (from project root) "src/backend/.venv/bin/flask"
* as script parameters set the command name (e.g. "sensor sync-uit-sensors")
* "Working directory": choose the backend source folder (src/backend/src)

To run or debug the flask cli command through PyCharm you must first [start the dev environment](#start-the-dev-environment).
Now run or debug the flask cli command with the configuration from PyCharm. You can set breakpoints in your code and use all the
capabilities of PyCharm.

### Option 2: Run flask cli commands from command line

If you don't use PyCharm, you can run flask cli commands from command line. Just run `make run-flask-cli-command`. The flask cli command runs in
debug mode.

## Run/Debug the celery worker

### Option 1: Run celery worker through PyCharm

Create a "**Python**" run/debug configuration in PyCharm (
see [PyCharm documentation](https://www.jetbrains.com/help/pycharm/run-debug-configuration.html#createExplicitly)).

Choose the following settings:

* as python interpreter choose your virtualenv (from src/backend/.venv)
* select "script" and as path to script use the path to (from project root) "src/backend/.venv/bin/celery"
* as script parameters set "-A task_queue worker --loglevel=INFO"
* "Working directory": choose the backend source folder (src/backend/src)


To run or debug the celery worker through PyCharm you must first [start the dev environment](#start-the-dev-environment).
Now run or debug the celery worker with the configuration from PyCharm. You can set breakpoints in your code and use all the
capabilities of PyCharm.

### Option 2: Run celery worker from command line

If you don't use PyCharm, you can run the celery worker from command line. Just run `make run-celery-worker`.

## Keycloak Development Credentials

see [main README](../../Readme.md#keycloak)


## RabbitMQ Management

* url: http://rabbitmq.inowas.localhost
* username: see RABBITMQ_DEFAULT_USER in src/backend/src/.env file
* password: see RABBITMQ_DEFAULT_PASS in src/backend/src/.env file
