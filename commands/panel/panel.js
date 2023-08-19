const { SlashCommandBuilder,ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder,  Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const constants = require('../../constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panel')
        .setDescription('List all the servers the bot is in (with their id) !'),
    async execute(interaction) {
        const selectMenu = new StringSelectMenuBuilder()
        .setPlaceholder('Choose a game !')
        .addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel('Option 1')
              .setValue('help')
          )
        .setCustomId('selectCommand');
  
      const row = new ActionRowBuilder().addComponents(selectMenu);
      await interaction.reply({ content: 'Choose a game !', components: [row] });
    },
};
