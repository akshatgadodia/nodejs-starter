const ErrorResponse = require("../utils/errorResponse");
const jwt = require("jsonwebtoken");

// Middleware for verifying user roles
const verifyUserRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user roles are available in the request
    if (!req?.user?.roles) {
      // If roles are missing, send an unauthorized response
      return next(new ErrorResponse("Unauthorized access", 401));
    }

    // Create an array of allowed roles
    const rolesArray = [...allowedRoles];

    // Check if any of the user's roles match the allowed roles
    const isAllowed = req.user.roles.some((userRole) =>
      rolesArray.includes(userRole)
    );

    // If none of the user's roles match the allowed roles, send a forbidden response
    if (!isAllowed) {
      return next(new ErrorResponse("Permission Denied", 403));
    }

    // If the user's roles match the allowed roles, proceed to the next middleware
    next();
  };
};

module.exports = verifyUserRoles;

