const ErrorResponse = require("../utils/errorResponse");
const jwt = require("jsonwebtoken");

// Middleware for verifying user tokens
const verifyUserToken = (req, res, next) => {
  let token;

  // Check if the request originates from a whitelisted origin
  if (req.originSource === "Whitelisted Origin") {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer")) {
      // If the token is missing or doesn't start with "Bearer", send an unauthorized response
      return next(new ErrorResponse("Unauthorized access", 401));
    }
    // Extract the token from the Authorization header
    token = authHeader.split(" ")[1];
  } else {
    // Handle logic for other cases when the request doesn't come from a whitelisted origin
    // Add your custom logic here if needed
    // ...
  }

  // Verify the token and decode its payload
  jwt.verify(token, process.env.D_B_SECRET_KEY, async (err, decoded) => {
    if (err) {
      // If the token verification fails, send an invalid token response
      return next(new ErrorResponse("Invalid token", 403));
    }

    // Extract user information from the decoded token and attach it to the request object
    req.userId = decoded.UserInfo.userId;
    req.user = decoded.UserInfo.user;
    req.roles = decoded.UserInfo.roles;

    // Proceed to the next middleware
    next();
  });
};

module.exports = verifyUserToken;

