# Stage 1: Build PHP with necessary extensions
FROM php:8.2-fpm as php_build
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    curl \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql bcmath mbstring exif pcntl bcmath simplexml

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Stage 2: Build the application
FROM php_build as app_build
WORKDIR /app

# Copy application files
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache
RUN chmod -R 775 /app/storage /app/bootstrap/cache

# Stage 3: Final production image with Nginx
FROM nginx:alpine
WORKDIR /app

# Copy Nginx config
COPY ./docker/prod/nginx.conf /etc/nginx/conf.d/default.conf

# Copy application files from the build stage
COPY --from=app_build /app .

# Expose port 80 for Nginx
EXPOSE 80

# Copy the start script and make it executable
COPY start.sh /start.sh
RUN chmod +x /start.sh

# The command to run when the container starts
CMD ["/start.sh"]
