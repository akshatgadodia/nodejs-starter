const mongoose = require('mongoose');

// Get MongoDB host, port, database name and credentials from environment variables
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const databaseName = process.env.DB_NAME

// Create the MongoDB connection URL using the provided credentials
// URL format for MongoDB Atlas
// const connectionUrl = `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=admin&ssl=true&retryWrites=true`;
// URL format for mongodb on local system or on docker container
const connectionUrl = `mongodb://${username}:${password}@${host}:${port}/${databaseName}`;

// Function to connect to the MongoDB database
const connectDB = async () => {
    try {
        // Disable strict query mode to allow more flexible queries
        await mongoose.set("strictQuery", false);
	
        // Connect to the MongoDB database using the provided URL
        await mongoose.connect(connectionUrl);
	console.log("CONNECTION SUCCESS")
        // Log a success message if the connection is successful
        console.log("Connection to the database successful");
    } catch (error) {
        // Log an error message and exit the process if the connection fails
        console.log("Connection to the database failed");
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectDB;
