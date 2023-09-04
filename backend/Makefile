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

## Install dev environment
install-dev:
	environments/dev/scripts/setup_pyenv.sh
	environments/dev/scripts/install.sh

## Start the development database
start-dev-database:
	environments/dev/scripts/start_database.sh

## Start the development server
start-dev-server:
	environments/dev/scripts/start_server.sh

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

## create new migration (pass name of migration as name="name of migration")
create_migration:
	environments/dev/scripts/create_migration.sh "$(name)"

