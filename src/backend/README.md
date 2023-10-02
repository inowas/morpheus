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

For Apple Silicon users:
* `make install-dev` will fail because of a missing `psycopg2` wheel for ARM64.
* You can install it manually with `pip install psycopg2-binary` and then run `make install-dev` again or
* you can install postgresql@14 with homebrew and then install psycopg2-binary with pip:

```
❯ brew install postgresql@14
# If you open a new terminal tab you will see that pg_config is available
❯ export CPPFLAGS="-I/opt/homebrew/opt/openssl@1.1/include"
❯ export LDFLAGS="-L/opt/homebrew/opt/openssl@1.1/lib -L${HOME}/.pyenv/versions/3.11.4/lib" # use your current python version
❯ python -V
Python 3.11.4 # make sure it matches the same above configuration
❯ pip install psycopg2-binary==2.8.5
````

## Run dev server

First start the database:
* `make start-dev-database`

Run migrations:
* `make migrate-up`

There are two ways to start the development server:
1. Start it in your terminal with `make start-dev-server`
2. Create a run/debug configuration with PyCharm (this enables debugging with breakpoints in your PyCharm)
   * Target type: "Module name"
   * Target: "wsgi"
   * FLASK_ENV: "development"
   * FLASK_DEBUG enabled
   * Environment:
     * Environment variables: `AUTHLIB_INSECURE_TRANSPORT=1`
     * Python interpreter: should be named something like "inowas-morpheus-backend-x.xx.x" where x.xx.x is the python version
     * Working directory: backend/src (in the repository)


### Create client for OAuth2

In directory `backend/src`run
```
FLASK_ENV=development flask auth create-public-oauth2-client
```

You can now use this client for Authentication.

### Create users

In directory `backend/src`run
```
FLASK_ENV=development flask user create test1@inowas.localhost 1234567890abcdef
```

This would create a user `test1@inowas.localhost` with password `1234567890abcdef` which you can use to login.

## Write database migrations

The command
```
make create_migration name="create table foo"
```
creates a new migration file under `backend/src/migrations/versions`.

After that you must again run `make migrate-up`.