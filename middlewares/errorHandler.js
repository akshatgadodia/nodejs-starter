const ErrorResponse = require("../utils/errorResponse");
const logger = require("../config/logger");

// Middleware for handling errors
const errorHandler = (err, req, res, next) => {
  console.error(err); // Log the error to the console (for debugging purposes)

  // Create a copy of the error object
  let error = { ...err };
  error.message = err.message;

  // Handle specific error cases

  // MongoDB duplicate key error
  if (error.name === "MongoError" && error.code === 11000) {
    const message = "Account address must be unique";
    error = new ErrorResponse(message, 400);
  }

  // MongoDB CastError (invalid ObjectId)
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = new ErrorResponse(message, 404);
  }

  // MongoDB duplicate field error
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  // MongoDB validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
    error = new ErrorResponse(message, 400);
  }

  // Add more checks for specific error cases...

  // Log the error using the configured logger, including the complete traceback
  logger.error(error.message || "Internal Server Error", {
    stack: error.stack, // Include complete traceback in the log
  });

  // Send an error response to the client
  res.status(error.statusCode || 500).json({
    success: false,
    data: { error: error.message || "Internal Server Error" },
  });
};

module.exports = errorHandler;

