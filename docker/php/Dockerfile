FROM php:8.3-fpm-alpine

# Установка системных зависимостей, включая postgresql-dev
RUN apk add --no-cache \
    git curl zip unzip libzip-dev libpng-dev libxml2-dev postgresql-dev \
    && docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql pgsql zip bcmath

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

# Открываем порт 80 для веб-сервера
EXPOSE 9000

# Запускаем supervisord для управления php-fpm и nginx
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
