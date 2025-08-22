# School Management System III - Accreditation Module

A comprehensive, web-based School Management System designed to modernize and streamline the core operations of an educational institution, with a primary focus on managing the complex process of accreditation. This system features a predictive compliance gap analysis to provide actionable insights for school leadership.

---

## 📖 About The Project

This repository contains the central **Accreditation Management System (AMS)** for the School Management System III capstone project. Developed as a stand-alone microservice, its primary role is to act as the "brain" of the entire system, capable of integrating with other operational modules to provide a centralized hub for accreditation document management, compliance tracking, and high-level analytics.

This project was built by 4th-year IT students to solve the real-world challenge of preparing for school accreditation, based on the processes of Bestlink College of the Philippines.

![Dashboard Screenshot][![image.png](https://i.postimg.cc/L4GTYh0G/image.png)](https://postimg.cc/z3SW4DNk)


### ✨ Features

This system is feature-complete with all the core modules required for accreditation management:

* **Secure Authentication & User Management:** A complete login system using Laravel Sanctum, with a full CRUD interface for administrators to manage user accounts.
* **Dynamic Dashboard & Predictive Gap Analysis:** An interactive dashboard that provides a high-level overview of the compliance status for all academic programs, predicting which are "On Track," "Need Attention," or are "At Risk."
* **Program Management:** A full CRUD interface to manage academic programs and their current accreditation levels.
* **Centralized Document Repository:** Functionality for uploading, viewing, and managing accreditation documents, organized by program and the 9 required accreditation sections.
* **Compliance Matrix:** A dynamic matrix that tracks the completion status of required documents against predefined accreditation criteria for any selected program.
* **Modern UI/UX:** A professional and responsive user interface built with React and Bootstrap, featuring a collapsible sidebar and interactive alerts with SweetAlert2.

---

## 🛠️ Built With

This project is built on a modern, robust technology stack, containerized for consistency and ease of development.

* **Backend:** PHP / Laravel
* **Frontend:** JavaScript / React.js
* **Database:** MySQL
* **Styling:** Bootstrap / React Bootstrap
* **Containerization:** Docker & Docker Compose

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You will need the following software installed on your machine:
* [Git](https://git-scm.com/)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Installation & Setup

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/your-username/ams-service.git](https://github.com/your-username/ams-service.git)
    cd ams-service
    ```
2.  **Create your environment file**
    ```sh
    cp .env.example .env
    ```
3.  **Install Frontend Dependencies**
    ```sh
    cd ui
    npm install
    cd ..
    ```
4.  **Build and Run the Docker Containers**
    ```sh
    docker-compose up -d --build
    ```
5.  **Install Backend Dependencies** (using the dedicated composer container)
    ```sh
    docker-compose run --rm composer install
    ```
6.  **Generate Application Key**
    ```sh
    docker-compose exec app php artisan key:generate
    ```
7.  **Run Database Migrations & Seeding**
    ```sh
    docker-compose exec app php artisan migrate:fresh --seed
    ```
8.  **Start the Frontend Development Server** (in a new terminal)
    ```sh
    cd ui
    npm run dev
    ```

Your application should now be running!
* **Backend API:** `http://localhost:8000`
* **Frontend UI:** `http://localhost:5173`
* **Default Admin Login:** `admin@example.com` / `password`

---
## 🗺️ System Architecture

Our School Management System is built on a microservices architecture. This `ams-service` acts as the central accreditation and reporting hub, designed to communicate with other modules (like Faculty Management, SIS, etc.) via a robust API. This separation of concerns allows for modular development and scalability.
