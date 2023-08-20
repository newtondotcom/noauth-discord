const {StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActivityType, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder} = require('discord.js');
const constants = require('../constants');

module.exports = {
    ///////////////////////////////////////SPAWN BOUTON
async button(interaction) {

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

    ////////////////////////////////////////////////GRAPHIQUE BOUTON

    async custombuttongraphic(interaction) {
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
        await interaction.update({
            content: 'Fill in the details:',
            components: [modal],
        });
    },

    /////////////////////////////CUSTOMBUTTONTESXT

    async custombuttontext(interaction) {
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

    ////////////////////////////MANAGECUSTOM

    async managecustom(interaction) {
        const selectMenu = new StringSelectMenuBuilder()
            .setPlaceholder('Select an option')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('🖋️ Text')
                    .setDescription('Custom the text of the verification message')
                    .setValue('custombuttontext'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                .setDescription('Custom the design of  the verification message')
                    .setLabel('🖼️ Graphic')
                    .setValue('button'),
            )
            .addOptions(
              new StringSelectMenuOptionBuilder()
                  .setLabel('⏪ Go back')
                  .setValue('panel'),
          )
            .setCustomId('selectCustom');
  
        const row = new ActionRowBuilder().addComponents(selectMenu);
        await interaction.update({ content: '', components: [row] });
    },

}
