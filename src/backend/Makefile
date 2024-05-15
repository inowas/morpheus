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

## prepare local development environment
install-dev:
	scripts/dev/install-dev.sh

## start local docker environment without backend service and prepare dev environment
start-dev:
	scripts/dev/start-dev.sh

## stop local docker environment without backend service
stop-dev:
	scripts/dev/stop-dev.sh

## run architecture layer boundary checks, static code analysis and tests
qa-check:
	scripts/dev/qa-check.sh

## run architecture layer boundary checks, static code analysis and tests
run-notebooks:
	scripts/dev/run-notebooks.sh

## run tests
run-tests:
	scripts/dev/qa_check/run-tests.sh

## fix code style
fix-code-style:
	scripts/dev/qa_check/fix-code-style.sh

## run celery worker
run-celery-worker:
	scripts/dev/run-celery-worker.sh

## stop all celery workers
stop-all-celery-workers:
	scripts/dev/stop-all-celery-workers.sh

## runs flask app
run-flask-app:
	scripts/dev/run-flask-app.sh

## runs flask cli command (pass command as argument)
run-flask-cli-command:
	scripts/dev/run-flask-cli-command.sh "$(arguments)"

## bundle openapi spec
build-openapi-spec:
	scripts/dev/build-openapi-spec.sh && make run-flask-cli-command check-schema
