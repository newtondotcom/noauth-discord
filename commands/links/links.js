const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const constants = require('../../constants');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('links')
        .setDescription('Get NOAuth and Bot Invite Links'),
    async execute(interaction) {
        const client = interaction.client; // Assuming your client instance is accessible this way

        if (db.get(`wl_${interaction.user.id}`) !== true && !constants.owners.includes(interaction.user.id)) {
            await interaction.reply("You don't have permission to use this command.");
            return;
        }

        const authButton = new ButtonBuilder()
            .setLabel('NOAuth Link 📩')
            .setURL(constants.authLink)
            .setStyle(5);

        const inviteButton = new ButtonBuilder()
            .setLabel('Bot Invite 🤖')
            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`)
            .setStyle(5);

        const actionRow = new ActionRowBuilder()
            .addComponents(authButton, inviteButton);

        await interaction.reply({
            embeds: [{
                title: 'NOAuth/Invite 🖇️',
                description: '**```Right click on the button below for copy your NOAuth or Invite Bot link```**\n',
                color: 0xff8000 
            }],
            components: [actionRow]
        });
    },
};
