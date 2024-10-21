const { Client, Intents } = require('discord.js');
const { log } = require('../../logging/logging');

module.exports = (client) => {
    client.on('messageCreate', message => {
        if (message.content === '!ping') {
            message.channel.send('Pong!');
            log('chatResponses.js', 'Ponged');
        }
    });
};
