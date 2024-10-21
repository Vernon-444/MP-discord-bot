// Logging.js is for timestamping and writing files to the logs.txt file
const fs = require('fs');

function log(file, message) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync('logs.txt', `${timestamp} [${file}] ${message}\n`);
}

module.exports = { log };
