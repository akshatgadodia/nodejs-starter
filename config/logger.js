const winston = require('winston');
const path = require('path');
const fs = require('fs');

const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} ${level}: ${message}`;
    })
);

const logsDir = path.join(__dirname, 'logs'); // Path to the logs folder

// Create the logs folder if it doesn't exist
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

const logger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: path.join(logsDir, 'info.log'), level: 'info' }), // Info logs to info.log
        new winston.transports.File({ filename: path.join(logsDir, 'warn.log'), level: 'warn' }), // Warn logs to warn.log
        new winston.transports.File({ filename: path.join(logsDir, 'error.log'), level: 'error' }) // Error logs to error.log
    ]
});

module.exports = logger;

