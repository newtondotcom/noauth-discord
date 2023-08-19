const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const constants = require('../../constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('custombuttongraphic')
        .setDescription('List all the servers the bot is in (with their id) !'),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('custombuttongraphic')
            .setTitle('Final step');

        // Create TextInputBuilders
        const image = new TextInputBuilder()
            .setCustomId('image')
            .setLabel("What's the image?")
            .setStyle(TextInputStyle.Short);

        const color = new TextInputBuilder()
            .setCustomId('color')
            .setLabel("Color (HEXADECIMAL) like #ff0000")
            .setStyle(TextInputStyle.Short);

        // Create ActionRowBuilders for each TextInputBuilder
        const imageActionRow = new ActionRowBuilder().addComponents(image);
        const colorActionRow = new ActionRowBuilder().addComponents(color);

        // Add each ActionRowBuilder to the modal
        modal.addComponents(imageActionRow);
        modal.addComponents(colorActionRow);

        // Reply to the interaction with the modal
        await interaction.reply({
            content: 'Fill in the details:',
            components: [modal],
        });
    },
};
