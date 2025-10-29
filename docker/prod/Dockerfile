# ⚙️ Stage 1 — Build frontend (Vite + React)
FROM node:20-alpine AS frontend

WORKDIR /app

# Копируем package.json
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Копируем ВСЕ необходимые файлы для сборки
COPY resources ./resources
COPY public ./public
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./

# Собираем
RUN npm run build

# ВАЖНО: Копируем manifest в корень
RUN cp /app/public/build/.vite/manifest.json /app/public/build/manifest.json || true

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
    postgresql-dev

# Установка PHP расширений, включая PostgreSQL
RUN docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip intl opcache mbstring exif

# Установка Redis расширения
RUN apk add --no-cache pcre-dev $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del pcre-dev $PHPIZE_DEPS

# Настройка PHP-FPM
RUN sed -i 's|^listen = .*|listen = 0.0.0.0:9000|' /usr/local/etc/php-fpm.d/www.conf

# Установка Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Кэширование зависимостей Composer
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Копируем весь исходный код Laravel
COPY . .

# Копируем скомпилированный фронтенд билд
COPY --from=frontend /app/public/build /var/www/public/build

# Проверяем что manifest.json скопирован
RUN ls -la /var/www/public/build/manifest.json || echo "WARNING: manifest.json not found!"

# Установка прав на каталоги
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/public \
    && chmod -R 755 /var/www/storage /var/www/bootstrap/cache /var/www/public

# Копируем конфигурации
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf
COPY docker/prod/supervisord.conf /etc/supervisord.conf

# Запуск кэширования конфигурации (ПОСЛЕ копирования билда!)
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Открываем порт 80
EXPOSE 80

# Запускаем supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
