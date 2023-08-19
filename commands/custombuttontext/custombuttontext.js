const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const constants = require('../../constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('custombuttontext')
        .setDescription('List all the servers the bot is in (with their id) !'),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('custombuttontext')
            .setTitle('Final step');

        // Create TextInputBuilders
        const name = new TextInputBuilder()
            .setCustomId('name')
            .setLabel("What's the name?")
            .setStyle(TextInputStyle.Short);

        const title = new TextInputBuilder()
            .setCustomId('title')
            .setLabel("What's the title?")
            .setStyle(TextInputStyle.Short);

        const description = new TextInputBuilder()
            .setCustomId('description')
            .setLabel("What's the description?")
            .setStyle(TextInputStyle.Paragraph);

        const footer = new TextInputBuilder()
            .setCustomId('footer')
            .setLabel("What's the footer?")
            .setStyle(TextInputStyle.Short);

        // Create ActionRowBuilders and add TextInputBuilders to them
        const nameActionRow = new ActionRowBuilder().addComponents(name);
        const titleActionRow = new ActionRowBuilder().addComponents(title);
        const descriptionActionRow = new ActionRowBuilder().addComponents(description);
        const footerActionRow = new ActionRowBuilder().addComponents(footer);

        // Add each ActionRowBuilder to the modal
        modal.addComponents(nameActionRow);
        modal.addComponents(titleActionRow);
        modal.addComponents(descriptionActionRow);
        modal.addComponents(footerActionRow);

        // Reply to the interaction with the modal
        await interaction.showModal(modal);
    },
};
