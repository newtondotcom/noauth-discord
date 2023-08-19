const { SlashCommandBuilder,ButtonBuilder, ActionRowBuilder } = require('discord.js');
const {  } = require('discord.js');
const constants = require('../../constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('button')
        .setDescription('Display Embed with Link Button'),
    async execute(interaction) {

        const exampleEmbed = {
            color: 0x0099ff,
            title: 'Some title',
            url: 'https://discord.js.org',
            author: {
                name: 'Some name',
                icon_url: 'https://i.imgur.com/AfFp7pu.png',
                url: 'https://discord.js.org',
            },
            description: 'Some descriptiozqdqzsdzqzn  dzq dzq dzq sdzhzqdz qe zqdre Some descriptiozqdqzsdzqzn  dzq dzq dzq sdzhzqdz qe zqdre Some descriptiozqdqzsdzqzn  dzq dzq dzq sdzhzqdz qe zqdre',
            thumbnail: {
                url: 'https://i.imgur.com/AfFp7pu.png',
            },
            timestamp: new Date().toISOString(),
            footer: {
                text: 'Some footer text here',
                icon_url: 'https://i.imgur.com/AfFp7pu.png',
            },
        };

        const button = new ButtonBuilder()
            .setLabel('Authenticate here')
            .setURL(constants.authLink)
            .setStyle(5);

        const actionRow = new ActionRowBuilder()
            .addComponents(button);

        await interaction.reply({
            components: [actionRow],
            embeds: [exampleEmbed]
        });
    },
};
