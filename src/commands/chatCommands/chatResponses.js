const { Client, Intents } = require('discord.js');
const { log } = require('../../logging/logging');

const jokeResponse = require('./jokeResponse');
const quoteResponse = require('./quoteResponse');

module.exports = (client) => {
    client.on('messageCreate', message => {
        switch (message.content) {
            case '!ping':
                message.reply('Pong!');
                log('chatResponses.js', 'Ponged');
                break;
            case '!hello':
                message.reply(`Hello there, ${message.author.username}!`);
                log('chatResponses.js', 'Greeted with Hello');
                break;
            case '!joke':
                message.reply(jokeResponse());
                log('chatResponses.js', 'Told a joke');
                break;
            case '!quote':
                message.reply(quoteResponse());
                log('chatResponses.js', 'Shared a quote');
                break;
            default:
                break;
        }
    });
};
