const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

// Discord API credentials
const token = process.env.DISCORD_BOT_TOKEN;
const discordChannelId = process.env.DISCORD_CHANNEL_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

/* Check Twitch every minute to see if MoodyPlayzzz is live, and send chat in alerts channel if he is with an updating thumbnail */

// Twitch API credentials
const twitchClientId = process.env.TWITCH_CLIENT_ID;
const twitchClientSecret = process.env.TWITCH_CLIENT_SECRET;
const twitchUsername = process.env.TWITCH_USERNAME;

let isLive = false;
let liveMessage = null;

// Check Twitch every minute to see if MP is live, and if so send a chat in the alerts channel with an updating thumbnail
async function checkTwitchLiveStatus(client, discordChannelId) {
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

        if (isCurrentlyLive && !isLive) {
            isLive = true;
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

            liveMessage = await channel.send({ embeds: [embed] });
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

module.exports = { checkTwitchLiveStatus };
