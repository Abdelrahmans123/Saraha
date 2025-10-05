# Messaging Platform RESTful API

## Overview

This project is a modular RESTful API built with Node.js, Express.js, and MongoDB. It supports user authentication, user management, and real-time-style messaging features with a clean and maintainable codebase.

## Features

### User Authentication

* Register, login, and JWT-protected routes

### User Management

* Profile updates and role-based permissions (optional)

* Add, retrieve, and manage comments on posts

### Messaging:

* Send and retrieve messages
* Upload message attachments

### Clean Architecture:

Modular routing and controller-based structure for maintainability

* Modular routing and controller-based structure for maintainability

## Technologies Used

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (via Mongoose)
* **Authentication:** JWT (JSON Web Tokens)
* **API Architecture:** RESTful

## Installation

### Clone the repository

```bash
git clone https://github.com/Abdelrahmans123/Saraha.git
```

### Install dependencies

```bash
npm install
```

### Set up environment variables

Create a `.env` file in the root directory and configure the following:

```env
APP_NAME=YourAppName
PORT=3000
MONGODB_URI=your-mongodb-uri
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
APP_PASSWORD=your-app-password
APP_EMAIL=your-app-email
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### Run the server

```bash
npm run start
```

### Access API at

```
http://localhost:3000/api
```

## API Endpoints

### Auth

* **POST** /api/auth/register – Register a new user
* **POST** /api/auth/login – Login and receive a JWT
* **POST** /api/auth/logout – Logout user
* **PATCH** /api/auth/confirm-email – Confirm user email
* **POST** /api/auth/forgot-password – Request password reset
* **PATCH** /api/auth/reset-password – Reset password

### Users

* **GET** /api/users – Get all users
* **GET** /api/users/:id – Get user by ID
* **PATCH** /api/users – Update user details
* **DELETE** /api/users/freeze-account/:id – Freeze a user account
* **PATCH** /api/users/restore-account/:id – Restore a user account (admin only)
* **DELETE** /api/users/delete-account/:id – Delete a user account (admin only)
* **PATCH** /api/users/upload/:id – Upload profile picture
* **PATCH** /api/users/delete-image/:id – Delete user profile image

### Messages

* **POST** /api/messages/:id/sender – Send message as sender with attachments
* **POST** /api/messages/:id – Send message with attachments
* **DELETE** /api/messages/:id – Delete a message
* **GET** /api/messages/:id – Get message by ID
* **PATCH** /api/messages/freeze-message/:id – Freeze a message
* **GET** /api/messages – Get all messages

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License.

## Support

For support or inquiries, please contact **[sabdelrahman110@gmail.com](mailto:sabdelrahman110@gmail.com)**.
