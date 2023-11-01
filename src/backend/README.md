# Morpheus backend

## Requirements

* we suggest [PyCharm](https://www.jetbrains.com/pycharm/) as IDE
  * make sure to mark folder `backend/src` as "Sources Root"

* an installed local environment (see [main README](../../Readme.md#install-local-environment))

## Install dev environment

First you need to install the local environment (see [main README](../../Readme.md#install-local-environment)).
Then, in the backend folder, run `make install-dev`.

## Start the dev environment

In backend folder run `make start-dev`. This starts the necessary containers from local environment. It also prepares an
.env file in the backend source folder with adjusted environment variables for the dev environment.

## Stop the dev environment

In backend folder run `make stop-dev`. This stops the containers from local environment and removes the .env file from
the backend source folder.

## Run/Debug the flask app

### Option 1: Run flask app through PyCharm

Create a run/debug configuration in PyCharm (see [PyCharm documentation](https://www.jetbrains.com/help/pycharm/run-debug-configuration-flask-server.html)).

Choose the following settings:
* "Target type": "Module name"
* "FLASK_ENV": "development"
* check "FLASK_DEBUG"
* "Python interpreter": choose your virtuelenv
* "Working directory": choose the backend source folder (src/backend/src)

To run or debug the flask app through PyCharm you must first [start the dev environment](#start-the-dev-environment).
Now run or debug the flask app with the configuration from PyCharm. You can set breakpoints in your code and use all the
capabilities of PyCharm.

### Option 2: Run flask app from command line

If you don't use PyCharm, you can run the flask app from command line. Just run `make run-flask-app` the app starts in
debug mode.
