const {StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActivityType, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder} = require('discord.js');
const constants = require('../constants');

module.exports = {
    ///////////////////////////////////////SPAWN BOUTON
async button(interaction) {

        const query = await fetch(constants.masterUri+'get_button?guild_id='+constants.guildId)
        const datat = await query.json()
        const data = datat.button[0]

        const urlImage = decodeURIComponent(data.image)
        console.log(urlImage)

        const exampleEmbed = {
            color: parseInt(data.color),
            title: data.title,
            url: constants.authLink,
            author: {
                name: data.name,
                icon_url: urlImage,
                url: constants.authLink,
            },
            description: data.description,
            thumbnail: {
                url: urlImage,
            },
            timestamp: new Date().toISOString(),
            footer: {
                text: data.footer,
                icon_url: urlImage,
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

    ////////////////////////////////////////////////GRAPHIC BOUTON

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
            .setLabel("Color (Int value) like 1752220 for Aqua")
            .setStyle(TextInputStyle.Short);

        // Create ActionRowBuilders for each TextInputBuilder
        const imageActionRow = new ActionRowBuilder().addComponents(image);
        const colorActionRow = new ActionRowBuilder().addComponents(color);

        // Add each ActionRowBuilder to the modal
        modal.addComponents(imageActionRow);
        modal.addComponents(colorActionRow);

        // Reply to the interaction with the modal
        await interaction.showModal(modal);
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
                    .setEmoji('🖋️')
                    .setLabel('Text')
                    .setDescription('Custom the text of the verification message')
                    .setValue('custombuttontext'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setEmoji('🖼️')
                    .setLabel('Graphic')
                    .setDescription('Custom the design of  the verification message')
                    .setValue('custombuttongraphic'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setEmoji('🖼️')
                    .setLabel('Role')
                    .setDescription('Select role to give after verification')
                    .setValue('selectrole'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setEmoji('⏪')
                    .setLabel('Go back')
                    .setValue('panel'),
            )
            .setCustomId('selectCustom');
  
        const row = new ActionRowBuilder().addComponents(selectMenu);
        await interaction.update({ content: '', components: [row] });
    },

    async selectrole(interaction) {
        //list the roles of the server
        const roles = [];

        const selectMenuGame = new StringSelectMenuBuilder()
        .setPlaceholder('Choose a game !')
        .addOptions(        
            interaction.guild.roles.cache.forEach(role => {
            new StringSelectMenuOptionBuilder()
              .setLabel(role.name)
              .setValue(role.id)
            })
        )
        .setCustomId('selectroletoadd');
  
      const rowGame = new ActionRowBuilder().addComponents(selectMenuGame);
      await interaction.reply({ content: 'Choose a game !', components: [rowGame] });
    },

}
