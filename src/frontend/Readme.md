# Morpheus Frontend Applications

This repository contains the source code for different frontend applications of the Morpheus project.

## Applications

### Morpheus

The Morpheus application is a web application for the Morpheus project.
It can be embedded in other applications or used as a standalone application.

To embed set the `embedded` query parameter to `true`.
e.g. `https://morpheus.inowas.com?embedded=true`

To disable embedded mode you have to set the `embedded` query parameter to `false`.
e.g. `https://morpheus.inowas.com?embedded=false`

* Modflow Visualizer (MfViz)

## Installation

Clone the repository and install the dependencies.
Make sure you have [Node.js](https://nodejs.org/en/) installed.
Copy the `.env.example` file to `.env` and fill in the required values.

```shell
scp .env.example .env
make install
```

## Start Morpheus application development webserver with mocked api

```shell
make start-morpheus
```

## Start Morpheus application development webserver against local Morpheus API and Identity Server

Make sure you have the Morpheus API and Identity Server running locally.
See the [README](../../README.md) for more information.

```shell
make start-morpheus-integration-local
```

## Start Modflow Visualizer application development webserver with mocked api

```shell
make start-mfviz
```

## Start Storybook webserver on port localhost:6006

```shell
make start-storybook
```

## Build Morpheus application

```shell
make build-morpheus
```

## Build Modflow Visualizer application

```shell
make build-mfviz
```

## Build storybook

```shell
make build-storybook-ci
```

## Run tests

### Run and watch tests

```shell
make test
```

### Run and generate coverage

```shell
make test-coverage
```

### Run tests in CI

```shell
make test-ci
```

## Check code style

```shell
make cs-check
```

## Fix code style

```shell
make cs-fix
```

## Dependency tracking

Following our rules for dependency tracking, we use [DepCruiser](https://github.com/sverweij/dependency-cruiser).
For information on how to use DepCruiser, see
the [DepCruiser documentation](https://github.com/sverweij/dependency-cruiser).

To check the dependency graph for the app against out ruleset, run:

```shell
make dependency-checks
```

or

```shell
npm run depcruise:app
```

To have a more verbose output, run:

```shell
make dependency-checks-verbose
```

or

```shell
npm run depcruise:app:explain
```

To visualize the dependency graph for the app, run:

```shell
npm run depcruise:app:graph
```

To create or update a baseline file for the dependency graph for the app, run:

```shell
npm run depcruise:app:baseline
```

## Analyze bundle size

After building the application, you can analyze the bundle size by running:

```shell
make analyze
```
