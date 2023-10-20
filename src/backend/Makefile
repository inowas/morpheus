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


# Takes the first target as command
command := $(firstword $(MAKECMDGOALS))
# Skips the first word
arguments := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))

## runs architecture layer boundary checks, static code analysis and tests
qa-check:
	environments/dev/scripts/qa_check.sh

## runs tests
run-tests:
	environments/dev/scripts/qa_check/run_tests.sh

## fix code style
fix-code-style:
	environments/dev/scripts/qa_check/fix_code_style.sh

## migrates database to latest version
migrate-up:
	environments/dev/scripts/migrate_up.sh

## Runs flask cli command (pass command as command="command")
run-flask-cli-command:
	environments/dev/scripts/run_flask_cli_command.sh "$(arguments)"

## create new migration (pass name of migration as name="name of migration")
create_migration:
	environments/dev/scripts/create_migration.sh "$(name)"

