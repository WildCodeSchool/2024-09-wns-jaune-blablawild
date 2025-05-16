BUILD = docker compose -f compose.prod.yaml --env-file .env.prod up -d
DEV =  docker compose -f compose.dev.yaml --env-file .env.dev up -d
CLEAN = docker system prune -af --volumes  
TEST = docker compose -f compose.e2e.yaml --env-file .env.test up -d
STOP = docker stop $(shell docker ps -a -q)

build:
	$(BUILD)

clean:
	$(CLEAN)

stop:
	$(STOP)

dev:
	$(DEV)

test: 
	$(TEST)