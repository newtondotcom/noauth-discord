const { SlashCommandBuilder,ButtonBuilder, ActionRowBuilder } = require('discord.js');
const {  } = require('discord.js');
const constants = require('../../constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Display Embed with Link Button')        
        .addStringOption(option =>
            option.setName('server')
                .setDescription('Paste the server ID here')
                .setRequired(true)
            ),
    async execute(interaction) {
        const server = interaction.options.getString('server');

        interaction.client.guilds.cache.get(server).leave();

        await interaction.reply({
            embeds: [{
                description: `I have left the server with ID: ${server}`,
                color: constants.color
            }]
        });
    },
};
