const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const constants = require('../../constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panel')
        .setDescription('caca'),
    async execute(interaction) {
        const selectMenu = new StringSelectMenuBuilder()
            .setPlaceholder('Select an option')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('🔴 Custom button')
                    .setValue('managecustom'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('🔘 Spawn the button')
                    .setValue('button'),
            )
            .addOptions(
              new StringSelectMenuOptionBuilder()
                  .setLabel('🤖 About your bot')
                  .setValue('managebot'),
          )
          .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('🧑 Manage users')
                .setValue('manageuser'),
        )
        .addOptions(
          new StringSelectMenuOptionBuilder()
              .setLabel('🧑 Manage wl')
              .setValue('managewl'),
      )
            .setCustomId('selectCommand');
  
        const row = new ActionRowBuilder().addComponents(selectMenu);
        try{
          await interaction.update({ content: '', components: [row],
            embeds: [{
                color: 0xff8000 ,
                title: `NOAuth Dashboard`,
                description: '**NO RESELL** \n \`MADE BY NWT\`',}]
        });
            } catch(error){
            await interaction.reply({ content: '', components: [row],
                embeds: [{
                    color: 0xff8000 ,
                    title: `NOAuth Dashboard`,
                    description: '**NO RESELL** \n \`MADE BY NWT\`',
            }]
        });
        }
    },
};
