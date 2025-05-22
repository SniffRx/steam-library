.PHONY: install build up down keygen migrate logs build-image

# Установка npm-зависимостей и сборка React фронтенда
install:
	npm install

build:
	npm run build

# Запуск docker контейнеров с билдом
up:
	docker compose up -d --build

# Остановка и удаление контейнеров
down:
	docker compose down

# Генерация APP_KEY Laravel
keygen:
	docker compose exec app php artisan key:generate

# Запуск миграций базы данных
migrate:
	docker compose exec app php artisan migrate

# Просмотр логов Laravel контейнера
logs:
	docker compose logs -f app

# Собрать Docker-образ без кеша с тегом steam-library:0.0.1
build-image:
	docker build --no-cache -t steam-library:0.0.1 -f docker/php/Dockerfile .
