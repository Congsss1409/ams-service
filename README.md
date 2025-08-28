School Management System III - Accreditation Management System (AMS)
About The Project
The Accreditation Management System (AMS) is a comprehensive web application designed to streamline the accreditation process for educational institutions. It provides a centralized platform for managing academic programs, organizing accreditation documents, monitoring compliance with standards, and scheduling important events like internal audits and accreditor visits.

This system is built as a capstone project to demonstrate a robust, scalable, and user-friendly solution for modern academic management.

Key Features
Dashboard: An at-a-glance overview of the compliance status of all academic programs.

Program Management: Add, edit, and manage all academic programs undergoing accreditation.

Document Repository: A centralized and organized storage for all accreditation-related documents, categorized by section.

Compliance Matrix: Track and verify compliance for each program against a predefined set of accreditation criteria.

Internal Audit Scheduler: Plan and manage the schedule for internal audits.

Accreditor Visit Management: Log and track scheduled visits from external accreditors.

User Management: Manage user accounts and their access to the system.

Built With
Backend: Laravel

Frontend: React (with Vite)

Database: MySQL

Styling: React Bootstrap & Bootstrap Icons

Getting Started (XAMPP Environment)
This guide will walk you through setting up the project on your local machine using XAMPP.

Prerequisites
Before you begin, ensure you have the following software installed on your computer:

XAMPP: Provides Apache, MySQL, and PHP.

Composer: A dependency manager for PHP.

Node.js: A JavaScript runtime environment (v18 or higher recommended).

Installation
Follow these steps to get your development environment running.

1. Set Up the Laravel Backend
First, we will configure and set up the backend application.

Place Project in htdocs Move the entire project folder into your XAMPP htdocs directory (e.g., C:/xampp/htdocs/ams-service).

Create the Database

Start the Apache and MySQL services from the XAMPP Control Panel.

Open phpMyAdmin by clicking the Admin button next to MySQL.

Create a new database and name it ams_db.

Configure Environment File

In the project root, create a copy of the .env.example file and rename it to .env.

Open the .env file and update the database credentials. The password for the root user in XAMPP is typically empty.

Code snippet

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ams_db
DB_USERNAME=root
DB_PASSWORD=

# Ensure this is set for the frontend
CORS_ALLOWED_ORIGINS=http://localhost:5173
Install Dependencies & Prepare App

Open a terminal and navigate to the project's root directory:

Bash

cd C:/xampp/htdocs/ams-service
Run the following commands one by one:

Bash

# Install PHP dependencies
composer install

# Generate a unique application key
php artisan key:generate

# Run database migrations and seed the database with default data
php artisan migrate:fresh --seed

# Create the symbolic link for file storage
php artisan storage:link
2. Set Up the React Frontend
Now, let's get the user interface running. You will need a second, separate terminal for this part.

Navigate to the ui Directory

Open a new terminal and navigate into the ui folder:

Bash

cd C:/xampp/htdocs/ams-service/ui
Install Frontend Dependencies

Run the following command to install all the necessary JavaScript packages:

Bash

npm install
Running the Application
To run the application, you need to start both the backend and frontend servers.

Start the Laravel Backend Server

In your first terminal (at the project root), run:

Bash

php artisan serve
This will start the backend API server, usually at http://localhost:8000.

Start the React Frontend Server

In your second terminal (inside the ui directory), run:

Bash

npm run dev
This will start the frontend development server, usually at http://localhost:5173.

Accessing the Application
Your Accreditation Management System is now running!

Open your browser and go to: http://localhost:5173

Login with the default administrator credentials:

Email: admin@example.com

Password: password

You must keep both terminal windows open to continue running the application.
