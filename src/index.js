const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const { log } = require('./logging/logging');
const { mediaLoop } = require('./services/mediaLoop');
const chatResponses = require('./commands/chatCommands/chatResponses');
const { setupNewUserVerification } = require('./automation/newUsers/newUserVerification');
require('dotenv').config();

const token = process.env.DISCORD_BOT_TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages], partials: ['CHANNEL'] });

client.once('ready', () => {
    console.log('Bot is online!');
    log('index.js', 'Bot is online!');
});

// Begin media loop
log('index.js', 'Starting media loop');
mediaLoop();

// Handle chat responses
log('index.js', 'Chat responses are now active');
chatResponses(client);

// Setup new user verification
log('index.js', 'Setting up new user verification');
setupNewUserVerification(client);

client.login(token);
