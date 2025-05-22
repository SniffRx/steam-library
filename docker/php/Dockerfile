FROM php:8.3-fpm-alpine

# Установка системных зависимостей
RUN apk add --no-cache \
    git curl zip unzip libzip-dev libpng-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql zip bcmath

# Установка Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Рабочая директория
WORKDIR /var/www

# Копируем всё
COPY . .

# Установка зависимостей Laravel
RUN composer install --no-dev --optimize-autoloader \
    && php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache
