const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const constants = require('../../constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('manageuser')
        .setDescription('List all the servers the bot is in (with their id) !'),
    async execute(interaction) {
        const selectMenu = new StringSelectMenuBuilder()
            .setPlaceholder('Select an option')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Join')
                    .setValue('join'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('joinall')
                    .setValue('joinall'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('⏪ Go back')
                    .setValue('panel'),
            )
            
            .setCustomId('selectUser');
  
        const row = new ActionRowBuilder().addComponents(selectMenu);
        await interaction.update({ content: 'Choose a game !', components: [row] });
    },
};
