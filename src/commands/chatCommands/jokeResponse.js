// jokeResponse.js returns a string that is a joke
// the jokes are saved in a file called jokes.json
const fs = require('fs');
const path = require('path');

const jokeResponse = () => {
    try {
        const jokes = JSON.parse(fs.readFileSync(path.join(__dirname, 'jokes.json')));
        const randomIndex = Math.floor(Math.random() * jokes.length);
        return jokes[randomIndex].joke; // Return the joke property
    } catch (error) {
        console.error('Error reading jokes:', error);
        return 'Oops! Something went wrong. Please try again later.';
    }
}

module.exports = jokeResponse;
