# School Management System III - Accreditation Module



A comprehensive, web-based School Management System designed to modernize and streamline the core operations of an educational institution, with a primary focus on managing the complex process of accreditation.

---

## 📖 About The Project

This repository contains the central **Accreditation Management System (AMS)** and **Executive Information System (EIS)** for the School Management System III capstone project. Developed as a stand-alone microservice, its primary role is to act as the "brain" of the entire system, gathering data from nine other operational modules to provide a centralized hub for accreditation document management, compliance tracking, and high-level analytics for school leadership.

This project was built by 4th-year IT students to solve the real-world challenge of preparing for school accreditation, based on the processes of Bestlink College of the Philippines.

![Login Page Screenshot]([![image.png](https://i.postimg.cc/sXGYxXTm/image.png)](https://postimg.cc/xJYJF0DN))

### ✨ Features

* **Secure Authentication:** A complete login and registration system using Laravel Sanctum.
* **Program Management:** A full CRUD interface to manage academic programs and their accreditation levels.
* **Document Repository:** Functionality for uploading, viewing, and managing accreditation documents for each program.
* **Dynamic Dashboard:** An interactive dashboard built with React.js, featuring a collapsible sidebar, a live-updating clock, and a user profile section.
* **Modern UI/UX:** A professional and responsive user interface built with Bootstrap and styled with custom themes, including interactive alerts with SweetAlert2.

---

## 🛠️ Built With

This project is built on a modern, robust technology stack, containerized for consistency and ease of development.

* **Backend:** PHP / Laravel
* **Frontend:** JavaScript / React.js
* **Database:** MySQL
* **Styling:** Bootstrap / React Bootstrap
* **Containerization:** Docker & Docker Compose
* **API Client:** Postman

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You will need the following software installed on your machine:
* [Git](https://git-scm.com/)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* [Composer](https://getcomposer.org/)
* [Node.js & npm](https://nodejs.org/)

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
5.  **Run Database Migrations & Seeding**
    ```sh
    docker-compose exec app php artisan migrate:fresh --seed
    ```
6.  **Start the Frontend Development Server** (in a new terminal)
    ```sh
    cd ui
    npm run dev
    ```

Your application should now be running!
* **Backend API:** `http://localhost:8000`
* **Frontend UI:** `http://localhost:5173`

---
## 🗺️ System Architecture

Our School Management System is built on a microservices architecture, with 10 independent services that communicate via APIs. This `ams-service` acts as the central reporting and management hub.

![Dashboard Screenshot](https://i.imgur.com/your-dashboard-screenshot-id.png)
