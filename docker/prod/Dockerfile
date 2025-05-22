# ⚙️ Stage 1 — Build frontend (Vite + React)
FROM node:20-alpine AS frontend

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY resources resources
COPY vite.config.* ./
COPY public public

RUN npm run build


# ⚙️ Stage 2 — Prepare Laravel app with PHP & Composer
FROM php:8.3-fpm-alpine AS backend

# Установим зависимости
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    bash \
    git \
    unzip \
    libzip-dev \
    icu-dev \
    oniguruma-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    nodejs \
    npm

# PHP extensions
RUN docker-php-ext-install pdo pdo_mysql zip intl opcache mbstring exif

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Копируем Laravel backend
COPY . .

# Установка зависимостей Laravel
RUN composer install --no-dev --optimize-autoloader

# Копируем билд фронта из предыдущего stage
COPY --from=frontend /app/dist /var/www/html/public/build

# Права
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html/storage

# Nginx конфиг
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf

# Supervisor config (одновременный запуск nginx и php-fpm)
COPY docker/prod/supervisord.conf /etc/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
