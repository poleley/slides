default: pull start

pull:
	git pull --rebase

start:
	docker compose build
	docker compose down
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f
