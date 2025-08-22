# School Management System III - Accreditation Management System

As a team of 4th-year IT students, we developed this comprehensive, web-based School Management System to modernize and streamline the core operations of an educational institution. Our primary focus was to tackle the complex process of accreditation, and we've built-in a PREDICTIVE GAP COMPLIANCE ANALYSIS feature to provide real, actionable insights for school leadership.

---

## 📖 About Our Project

In this repository, you'll find the central **Accreditation Management System (AMS)** that we created for our capstone project, the School Management System III. We designed it as a stand-alone microservice to act as the "brain" of the entire system. It's capable of integrating with nine other operational modules, providing a centralized hub for managing accreditation documents, tracking compliance, and performing high-level analytics.

We built this project to solve the real-world challenges of preparing for school accreditation, basing our work on the actual processes of Bestlink College of the Philippines.

![Dashboard Screenshot][![image.png](https://i.postimg.cc/L4GTYh0G/image.png)](https://postimg.cc/z3SW4DNk)

### ✨ What We've Built (Features)

Our system is feature-complete with all the core modules we planned for accreditation management:

* **Secure Authentication & User Management:** We implemented a complete login system using Laravel Sanctum, along with a full CRUD interface for administrators to manage user accounts.
* **Dynamic Dashboard & Predictive Gap Analysis:** We created an interactive dashboard that gives a high-level overview of the compliance status for all academic programs, predicting which are "On Track," "Need Attention," or are "At Risk."
* **Program Management:** We built a full CRUD interface to manage academic programs and their current accreditation levels.
* **Centralized Document Repository:** Our system allows for uploading, viewing, and managing accreditation documents, all organized by program and the 9 required accreditation sections.
* **Compliance Matrix:** We developed a dynamic matrix that tracks the completion status of required documents against the predefined accreditation criteria for any selected program.
* **Modern UI/UX:** We designed a professional and responsive user interface with React and Bootstrap, which includes a collapsible sidebar and interactive alerts using SweetAlert2.

---

## 🛠️ The Tech We Used

We built our project using a modern, robust technology stack and containerized it with Docker for consistency and ease of development.

* **Backend:** PHP / Laravel
* **Frontend:** JavaScript / React.js
* **Database:** MySQL
* **Styling:** Bootstrap / React Bootstrap
* **Containerization:** Docker & Docker Compose

---

## 🚀 Getting Started

To get a local copy of our project up and running, just follow these simple steps.

### Prerequisites

You'll need the following software installed on your machine:
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
5.  **Install Backend Dependencies** (using our dedicated composer container)
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

Our application should now be running!
* **Backend API:** `http://localhost:8000`
* **Frontend UI:** `http://localhost:5173`
* **Default Admin Login:** `admin@example.com` / `password`

---
## 🗺️ Our System Architecture

We designed our School Management System using a microservices architecture. This `ams-service` acts as the central hub for accreditation and reporting. We built it to communicate with other modules (like Faculty Management, SIS, etc.) through a robust API, a design choice that allows for modular development and makes the whole system easier to scale.
