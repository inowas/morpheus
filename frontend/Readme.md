# Morpheus Frontend

This repository contains the source code for the Morpheus application and components.

## Installation

Clone the repository and install the dependencies.
Make sure you have [Node.js](https://nodejs.org/en/) installed.
Copy the `.env.example` file to `.env` and fill in the required values.

```shell
scp .env.example .env
make install
```

## Start Morpheus development webserver with mocked api

```shell
make start
```

## Start Morpheus development webserver without mocked api

If you want to use the Morpheus within the production system, you need to start the development webserver without mocked api.


## Start Storybook webserver on port localhost:6006

```shell
make start-storybook
```

## Build application and components

```shell
make build
```

## Build preview application and components with mocked api

```shell
make build-preview-ci
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
For information on how to use DepCruiser, see the [DepCruiser documentation](https://github.com/sverweij/dependency-cruiser).

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
