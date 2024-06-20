# Morpheus Full Stack Application

This repository contains the source code for the frontend and backend of the Morpheus application.

## Development

### Prerequisites

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)
- [Make](https://www.gnu.org/software/make/)
- [Node.js](https://nodejs.org/en/)
- [NVM](https://github.com/nvm-sh/nvm)
- [Python 3](https://www.python.org/)

### Prepare etc/hosts

add the following entries to your `/etc/hosts` file:

* 127.0.0.1 identity.inowas.localhost
* 127.0.0.1 rabbitmq.inowas.localhost

### Install local environment

To prepare local environment run:
`make install-local`

### Reset local environment

In case you want to reset the environment, you can run the following command. This will delete all docker containers,
volumes and images and all file ignored by git.

`make reset-local`

You can then create a fresh local environment by running the `make install-local` again.

### Start and stop local production environment (without https):

To start a local environment that runs backend and frontend in production mode without https run:
`make start-local`

To stop the local environment run:
`make stop-local`

When the local environment is running you can run backend cli commands with
`make run-backend-cli-command-in-local-environment`.

You can see how to run a development environment with debugging for the backend in
the [backend README](src/backend/README.md).

### Frontend

The frontend is a [React](https://reactjs.org/) application written in [TypeScript](https://www.typescriptlang.org/) and
can be found in the `src/frontend` directory.
More information about the frontend can be found in the [frontend README](src/frontend/README.md).

### Backend

The backend is a application written in [Python 3](https://www.python.org/) and can be found in the `src/backend`
directory.
More information about the backend can be found in the [backend README](src/backend/README.md).

### Mailcatcher

A mailcatcher can be found at http://mailcatcher.inowas.localhost. All mail can be viewed there.

### Keycloak

A keycloak server runs at http://identity.inowas.localhost. It has a preconfigured dev realm "inowas" with the client
"morpheus-frontend" and a user "dev@inowas.localhost" with the password "dev". The default dev user for the admin
console is:
* username: `admin`
* password: `dev`

The dev realm can be updated in the local dev environment and then exported with `make export-keycloak-dev-realm` to be
committed to the repository.

Two users are available in the dev realm:

Morpheus admin user:
* username: `admin@inowas.localhost`
* password: `dev`

Normal morpheus user:
* username: `dev@inowas.localhost`
* password: `dev`

## Local full stack development

To develop the full stack application locally you can run the following commands:

### Start backend infrastructure

```bash
cd src/backend
make install-dev
make start-dev
```

### Start frontend

```bash
cd src/frontend
make start-morpheus-integration-local
```

### Run flask backend api locally in pycharm or via make

```bash
cd src/backend
make run-flask-app
```
