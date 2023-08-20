const {ModalBuilder,TextInputBuilder, TextInputStyle , ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const constants = require('../constants');
const db = require('quick.db');

module.exports = {

    ////////////////////MANAGEBOT

    async managebot(interaction) {
        const selectMenu = new StringSelectMenuBuilder()
            .setPlaceholder('Select an option')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('🧾 Bot server list')
                    .setDescription('Look at which server your bot is in')
                    .setValue('servers'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('🖇️ Links')
                    .setDescription('Get the verif link or the link to invite your bot to your server')
                    .setValue('links'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('🚷 leave')
                    .setDescription('Leave your bot')
                    .setValue('leave'),
            )
            .addOptions(
              new StringSelectMenuOptionBuilder()
                  .setLabel('⏪ Go back')
                  .setValue('panel'),
          )
            .setCustomId('selectBot');
  
        const row = new ActionRowBuilder().addComponents(selectMenu);
        await interaction.update({ content: 'Choose a game !', components: [row] });
    },


    /////////////////////////manageuser

    async manageuser(interaction) {
        const selectMenu = new StringSelectMenuBuilder()
            .setPlaceholder('Select an option')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('📃 User list')
                    .setDescription('Look at how many members it is checked')
                    .setValue('users'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('🎣 Join')
                    .setDescription('Join a number of people in the server you want')
                    .setValue('selectjoin'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('🛶 joinall')
                    .setDescription('Join all the people who are verified')
                    .setValue('joinall'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('⏪ Go back')
                    .setValue('panel'),
            )
            
            .setCustomId('selectUser');
  
        const row = new ActionRowBuilder().addComponents(selectMenu);
        await interaction.update({ content: '', components: [row] });
    },


//////////////////////////////MANAGEWL

    async managewl(interaction) {
        const selectMenu = new StringSelectMenuBuilder()
            .setPlaceholder('Select an option')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('➕ Add')
                    .setDescription('Give access to your bot')
                    .setValue('managewladd'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('🗑️ Remove')
                    .setDescription('Remove access to your bot')
                    .setValue('managewlremove'),
            )
            .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('⏪ Go back')
                .setValue('panel'),
        )
            .setCustomId('selectBot');

        const row = new ActionRowBuilder().addComponents(selectMenu);
        await interaction.update({ content: 'Choose a game !', components: [row] });
    },

    //////////////////MANAGEWLADD

    async managewladd(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('managewladd')
            .setTitle('Final step');

        // Create TextInputBuilders
        const name = new TextInputBuilder()
            .setCustomId('id')
            .setLabel("What's the ID?")
            .setStyle(TextInputStyle.Short);

        // Create ActionRowBuilders and add TextInputBuilders to them
        const nameActionRow = new ActionRowBuilder().addComponents(name);
        
        // Add each ActionRowBuilder to the modal
        modal.addComponents(nameActionRow);

        // Reply to the interaction with the modal
        await interaction.showModal(modal);
    },


    ///////////////////MANAGEWLREMOVE

    async managewlremove(interaction) {
        const userArray = db.all(); // Retrieve all keys (user data) from the database
        console.log(userArray[0].ID);

        const selectMenuGame = new StringSelectMenuBuilder()
        .setPlaceholder('Choose a game !')
        .addOptions(
            userArray.map((game) =>
            new StringSelectMenuOptionBuilder()
              .setLabel(game.data)
              .setValue(game.ID)
          )
        )
        .setCustomId('selectMenuGame');
  
      const rowGame = new ActionRowBuilder().addComponents(selectMenuGame);
      await interaction.reply({ content: 'Choose a game !', components: [rowGame] });
    },

};