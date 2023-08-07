const { SlashCommandBuilder,ButtonBuilder, ActionRowBuilder } = require('discord.js');
const {  } = require('discord.js');
const Constants = require('../../constants');

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
            description: 'Some description here',
            thumbnail: {
                url: 'https://i.imgur.com/AfFp7pu.png',
            },
            fields: [
                {
                    name: 'Regular field title',
                    value: 'Some value here',
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false,
                },
                {
                    name: 'Inline field title',
                    value: 'Some value here',
                    inline: true,
                },
                {
                    name: 'Inline field title',
                    value: 'Some value here',
                    inline: true,
                },
                {
                    name: 'Inline field title',
                    value: 'Some value here',
                    inline: true,
                },
            ],
            image: {
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
            .setURL(Constants.authLink)
            .setStyle(5);

        const actionRow = new ActionRowBuilder()
            .addComponents(button);

        await interaction.reply({
            components: [actionRow],
            embeds: [exampleEmbed]
        });
    },
};
