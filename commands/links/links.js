const { SlashCommandBuilder } = require('discord.js');
const Constants = require('../../constants');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('links')
        .setDescription('Get OAuth2 and Bot Invite Links'),
    async execute(interaction) {
        const client = interaction.client; // Assuming your client instance is accessible this way

        if (db.get(`wl_${interaction.user.id}`) !== true && !Constants.owners.includes(interaction.user.id)) {
            await interaction.reply("You don't have permission to use this command.");
            return;
        }

        await interaction.reply({
            embeds: [{
                title: '<:links:996492434278187169> Oauth/Invite:',
                description: `<:join:997096856431640586> **Your OAuth2 Link:** ${Constants.authLink}\n\`\`\`${Constants.authLink}\`\`\`\n<:join:997096856431640586> **Bot Invite:** https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot\n \`\`\`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot\`\`\` `,
                color: Constants.color
            }]
        });
    },
};
