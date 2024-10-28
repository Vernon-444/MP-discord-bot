const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas } = require('canvas');
const { log } = require('../../logging/logging');

function setupNewUserVerification(client) {
    client.on('guildMemberAdd', async member => {
        console.log(`New user joined: ${member.user.tag}`);
        log('newUserVerification.js', `New user joined: ${member.user.tag}`);

        // Generate CAPTCHA text
        const captchaText = generateCaptchaText(6);

        // Generate CAPTCHA image
        const captchaImage = await generateCaptchaImage(captchaText);

        // Send the user a DM with the CAPTCHA challenge embed
        const embed = new EmbedBuilder()
            .setTitle('Verification')
            .setDescription('Please solve the CAPTCHA below to verify that you are a human.')
            .setImage('attachment://captcha.png');

        const attachment = new AttachmentBuilder(captchaImage.toBuffer(), { name: 'captcha.png' });

        try {
            const dmChannel = await member.user.createDM();
            await dmChannel.send({ embeds: [embed], files: [attachment] });

            // Wait for the user's response
            const filter = response => response.author.id === member.user.id;
            const collected = await dmChannel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });

            const userResponse = collected.first().content;
            if (userResponse === captchaText) {
                // If the user passes the CAPTCHA challenge, grant them the "Gamer" role
                const role = member.guild.roles.cache.find(role => role.name === 'Gamer');

                // Tell the user they passed
                await dmChannel.send('Correct CAPTCHA. You are now verified!');

                // Grant the role
                if (role) {
                    await member.roles.add(role);
                    console.log(`Granted "Gamer" role to ${member.user.tag}`);
                    log('newUserVerification.js', `Granted "Gamer" role to ${member.user.tag}`);
                } else {
                    console.log('Role "Gamer" not found');
                    log('newUserVerification.js', 'Role "Gamer" not found');
                }
            } else {
                await dmChannel.send('Incorrect CAPTCHA. Please try again.');
                log('newUserVerification.js', `User ${member.user.tag} failed the CAPTCHA challenge.`);
            }
        } catch (error) {
            console.error('Error sending CAPTCHA challenge:', error);
            log('newUserVerification.js', `Error sending CAPTCHA challenge to ${member.user.tag}: ${error.message}`);
        }
    });
}

function generateCaptchaText(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
        text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return text;
}

async function generateCaptchaImage(text) {
    const width = 200;
    const height = 100;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);

    // Text
    ctx.font = '30px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText(text, 50, 50);

    // Lines
    for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = `rgba(0,0,0,${Math.random()})`;
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        ctx.lineTo(Math.random() * width, Math.random() * height);
        ctx.stroke();
    }

    // Decoy characters
    const decoyChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 10; i++) {
        ctx.font = `${Math.floor(Math.random() * 20) + 10}px Arial`;
        ctx.fillStyle = `rgba(0,0,0,${Math.random()})`;
        ctx.fillText(decoyChars.charAt(Math.floor(Math.random() * decoyChars.length)), Math.random() * width, Math.random() * height);
    }

    return canvas;
}

module.exports = { setupNewUserVerification };
