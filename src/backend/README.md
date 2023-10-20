# Morpheus backend

## Requirements

* we suggest [PyCharm](https://www.jetbrains.com/pycharm/) as IDE
  * make sure to mark folder `backend/src` as "Sources Root"

* [docker compose (V2)](https://docs.docker.com/compose/)

## Install dev environment

In project root run `make install-development`.

## Run dev server

In project root run `make start-development`.

## Debug dev server



## Write database migrations

In folder `src/backend`:

The command
```
make create_migration name="create table example"
```
creates a new migration file under `backend/src/migrations/versions`.

After that you must again run `make migrate-up`.
