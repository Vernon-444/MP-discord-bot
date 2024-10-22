// quoteResponse.js returns a string that is a joke
// the quotes are saved in a file called quotes.json
const fs = require('fs');
const path = require('path');

const quoteResponse = () => {
    try {
        const quotes = JSON.parse(fs.readFileSync(path.join(__dirname, 'quotes.json')));
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const selectedQuote = quotes[randomIndex];
        return `${selectedQuote.quote}\n\\- *${selectedQuote.author}*`; // Return the quote and author
    } catch (error) {
        console.error('Error reading quotes:', error);
        return 'Oops! Something went wrong. Please try again later.';
    }
}

module.exports = quoteResponse;