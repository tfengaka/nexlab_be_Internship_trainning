PROJECT=nexlab_be_w1

up: 
	docker-compose -p $(PROJECT) up -d

down: 
	docker-compose -p $(PROJECT) down

restart:
	docker-compose -p ${PROJECT} restart

%:
	@echo "Done"
