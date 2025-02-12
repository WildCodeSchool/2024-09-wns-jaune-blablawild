BUILD =  docker compose -f compose.dev.yaml --env-file .env.dev up -d
CLEAN = docker system prune -af --volumes  
STOP = docker stop database gateway visualizer frontend backend

build:
	$(BUILD)

clean:
	$(CLEAN)

stop:
	$(STOP)