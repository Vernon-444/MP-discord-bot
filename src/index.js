const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { log } = require('./logging/logging');
const { mediaLoop } = require('./services/mediaLoop');
const chatResponses = require('./commands/chatCommands/chatResponses');
require('dotenv').config();

const token = process.env.DISCORD_BOT_TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log('Bot is online!');
    log('index.js', 'Bot is online!');
});

// Begin media loop
log('index.js', 'Starting media loop');
mediaLoop();

// handle chatResponses
log('index.js', 'Chat reponses are now active');
chatResponses(client);

client.login(token);
