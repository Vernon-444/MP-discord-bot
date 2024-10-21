const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const token = process.env.DISCORD_BOT_TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Twitch API credentials
const twitchClientId = process.env.TWITCH_CLIENT_ID;
const twitchClientSecret = process.env.TWITCH_CLIENT_SECRET;
const twitchUsername = process.env.TWITCH_USERNAME;
const discordChannelId = process.env.DISCORD_CHANNEL_ID;

let isLive = false;
let liveMessage = null;

client.once('ready', () => {
    console.log('Bot is online!');
    checkTwitchLiveStatus();
    setInterval(checkTwitchLiveStatus, 60000); // Check every 60 seconds
});

client.on('messageCreate', message => {
    if (message.content === '!ping') {
        message.channel.send('Pong!');
    }
});

async function checkTwitchLiveStatus() {
    try {
        const tokenResponse = await axios.post('https://id.twitch.tv/oauth2/token', null, {
            params: {
                client_id: twitchClientId,
                client_secret: twitchClientSecret,
                grant_type: 'client_credentials'
            }
        });

        const accessToken = tokenResponse.data.access_token;

        const userResponse = await axios.get(`https://api.twitch.tv/helix/users?login=${twitchUsername}`, {
            headers: {
                'Client-ID': twitchClientId,
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const userId = userResponse.data.data[0].id;

        const streamResponse = await axios.get(`https://api.twitch.tv/helix/streams?user_id=${userId}`, {
            headers: {
                'Client-ID': twitchClientId,
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const isCurrentlyLive = streamResponse.data.data.length > 0;

        if (isCurrentlyLive) {
            const streamData = streamResponse.data.data[0];
            const channel = await client.channels.fetch(discordChannelId);

            // Use the thumbnail URL from the stream data and add a timestamp to prevent caching
            const thumbnailUrl = `${streamData.thumbnail_url.replace('{width}', '640').replace('{height}', '360')}?${Date.now()}`;
            console.log(`Stream is live. Thumbnail URL: ${thumbnailUrl}`);

            const embed = new EmbedBuilder()
                .setTitle(`${twitchUsername} is now live on Twitch!`)
                .setURL(`https://www.twitch.tv/${twitchUsername}`)
                .setDescription(streamData.title)
                .setImage(thumbnailUrl)
                .setColor('#9146FF');

            if (liveMessage) {
                await liveMessage.edit({ embeds: [embed] });
            } else {
                liveMessage = await channel.send({ embeds: [embed] });
            }
        } else if (!isCurrentlyLive && isLive) {
            isLive = false;
            console.log('Stream is not live.');

            if (liveMessage) {
                await liveMessage.delete();
                liveMessage = null;
            }
        }
    } catch (error) {
        console.error('Error checking Twitch live status:', error);
    }
}

client.login(token);
