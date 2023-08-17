const { SlashCommandBuilder } = require('discord.js');
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

        await interaction.reply({
            embeds: [{
                title: '**NOAuth/Invite 🖇️**',
                description: `**Your NOAuth Link**\n\`\`\`${constants.authLink}\`\`\`\n **Bot Invite**\n \`\`\`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot\`\`\` `,
                color: constants.color
            }]
        });
    },
};