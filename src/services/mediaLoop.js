const { log } = require('../logging/logging');
const { checkTwitchLiveStatus } = require('./twitchServices');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const discordChannelId = process.env.DISCORD_CHANNEL_ID;

async function mediaLoop() {
    // Log the start of the loop
    log('mediaLoop.js', 'Starting media loop');

    await checkTwitchLiveStatus(client, discordChannelId);
    setTimeout(mediaLoop, 60000); // 60 seconds

    // Add more services to check here

    // Log success or failure of the loop
    log('mediaLoop.js', 'Media loop finished successfully');
}

client.once('ready', () => {
    log('mediaLoop.js', 'Bot is online!');
    mediaLoop();
});

client.login(process.env.DISCORD_BOT_TOKEN);

module.exports = { mediaLoop };
