# Laravel 12 + React (Vite) — Production Docker Setup 🐳

Этот репозиторий содержит production-настройку Docker для Laravel 12 + React (Vite) проекта **без SSR**. Подходит для быстрого запуска как в **Linux**, так и в **Windows**-среде.

## 📦 Возможности

- Laravel 12 + React (через Vite)
- DragonflyDB в качестве Redis-замены
- PostgreSQL (можно заменить на MySQL при необходимости)
- Nginx + PHP-FPM
- Готово для продакшена
- `docker-compose.yml` — как пример запуска **без Kubernetes**

## 🚀 Быстрый старт

### 1. Клонируй репозиторий

```bash
git clone https://github.com/your-user/your-repo.git
cd your-repo
```

### 2. Скопируй переменные окружения

```bash
cp .env.example .env
```
> Отредактируй .env по необходимости (например, APP_NAME, DB_\*, REDIS_*).

### 3. Установи зависимости и собери фронтенд

```bash
npm install
npm run build
```
> ⚠️ Этот шаг нужен, чтобы собрать React-фронт в public/build.

### 4. Запусти контейнеры

```bash
docker compose up -d --build
```

### 5. Сгенерируй ключ Laravel

```bash
docker compose exec app php artisan key:generate
```

## Так же можно использовать Makefile

### Как использовать:
- **make install** — установить npm-пакеты
- **make build** — собрать фронтенд (React)
- **make up** — собрать и запустить контейнеры в фоне
- **make down** — остановить и удалить контейнеры
- **make keygen** — сгенерировать Laravel APP_KEY
- **make migrate** — выполнить миграции базы
- **make logs** — смотреть логи Laravel-приложения в реальном времени
