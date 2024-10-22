// Logging.js is for timestamping and writing files to the logs.txt file
const fs = require('fs');
const path = require('path');

function log(file, message) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} [${file}] ${message}\n`;
    const logFilePath = path.join(__dirname, 'logs.txt');

    try {
        fs.appendFileSync(logFilePath, logMessage);
        console.log(`Logged: ${logMessage}`);
    } catch (error) {
        console.error(`Failed to write to log file: ${error.message}`);
    }
}

module.exports = { log };
