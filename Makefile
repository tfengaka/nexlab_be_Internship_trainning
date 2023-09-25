PROJECT=nexlab_be_intern

dev: 
	docker-compose -f docker-compose.yaml -f docker-compose.database.yaml  -p $(PROJECT) up -d ${SERVICE}

down: 
	docker-compose -f docker-compose.yaml -f docker-compose.database.yaml -p $(PROJECT) down ${SERVICE}

restart:
	docker-compose -p ${PROJECT} restart ${SERVICE}

clean: 
	docker-compose -p $(PROJECT) down --remove-orphans -v

%:
	@echo "Done"