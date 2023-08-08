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

## Create containers, install dependencies, create database, run migrations and seeds
init:
	docker compose -f docker-compose.yml build --no-cache
	docker compose -f docker-compose.yml up -d
	docker compose exec api composer install --no-dev
	docker compose exec api ./bin/console.php orm:schema-tool:create
	docker compose exec api chown -R www-data:www-data var/db

## Create containers, install dependencies, create database, run migrations and seeds
rebuild:
	docker compose -f docker-compose.yml down
	docker compose -f docker-compose.yml build --no-cache
	docker compose -f docker-compose.yml up -d
	docker compose exec api composer install

## Update project
update:
	git pull
	docker compose -f docker-compose.yml down
	docker compose -f docker-compose.yml build --no-cache
	docker compose -f docker-compose.yml up -d --force-recreate
	docker compose exec api ./bin/console.php orm:schema-tool:update --force
	docker compose exec api composer install --no-dev

## Start containers in background (alias docker compose up -d)
start:
	docker compose -f docker-compose.yml up -d --force-recreate

## Start containers in background (alias docker compose up -d)
start-dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --force-recreate

## Start containers in background (alias docker compose up -d)
stop:
	docker compose -f docker-compose.yml down
