# Tillio

## Description

**Tillio** is a robust backend API built using **Node.js**, **TypeScript**, and **Express.js**, following **Clean Architecture** principles. It is designed to manage user authentication, image uploads, and transactional operations efficiently. The project emphasizes scalability, security, and maintainability by leveraging modern libraries like **JWT**, **MongoDB**, **Zod**, and more.

---

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)

---

## Installation

### Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/alviinaditya/tillio-backend.git
   cd tillio-backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory and configure it as per the [Environment Variables](#environment-variables) section.

4. **Run the Application**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5000`.

---

## Features

- **Authentication & Authorization**

  - Register, Login, Logout
  - Email verification
  - Forgot and Reset Password
  - JWT-based secure authentication with refresh tokens

- **User Management**

  - Fetch users
  - Role-based access control (RBAC)

- **More Features Coming Soon!**

- **Robust Architecture**

  - Clean separation of concerns:
    - **Data Layer**: Repositories and MongoDB Models
    - **Domain Layer**: Entities, Interfaces, and Use Cases
    - **Presentation Layer**: Controllers, Routes, and Middlewares

- **Error Handling**

  - Centralized error handling with custom error classes

- **Logging**
  - Advanced logging using **Winston**

---

## Folder Structure

The project follows a **Clean Architecture** model:

```
src
 ┣ config/            # Configuration files (DB, environment)
 ┣ data/              # Data layer (models and repository implementations)
 ┣ di/                # Dependency injection container
 ┣ domain/            # Core domain layer (entities, interfaces, use cases)
 ┣ presentation/      # Presentation layer (controllers, middlewares, routes)
 ┣ shared/            # Shared utilities, constants, and providers
 ┗ index.ts           # Entry point
```

Refer to the detailed [folder structure](#) for more information.

---

## Environment Variables

The following environment variables are required:

| Variable             | Description                   |
| -------------------- | ----------------------------- |
| `PORT`               | Port number for the server    |
| `CLIENT_URL`         | Client URL for frontend       |
| `MONGO_URI`          | MongoDB connection string     |
| `JWT_SECRET`         | Secret key for JWT            |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens |
| `EMAIL_SERVICE`      | SMTP service for email        |
| `EMAIL_USER`         | SMTP username                 |
| `EMAIL_PASSWORD`     | SMTP password                 |

---

## Usage

### Running in Development Mode

```bash
npm run dev
```

### Running in Production

```bash
npm run build
npm start
```

### Testing

Coming soon!

---

## Technologies Used

- **Node.js** and **Express.js**
- **TypeScript**
- **MongoDB** and **Mongoose**
- **JWT** for authentication
- **Bcrypt.js** for password hashing
- **Nodemailer** for email services
- **Winston** for logging
- **Zod** for validation

---

## Contributing

Contributions are welcome! Please follow the [CONTRIBUTING.md](CONTRIBUTING.md) guidelines.

---
