# Dockerfile
FROM composer:2 as vendor
WORKDIR /app
COPY . .
# Add --no-scripts flag to prevent errors during build
RUN composer install --no-dev --no-interaction --optimize-autoloader --no-scripts

FROM node:18 as node_assets
WORKDIR /app
COPY . .
COPY --from=vendor /app/vendor /app/vendor
RUN npm install && npm run build

FROM php:8.2-fpm-alpine
WORKDIR /app
RUN docker-php-ext-install pdo pdo_mysql
COPY . .
COPY --from=vendor /app/vendor /app/vendor
COPY --from=node_assets /app/public/build /app/public/build
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache
RUN chmod -R 775 /app/storage /app/bootstrap/cache
EXPOSE 9000
CMD ["php-fpm"]
