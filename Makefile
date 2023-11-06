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
			printf "%-40s -- %s\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)

# Skips the first word
arguments := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))

## Install local environment
install-local:
	infrastructure/local/scripts/install.sh

## Start local environment
start-local:
	infrastructure/local/scripts/start.sh

## Stop local environment
stop-local:
	infrastructure/local/scripts/stop.sh

## Reset local environment
reset-local:
	infrastructure/local/scripts/reset-environment.sh

# Export keycloak dev realm from local environment
export-keycloak-dev-realm:
	infrastructure/local/scripts/export-keycloak-dev-realm.sh

run-backend-cli-command-in-local-environment:
	infrastructure/local/scripts/run-backend-cli-command.sh "$(arguments)"
