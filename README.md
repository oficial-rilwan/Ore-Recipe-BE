# Project Documentation

## Overview

# [Ore Recipe](https://ore-recipe.onrender.com/)

This project is a fullstack application structured using controllers, routes, middleware, repository patterns, models, and validation layers.

## Folder Structure

```
├── controllers
│   ├── app.controller.ts
│   ├── users.controller.ts
│   ├── recipe.controller.ts
│   ├── restaurant.controller.ts
│
├── routes
│   ├── app.routes.ts
│   ├── users.routes.ts
│   ├── recipe.routes.ts
│   ├── restaurant.routes.ts
│
├── middleware
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│
├── repository
│   ├── user.repository.ts
│   ├── recipe.repository.ts
│   ├── restaurant.repository.ts
│
├── models
│   ├── user.model.ts
│   ├── recipe.model.ts
│   ├── restaurant.model.ts
│
├── database
│   ├── config.ts
│   ├── connection.ts
│
├── validations
│   ├── user.validation.ts
│   ├── recipe.validation.ts
│   ├── restaurant.validation.ts
│
├── app.ts
└── server.ts
```

## Controllers

Controllers handle request logic and interact with services or repositories.

- **`app.controller.ts`** - Main application controller.
- **`users.controller.ts`** - Manages user-related actions (authentication, profile, etc.).
- **`recipe.controller.ts`** - Handles recipe-related actions (CRUD operations).
- **`restaurant.controller.ts`** - Manages restaurant-related operations.

## Routes

Routes define API endpoints and map them to controller methods.

- **`app.routes.ts`** - General application routes.
- **`users.routes.ts`** - User authentication and management routes.
- **`recipe.routes.ts`** - Recipe CRUD routes.
- **`restaurant.routes.ts`** - Restaurant management routes.

## Middleware

Middleware functions for handling authentication, error handling, and other request processing logic.

- **`auth.middleware.ts`** - Handles authentication and authorization.
- **`error.middleware.ts`** - Catches and handles errors globally.

## Repository

Repositories provide a data abstraction layer, interfacing with the database.

- **`user.repository.ts`** - Database operations related to users.
- **`recipe.repository.ts`** - Handles CRUD operations for recipes.
- **`restaurant.repository.ts`** - Manages restaurant database interactions.

## Models

Defines database schemas and models for ORM (e.g., Sequelize, Mongoose, or Prisma).

- **`user.model.ts`** - Defines the user schema.
- **`recipe.model.ts`** - Defines the recipe schema.
- **`restaurant.model.ts`** - Defines the restaurant schema.

## Database Configuration

Manages database connection and configuration.

- **`config.ts`** - Database configuration settings.
- **`connection.ts`** - Handles database connection setup.

## Validations

Ensures data integrity and request validation.

- **`user.validation.ts`** - Validates user input (registration, login, profile updates).
- **`recipe.validation.ts`** - Validates recipe data.
- **`restaurant.validation.ts`** - Validates restaurant details.

## Setup & Installation

### Prerequisites

- Node.js & npm/yarn installed.
- Database setup (MongoDB.).

### Installation Steps

```sh
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start the server
npm run dev
```

## API Endpoints

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| GET    | `/api/users`          | Fetch all users     |
| GET    | `/api/users/:name`    | Fetch user by name  |
| POST   | `/api/users/register` | Register a new user |
| POST   | `/api/users/login`    | Authenticate user   |
| GET    | `/api/recipes`        | Get all recipes     |
| POST   | `/api/recipes`        | Create a new recipe |
| GET    | `/api/restaurants`    | Get all restaurants |

## License

This project is licensed under the [MIT License](LICENSE).
