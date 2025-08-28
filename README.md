<div align="center">
  <img src="https://i.postimg.cc/sXGYxXTm/image.png" alt="School Logo" width="150"/>
  <h1>School Management System III</h1>
  <h2>🎓 Accreditation Management System (AMS) 🎓</h2>
  <p>
    A comprehensive, web-based platform designed to modernize and streamline the complex process of school accreditation. Built with Laravel and React.
  </p>
</div>

---

### 🚀 About The Project

Welcome to the **Accreditation Management System (AMS)**, the central hub of our capstone project, the School Management System III. We developed this system to solve the real-world challenges of preparing for school accreditation, inspired by the processes at Bestlink College of the Philippines.

Our system provides a powerful suite of tools for school administrators to manage documents, track compliance against standards, and gain actionable insights through a predictive gap analysis dashboard.

### ✨ Core Features

| Feature                  | Description                                                                                              | Icon                        |
| ------------------------ | -------------------------------------------------------------------------------------------------------- | --------------------------- |
| **Dynamic Dashboard** | Get a high-level overview of compliance status across all academic programs with predictive analytics.   | 📊                          |
| **Program Management** | A full CRUD interface to manage academic programs and their current accreditation levels.                | 📚                          |
| **Document Repository** | Upload, view, and manage accreditation documents, organized by program and the 9 required sections.      | 📂                          |
| **Compliance Matrix** | Dynamically track the completion status of required documents against predefined criteria.               | ✅                          |
| **Audit & Visit Scheduling** | Plan, schedule, and manage internal audits and visits from external accreditors.                         | 📅                          |
| **User Management** | Securely manage user accounts and profiles with a complete authentication system via Laravel Sanctum.      | 👥                          |

### 🛠️ Tech Stack

This project is built with a modern, robust, and scalable technology stack.

| Area      | Technology                                                                                                                                                                                                                                                                                                                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Backend** | <img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel"/> <img src="https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP"/>                                                                                                                                                             |
| **Frontend** | <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/> <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/> <img src="https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap"/>                                 |
| **Database** | <img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>                                                                                                                                                                                                                                                                               |

---

## 🚀 Getting Started (XAMPP Local Setup)

This guide will walk you through setting up the project on your local machine using **XAMPP**.

### Prerequisites

Make sure you have the following software installed before you begin:

* **[XAMPP](https://www.apachefriends.org/index.html):** Provides your Apache server, MySQL database, and PHP environment.
* **[Composer](https://getcomposer.org/):** The dependency manager for PHP.
* **[Node.js](https://nodejs.org/):** The JavaScript runtime needed for the React frontend (v18+ recommended).

### Installation Guide

Follow these steps carefully to get your development environment up and running.

#### ⚙️ Part 1: Configure the Backend (Laravel)

1.  **Place Project Files**
    * Move the entire `ams-service` project folder into your XAMPP `htdocs` directory (e.g., `C:/xampp/htdocs/ams-service`).

2.  **Create the Database**
    * Start the **Apache** and **MySQL** services from the XAMPP Control Panel.
    * Open phpMyAdmin (click `Admin` next to MySQL).
    * Create a new, empty database and name it `ams_db`.

3.  **Set Up Environment Variables**
    * In the project root, find the `.env.example` file and create a copy named `.env`.
    * Open the new `.env` file and update the database section to match your XAMPP setup (the password is usually blank).

    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=ams_db
    DB_USERNAME=root
    DB_PASSWORD=

    CORS_ALLOWED_ORIGINS=http://localhost:5173
    ```

4.  **Install Dependencies & Prepare the App**
    * Open a terminal and navigate to your project's root directory:
        ```bash
        cd C:/xampp/htdocs/ams-service
        ```
    * Run these commands one by one to install dependencies and set up the application:
        ```bash
        # Install all required PHP packages
        composer install

        # Generate a unique application key
        php artisan key:generate

        # Create the database tables and fill them with initial data
        php artisan migrate:fresh --seed

        # Link the public storage directory
        php artisan storage:link
        ```

#### 🎨 Part 2: Configure the Frontend (React)

You'll need a **second, separate terminal** for these steps.

1.  **Navigate to the `ui` Directory**
    * Open a new terminal and navigate into the `ui` sub-directory:
        ```bash
        cd C:/xampp/htdocs/ams-service/ui
        ```

2.  **Install Frontend Dependencies**
    * Run the following command to install all the necessary JavaScript packages:
        ```bash
        npm install
        ```

### ▶️ Running the Application

To run the system, you need to start both the backend and frontend servers.

1.  **Start the Backend Server**
    * In your **first terminal** (at the project root), run:
        ```bash
        php artisan serve
        ```
    * This will start the Laravel API, usually on `http://localhost:8000`.

2.  **Start the Frontend Server**
    * In your **second terminal** (inside the `ui` directory), run:
        ```bash
        npm run dev
        ```
    * This will start the React application, usually on `http://localhost:5173`.

### ✅ Accessing the Application

Your Accreditation Management System is now live on your local machine!

* **Open your browser** and go to: **[http://localhost:5173](http://localhost:5173)**
* **Login** with the default administrator account:
    * **Email:** `admin@example.com`
    * **Password:** `password`

> **Note:** You must keep both terminal windows open while using the application. Happy coding!
