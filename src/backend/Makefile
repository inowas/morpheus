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


# Skips the first word
arguments := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))

# prepare local development environment
install-dev:
	scripts/dev/install-dev.sh

## start backend as local flask server with debugging enabled and local docker environment without backend service
start-dev:
	scripts/dev/start-dev.sh

## stop local docker environment without backend service
stop-dev:
	scripts/dev/stop-dev.sh

## runs architecture layer boundary checks, static code analysis and tests
qa-check:
	scripts/dev/qa-check.sh

## runs tests
run-tests:
	scripts/dev/qa_check/run-tests.sh

## fix code style
fix-code-style:
	scripts/dev/qa_check/fix-code-style.sh

## migrates database to latest version
migrate-up:
	scripts/dev/migrations/migrate-up.sh

## create new migration (pass name of migration as argument)
create_migration:
	scripts/dev/migrations/create-migration.sh "$(arguments)"


## Runs flask cli command (pass command as argument)
run-flask-cli-command:
	scripts/dev/run-flask-cli-command.sh "$(arguments)"
