#!make
include .env

PROJECT=student-api
HASURA_DIR=src/controller

start: 
	docker-compose -f docker-compose.yaml -f docker-compose.database.yaml  -p ${PROJECT} up -d ${SERVICE}

down: 
	docker-compose -f docker-compose.yaml -f docker-compose.database.yaml -p ${PROJECT} down ${SERVICE}

restart:
	docker-compose -p ${PROJECT} restart ${SERVICE}

clean: 
	docker-compose -p ${PROJECT} down --remove-orphans -v

console:
	cd ${HASURA_DIR} && hasura console --admin-secret ${HASURA_GRAPHQL_ADMIN_SECRET}

migrate:
	cd ${HASURA_DIR} && hasura migrate apply --admin-secret ${HASURA_GRAPHQL_ADMIN_SECRET} --all-databases && hasura metadata apply --admin-secret ${HASURA_GRAPHQL_ADMIN_SECRET}

metadata-reload:
	cd ${HASURA_DIR} && hasura metadata reload --admin-secret ${HASURA_GRAPHQL_ADMIN_SECRET}

seed:
	cd ${HASURA_DIR} && hasura seed apply

%:
	@echo "Done"
