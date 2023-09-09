const {ModalBuilder,TextInputBuilder, TextInputStyle , ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const constants = require('../constants');
const db = require('quick.db');
const e = require('express');

module.exports = {

    ////////////////////MANAGEBOT

    async managebot(interaction) {
        const selectMenu = new StringSelectMenuBuilder()
            .setPlaceholder('Select an option')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setEmoji('🧾')
                    .setLabel('Bot server list')
                    .setDescription('Look at which server your bot is in')
                    .setValue('servers'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setEmoji('🖇️')
                    .setLabel('Links')
                    .setDescription('Get the verif link or the link to invite your bot to your server')
                    .setValue('links'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setEmoji('🚷')
                    .setLabel('Leave')
                    .setDescription('Leave your bot')
                    .setValue('listleave'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setEmoji('🔗')
                    .setLabel('Webhook')
                    .setDescription('Manage your bot webhook')
                    .setValue('changewebhook'),
            )        
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setEmoji('🪙')
                    .setLabel('Subscription')
                    .setDescription('Review your suscription')
                    .setValue('sub'),
            )     
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setEmoji('⏪')
                    .setLabel('Go back')
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
                    .setEmoji('📃')
                    .setLabel('User list')
                    .setDescription('Look at how many members it is checked')
                    .setValue('users'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setEmoji('🎣')
                    .setLabel('Join')
                    .setDescription('Join a number of people in the server you want')
                    .setValue('selectjoin'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setEmoji('🛶')
                    .setLabel('Join all')
                    .setDescription('Join all the people who are verified')
                    .setValue('joinall'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setEmoji('⏪')
                    .setLabel('Go back')
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
                    .setEmoji('➕')
                    .setLabel('Add')
                    .setDescription('Give access to your bot')
                    .setValue('managewladd'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setEmoji('🗑️')
                    .setLabel('Remove')
                    .setDescription('Remove access to your bot')
                    .setValue('managewlremove'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setEmoji('📃')
                    .setLabel('List')
                    .setDescription('List who has access to your bot')
                    .setValue('listwl'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setEmoji('⏪')
                    .setLabel('Go back')
                    .setValue('panel'),
            )
            .setCustomId('selectBot');

        const row = new ActionRowBuilder().addComponents(selectMenu);
        await interaction.update({ content: 'Choose a game !', components: [row] });
    },

    //////////////////MANAGEWLADD

    async managewladd(interaction) {
        if (constants.owners.includes(interaction.user.id)) {
            await interaction.reply("You don't have permission to use this command.");
            return;
        }
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
        if (constants.owners.includes(interaction.user.id)) {
            await interaction.reply("You don't have permission to use this command.");
            return;
        }
        const userArray = db.all();
        const selectMenuGame = new StringSelectMenuBuilder()
        .setPlaceholder('Choose a game !')
        .addOptions(
            userArray.map((game) =>
            new StringSelectMenuOptionBuilder()
              .setLabel(interaction.client.users.cache.get(game.ID.split("_")[1]).tag)
              .setValue(interaction.client.users.cache.get(game.ID.split("_")[1]).id)
          )
        )
        .setCustomId('managewlremove');
  
      const rowGame = new ActionRowBuilder().addComponents(selectMenuGame);
      await interaction.reply({ content: 'Choose a game !', components: [rowGame] });
    },

    ///////////////////SUBSCRIPTION

    async sub(interaction) {
        const response = await fetch(`${constants.masterUri}get_subscription?guild_id=${constants.guildId}`);
        const json = await response.json();
        const description = `**Your subscription has started on :** ${json.subscription_date.split("T")[0]} at ${json.subscription_date.split("T")[1].substring(0, 8)}\n**Your subscription last ** ${json.subscription_duration} days`;
        await interaction.update({
            content: '',
            embeds: [{
                title: 'Subscription',
                description:description,
                color: constants.color
            }]
        });
    },

};