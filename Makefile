#!make
include .env

PROJECT=student_api

start: 
	docker-compose -f docker-compose.yaml -f docker-compose.database.yaml  -p $(PROJECT) up -d ${SERVICE}

down: 
	docker-compose -f docker-compose.yaml -f docker-compose.database.yaml -p $(PROJECT) down ${SERVICE}

restart:
	docker-compose -p ${PROJECT} restart ${SERVICE}

clean: 
	docker-compose -p $(PROJECT) down --remove-orphans -v

console:
	cd controller && hasura console --admin-secret ${HASURA_GRAPHQL_ADMIN_SECRET}

migrate:
	cd controller && hasura migrate apply --admin-secret ${HASURA_GRAPHQL_ADMIN_SECRET} --all-databases && hasura metadata apply --admin-secret ${HASURA_GRAPHQL_ADMIN_SECRET}

metadata-reload:
	cd controller && hasura metadata reload --admin-secret ${HASURA_GRAPHQL_ADMIN_SECRET}

seed:
	cd controller && hasura seed apply

%:
	@echo "Done"
