# Node.js Starter Project

This is a starter project for building a Node.js application with features like logging, MongoDB database setup, user authentication, token generation, password management, email sending, role-based authorization, and error handling.

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/your-username/nodejs-starter-project.git
   ```

2. Install dependencies:

   ```
   cd nodejs-starter-project
   npm install
   ```

3. Set up the environment variables:

   Create a `.env` file in the root directory and define the following variables:

   ```
    DB_HOST=<DB_HOST>
    DB_PORT=<DB_PORT>
    DB_USERNAME=<DB_USERNAME>
    DB_PASSWORD=<DB_PASSWORD>
    DB_NAME=<DB_NAME>
    SECRET_KEY=<SECRET_KEY>
    ACCESS_TOKEN_EXPIRATION=<ACCESS_TOKEN_EXPIRATION>
    REFRESH_TOKEN_EXPIRATION=<REFRESH_TOKEN_EXPIRATION>
    EMAIL_ID=<EMAIL_ID>
    EMAIL_PASSWORD=<EMAIL_PASSWORD>
    PASSWORD_RESET_TOKEN_EXPIRATION=<PASSWORD_RESET_TOKEN_EXPIRATION>
   ```

4. Start the server:

   ```
   npm start
   ```

## Features

- **Logging:** The project uses Winston for logging. Logs are stored in separate files based on log levels.

- **MongoDB Database Setup:** The project integrates with MongoDB to store user data. Database configuration is handled using Mongoose.

- **User Model and Controller:** The application includes a user model and controllers for user registration, login, token generation, password change, and password reset.

- **Email Sending Feature:** Nodemailer is used to send emails. It's configured to send password reset and verification emails.

- **Role-Based Authorization:** The project includes role-based authorization using middleware. You can define roles and restrict access to certain routes.

- **Error Handling:** Custom error handling middleware is implemented to provide consistent error responses.

## Endpoints

- **POST /register:** Register a new user.

- **POST /login:** Log in a user and get access and refresh tokens.

- **POST /refresh-token:** Generate a new access token using a valid refresh token.

- **POST /change-password:** Change a user's password using their current password.

- **POST /forgot-password:** Send a password reset email to a user.

- **POST /reset-password/:token:** Reset a user's password using a password reset token.

## Contributing

Feel free to contribute to this starter project by submitting pull requests or suggesting improvements. Your contributions are greatly appreciated!

## License

This project is licensed under the MIT License.

---
