# Welcome!

This is a discord bot for the MoodyPlayzzz Youtube and Discord Channel.

### Installation Instructions

1. **Clone the repository**:
   ```sh
   git clone https://github.com/Vernon-444/MP-discord-bot.git
   cd MP-discord-bot
   ```

2. **Install Dependencies**
`npm i` or `npm install`

3. ***Create `.env` file by filling in your own values of this example
    ```sh
    DISCORD_BOT_TOKEN=your_discord_bot_token
    TWITCH_CLIENT_ID=your_twitch_client_id
    TWITCH_CLIENT_SECRET=your_twitch_client_secret
    TWITCH_USERNAME=your_friend_twitch_username
    DISCORD_CHANNEL_ID=your_discord_channel_id
    ```

4. **Run the bot**

    `node index.js`

5. **Have fun!**
    If you should run into any issues feel free to contact me at [super duper extra
    unneccessarily long placeholder until I get this done :D ]

---

---

## Features

* Alerts users when MoodyPlayz has gone live on Twitch (check it out)
* Will respond enthusiastically with "Pong!" when you use the command `!ping` in a channel the bot has access to.


## Upcoming Features

* Youtube / Podcast / other future media posts and updates
* Track / Manage user levels
* Support tickets: report problems / issues / users
* New users verification, role management
* User Management
* Smaller temp voice chats for spontaneous groups (allotted max room sizes based on game or input by users), started by Game Chat room. (set time limit on them)
* Requests Queue (sort by users first, then users submitted quests and dated)

### Tracking user levels
Reward those who engage in the server more frequently via:
* Giveaways
* Special Events like streams / chats / etc
* Special status
* And more!

### New User Verification and Roles
* New users get sent to a roles channel, respond to prompt where they get a secret role (ex: wizzards101, rocketLeague, etc)
* New users start at level 0 with no chatting access. They get access to the Announcements channel and the roles channel.
To verify, they get a message from the bot to ask for the user's reaction before being required to perform a Captcha.
Upon success, users are granted 'level 1' status where more channels are opened.
* MoodyPlayzzz or Mods can request support in livestreams by group. For example if MoodyPlayzzz is streaming Wiz101 he can run a command that would ping followers who have selected certain roles (game categories) so more audiences will recieve more tailored pings and be able to be more involved.


#### User Management
* Bot is capable of banning / removing permissions (or roles) from players as needed including timeouts or full bans.
* Bot will lightly taunt people who have been banned from the server. They deserved it and I think its funny.

---
---

Created by [Brayden Vernon](https://www.linkedin.com/in/brayden-vernon) for [Jarrett Moody](https://www.twitch.tv/MoodyPlayzzz) (MoodyPlayzzz)
