const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { log } = require('../../logging/logging');
const { generateCaptchaText, generateCaptchaImage } = require('./captchaGenerator');

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
            .setColor("Blue")
            .setImage('attachment://captcha.png')
            .setTitle('Solve the Captcha to verify your account')
            .setFooter({ text: "Use the button below to submit your answer." });

        const attachment = new AttachmentBuilder(captchaImage.toBuffer(), { name: 'captcha.png' });

        const button = new ButtonBuilder()
            .setCustomId('verify')
            .setLabel('Verify')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        try {
            const dmChannel = await member.user.createDM();
            await dmChannel.send({ embeds: [embed], files: [attachment], components: [row] });

            // Handle button interaction
            const filter = i => i.customId === 'verify' && i.user.id === member.user.id;
            const collector = dmChannel.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                if (i.customId === 'verify') {
                    const modal = new ModalBuilder()
                        .setCustomId('captchaModal')
                        .setTitle('Captcha Verification');

                    const captchaInput = new TextInputBuilder()
                        .setCustomId('captchaInput')
                        .setLabel('Enter the text from the image')
                        .setStyle(TextInputStyle.Short);

                    const modalRow = new ActionRowBuilder().addComponents(captchaInput);
                    modal.addComponents(modalRow);

                    await i.showModal(modal);
                }
            });

            client.on('interactionCreate', async interaction => {
                if (!interaction.isModalSubmit()) return;

                if (interaction.customId === 'captchaModal') {
                    const userResponse = interaction.fields.getTextInputValue('captchaInput');
                    if (userResponse === captchaText) {
                        // If the user passes the CAPTCHA challenge, grant them the "Gamer" role
                        const role = member.guild.roles.cache.find(role => role.name === 'Gamer');
                        if (role) {
                            await member.roles.add(role);
                            await interaction.reply({ content: 'Correct CAPTCHA. You are now verified!', ephemeral: true });
                            console.log(`Granted "Gamer" role to ${member.user.tag}`);
                            log('newUserVerification.js', `Granted "Gamer" role to ${member.user.tag}`);
                        } else {
                            console.log('Role "Gamer" not found');
                            log('newUserVerification.js', 'Role "Gamer" not found');
                        }
                    } else {
                        await interaction.reply({ content: 'Incorrect CAPTCHA. Please try again.', ephemeral: true });
                        log('newUserVerification.js', `User ${member.user.tag} failed the CAPTCHA challenge.`);
                    }
                }
            });
        } catch (error) {
            console.error('Error sending CAPTCHA challenge:', error);
            log('newUserVerification.js', `Error sending CAPTCHA challenge to ${member.user.tag}: ${error.message}`);
        }
    });
}

module.exports = { setupNewUserVerification };
