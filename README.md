# Car Parts Project

A comprehensive web application for managing car parts, built with a modern Java Spring Boot backend and an Angular frontend.

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot 4.0.0
- **Language**: Java 17
- **Database**: MySQL 8.0
- **Security**: Spring Security with JWT Authentication
- **Documentation**: SpringDoc OpenAPI (Swagger UI)
- **Build Tool**: Maven

### Frontend
- **Framework**: Angular 20
- **Styling**: Bootstrap 5
- **Runtime**: Node.js

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed:
- [Java Development Kit (JDK) 17](https://www.oracle.com/java/technologies/downloads/#java17)
- [Node.js](https://nodejs.org/) (LTS recommended)
- [MySQL Server](https://dev.mysql.com/downloads/installer/)

### 🔧 Backend Setup

1.  **Database Configuration**:
    - Ensure your MySQL server is running on port `3306`.
    - The application expects a database named `carParts` with `root` user and empty password by default.
    - You can modify these settings in `backend/car-parts/src/main/resources/application.properties`.

2.  **Run the Application**:
    Navigate to the backend directory and run:
    ```bash
    cd backend/car-parts
    ./mvnw spring-boot:run
    ```
    The backend server will start at `http://localhost:8088`.
    Swagger UI documentation is available at `http://localhost:8088/swagger-ui.html`.

### 💻 Frontend Setup

1.  **Install Dependencies**:
    Navigate to the frontend directory:
    ```bash
    cd frontend/car-parts-frontend
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm start
    ```
    Navigate to `http://localhost:8081/`. The application will automatically reload if you change any of the source files.

## 📁 Project Structure

```
Zorraga/
├── backend/
│   └── car-parts/           # Spring Boot Backend source
├── frontend/
│   └── car-parts-frontend/  # Angular Frontend source
└── README.md                # Project Documentation
```