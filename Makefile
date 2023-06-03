.SILENT:
.PHONY: help

# Based on https://gist.github.com/prwhite/8168133#comment-1313022

## This help screen
help:
	printf "Available commands\n\n"
	awk '/^[a-zA-Z\-\_0-9]+:/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")-1); \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			printf "%-15s %s\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)

## Install dependencies
install:
	npm install --legacy-peer-deps

## Start the application in application development mode
start:
	npm run start

## Start storybook
start-storybook:
	npm run start-storybook

## Build the Application for production
build:
	npm run build

## build the whole application with mock-server for preview
build-preview-ci:
	npm install --legacy-peer-deps && npm run build-preview

## build the whole application with mock-server for preview
build-storybook-ci:
	npm install --legacy-peer-deps && npm run build-storybook

## Run testsuite with watching changes
test:
	npm run test

## Run all tests in ci
test-ci:
	npm run test:ci

## Run all tests with coverage
test-coverage:
	npm run test:coverage

## Check code style
cs-check:
	npm run cs-check

## Fix code style
cs-fix:
	npm run cs-fix

## Run dependency checks
dependency-checks:
	npm run depcruise:app

## Run verbose dependency checks
dependency-checks-verbose:
	npm run depcruise:app:explain
