#!/bin/sh

# This is the entry point for the Docker container.
# It runs database migrations and then starts the necessary services.

echo "Running database migrations..."
php artisan migrate --force

echo "Starting PHP-FPM and Nginx..."
php-fpm &
nginx -g 'daemon off;'
