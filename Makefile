#!make
include .env

PROJECT=nexlab_be_intern

dev: 
	docker-compose -f docker-compose.yaml -f docker-compose.database.yaml  -p $(PROJECT) up -d ${SERVICE}

down: 
	docker-compose -f docker-compose.yaml -f docker-compose.database.yaml -p $(PROJECT) down ${SERVICE}

restart:
	docker-compose -p ${PROJECT} restart ${SERVICE}

clean: 
	docker-compose -p $(PROJECT) down --remove-orphans -v

console:
	hasura console --admin-secret ${HASURA_GRAPHQL_ADMIN_SECRET}

migrate:
	hasura migrate apply --admin-secret ${HASURA_GRAPHQL_ADMIN_SECRET}

metadata-apply:
	hasura metadata apply --admin-secret ${HASURA_GRAPHQL_ADMIN_SECRET}

metadata-reload:
	hasura metadata reload --admin-secret ${HASURA_GRAPHQL_ADMIN_SECRET}

seed:
	hasura seed apply

%:
	@echo "Done"
