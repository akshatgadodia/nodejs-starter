const ErrorResponse = require("../utils/errorResponse");

// Middleware for handling CORS
const corsHandler = (req, res, next) => {
  // List of origins allowed to access the server (CORS whitelist)
  const whitelist = [
    "http://localhost:3000",
    // Add more allowed origins here if needed
  ];

  // Get the origin of the incoming request
  const origin = req.get("origin");

  // Check if the origin is in the whitelist
  const isWhitelisted = whitelist.includes(origin);

  // Set CORS headers based on whether the origin is whitelisted
  if (isWhitelisted) {
    req.originSource = 'Whitelisted Origin'; // Attatch the origin to request object
    res.setHeader("Access-Control-Allow-Origin", req.get("origin"));
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
  } else {
    // IMPORTANT: Customize this section to handle unallowed origins.
    // For security, you should restrict unallowed origins.
    // Example: Respond with an error message or allow CORS for specific purposes.
    // res.status(403).json({ message: "Origin not allowed" });

    // Allow CORS for all origins (note: this may have security implications).
    // Override this behavior based on your application's requirements.
    req.originSource = 'Unknown Origin'; // Attatch the origin to request object
    res.setHeader("Access-Control-Allow-Origin", req.get("origin"));
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
  }

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    // Respond with a 200 OK for preflight requests
    res.sendStatus(200);
  } else {
    // Continue to the next middleware
    next();
  }
};

module.exports = corsHandler;

