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

# Установка системных зависимостей
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
    postgresql-dev \
    nodejs \
    npm

# Установка PHP расширений, включая PostgreSQL
RUN docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip intl opcache mbstring exif

RUN sed -i 's|^listen = .*|listen = 0.0.0.0:9000|' /usr/local/etc/php-fpm.d/www.conf

# Установка Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Кэширование зависимостей Composer (копируем только composer.json и lock)
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Копируем весь исходный код Laravel
COPY . .

# Запуск кэширования конфигурации, маршрутов и представлений Laravel
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Копируем скомпилированный фронтенд билд из предыдущей стадии
COPY --from=frontend /app/public/build /var/www/public/build

# Установка прав на каталоги storage и bootstrap/cache
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 755 /var/www/storage /var/www/bootstrap/cache

# Копируем конфигурации Nginx и Supervisord
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf
COPY docker/prod/supervisord.conf /etc/supervisord.conf

# Открываем порт 80 для веб-сервера
EXPOSE 80

# Запускаем supervisord для управления php-fpm и nginx
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
