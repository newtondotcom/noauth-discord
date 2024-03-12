import {ModalBuilder,TextInputBuilder, TextInputStyle , ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import constants from '../constants.js';
import fetch from 'node-fetch';

export default {

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
                    .setValue('backtozero'),
            )
            .setCustomId('selectBot');
        const row = new ActionRowBuilder().addComponents(selectMenu);
        await interaction.update({ content: '', components: [row] });
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
                    .setEmoji('🚀')
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
                    .setEmoji('⏩')
                    .setLabel('Speed')
                    .setDescription('Manage the joining speed of users')
                    .setValue('joinspeed'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setEmoji('⏪')
                    .setLabel('Go back')
                    .setValue('backtozero'),
            )
            
            .setCustomId('selectUser');
  
        const row = new ActionRowBuilder().addComponents(selectMenu);
        await interaction.update({ content: '', components: [row] });
    },


//////////////////////////////MANAGEWL

    async managewl(interaction) {
        const userid = interaction.user.id;
        if (!constants.owners.includes(userid)) {
            await interaction.update("You don't have permission to use this command.");
            return;
        }
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
                    .setEmoji('⛔')
                    .setLabel('WL Restrictions')
                    .setDescription('List who has access to your bot')
                    .setValue('wlrulesmanage'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setEmoji('⏪')
                    .setLabel('Go back')
                    .setValue('backtozero'),
            )
            .setCustomId('selectBot');

        const row = new ActionRowBuilder().addComponents(selectMenu);
        await interaction.update({ content: '', components: [row] });
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
        const req = await fetch(constants.masterUri + `get_whitelist/?guild_id=${constants.guildId}`, {method: 'GET',headers: constants.header});
        const data = await req.json();
        const userArray = data.whitelist;
        const selectMenuGame = new StringSelectMenuBuilder()
        .setPlaceholder('')
        .addOptions(
            userArray.map((game) =>
            new StringSelectMenuOptionBuilder()
              .setLabel(interaction.client.users.cache.get(game.user_id).tag)
              .setValue(interaction.client.users.cache.get(game.user_id).id)
          )
        )
        .setCustomId('managewlremove');
  
      const rowGame = new ActionRowBuilder().addComponents(selectMenuGame);
      await interaction.update({ content: '', components: [rowGame] });
    },

    ///////////////////SUBSCRIPTION

    async sub(interaction) {
        const response = await fetch(`${constants.masterUri}get_subscription?guild_id=${constants.guildId}`, {method: 'GET',headers: constants.header});
        const json = await response.json();
        const description = `**📆 Start : ** ${json.subscription_date.split("T")[0]} **At ** ${json.subscription_date.split("T")[1].substring(0, 8)}\n **🕐 Time left :** ${json.subscription_duration} days`;
        await interaction.update({
            content: '',
            embeds: [{
                title: 'Subscription',
                description:description,
                color: constants.color
            }]
        });
    },

    async backtozero(interaction) {        
        const userid = interaction.user.id;
        const req = await fetch(constants.masterUri + `get_whitelist/?guild_id=${constants.guildId}`, {method: 'GET',headers: constants.header});
        const data = await req.json();
        const whitelist = data.whitelist;
        if (!constants.owners.includes(userid)&&!whitelist.some(e => e.user_id === userid)) {
            await interaction.reply("You don't have permission to use this command.");
            return;
        }

        const selectMenu = new StringSelectMenuBuilder()
            .setPlaceholder('Select an option')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setEmoji('🚨')
                .setLabel('Custom button')
                .setDescription('Custom the verification button')
                .setValue('managecustom'),
        )
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setEmoji('🤖')
                .setLabel('About your bot')
                .setDescription('Manage your bot')
                .setValue('managebot'),
        )
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setEmoji('🧑')
                .setLabel('Manage users')
                .setDescription('Manages users')
                .setValue('manageuser'),
        )
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setEmoji('✔️')
                .setLabel('Manage Whitelist')
                .setDescription('Manages users who have access to the whitelist')
                .setValue('managewl'),
        )
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setEmoji('❌')
                .setLabel('Close Menu')
                .setDescription('Close the menu')
                .setValue("closemenu"),
        )
            .setCustomId('selectCommand');
  
        const row = new ActionRowBuilder().addComponents(selectMenu);
        try {
            await interaction.update({
              content: '',
              components: [row],
              embeds: [
                {
                  color: 0xff8000,
                  title: `🆔  Manage your NOAuth bot`,
                  description: '**Welcome to your NOAuth.**\n **There are some rules to read before use. \n `[1]` Do not resell the bot ❌ \n `[2]`...** \n \n If you have purchased this bot from an individual, please report it [here](https://discord.com/channels/1005570403932049458/1005573106779304016/1129072045246914630). You will be rewarded.',
                },
              ],
              ephemeral: true 
            });
          } catch (error) {
            console.error(error);
          }
    },
};