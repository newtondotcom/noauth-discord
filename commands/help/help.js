const { SlashCommandBuilder } = require('discord.js');
const Constants = require('../../constants');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Display Help Information'),
    async execute(interaction) {

        if (db.get(`wl_${interaction.user.id}`) !== true && !Constants.owners.includes(interaction.user.id)) {
            await interaction.reply("You don't have permission to use this command.");
            return;
        }
        await interaction.reply({
            components: [],
            // color : https://gist.github.com/thomasbnt/b6f455e2c7d743b796917fa3c205f812
            embeds: [{
                color: Constants.color,
                title: `NOAuth Dashboard`,
                description: '<:join:997096856431640586> **0auth2**\n`joinall`, `Users`, `Links`\n\n<:join:997096856431640586> **Prefix** `;`\n<:info:997096855143989329> *Message sent to users when they authorized:*\n```Hi, welcome 🎁```',
            }]
        });
    },
};

