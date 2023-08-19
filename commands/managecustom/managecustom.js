const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const constants = require('../../constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('managecustom')
        .setDescription('List all the servers the bot is in (with their id) !'),
    async execute(interaction) {
        const selectMenu = new StringSelectMenuBuilder()
            .setPlaceholder('Select an option')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('🖋️ Text')
                    .setValue('custombuttontext'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
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
        await interaction.update({ content: 'Choose a game !', components: [row] });
    },
};
