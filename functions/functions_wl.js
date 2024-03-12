import {ModalBuilder,TextInputBuilder, TextInputStyle , ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import constants from '../constants.js';
import fetch from 'node-fetch';


export default {

    ////////////////LISTWL

    async listwl(interaction) {
      const req = await fetch(constants.masterUri + `get_whitelist/?guild_id=${constants.guildId}`, {method: 'GET',headers: constants.header});
      const data = await req.json();
      const whitelist = data.whitelist;
      var content = "";
        for (let i in whitelist) {
          content += `\`${whitelist.indexOf(whitelist[i]) + 1}.\` ${interaction.client.users.cache.get(whitelist[i].user_id).tag} (\`${interaction.client.users.cache.get(whitelist[i].user_id).id}\`), added by \`${whitelist[i].added_by}\` at \`${whitelist[i].date}\` \n`;
        }

        if (content == "") {
          content = "No whitelisted users for now, try to add one";
        } else {
          content = `**${content}**`;
        
        }

        await interaction.update({
          embeds: [{
            title: "Whitelisted Users",
            description: content,
            color: constants.color,
          }]
        });

    },

    //// REGLES

    async wlrulesmanage(interaction) {
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
                  .setLabel('Add Rule')
                  .setDescription('Give access to your bot')
                  .setValue('wlrules'),
          )
          .addOptions(
            new StringSelectMenuOptionBuilder()
                .setEmoji('📕')
                .setLabel('Remove rule')
                .setDescription('Give access to your bot')
                .setValue('wlrulesrmv'),
          )
          .addOptions(
            new StringSelectMenuOptionBuilder()
                .setEmoji('📕')
                .setLabel('Rules list')
                .setDescription('Give access to your bot')
                .setValue('wlruleslist'),
          )
          .addOptions(
            new StringSelectMenuOptionBuilder()
                .setEmoji('⏪')
                .setLabel('Go back')
                .setValue('managewl'),
        )
          .setCustomId('selectBot');

      const row = new ActionRowBuilder().addComponents(selectMenu);
      await interaction.update({ content: '', components: [row] });
  },


    //// REMOVE RULES
    async wlrulesrmv(interaction) {
      const userid = interaction.user.id;
      if (!constants.owners.includes(userid)) {
          await interaction.update("You don't have permission to use this command.");
          return;
      }
      const selectMenu = new StringSelectMenuBuilder()
          .setPlaceholder('Select an option')
          .addOptions(
            new StringSelectMenuOptionBuilder()
                .setEmoji('🔴')
                .setLabel('Rule 1')
                .setDescription('Give access to your bot')
                .setValue('wlrulesmanage'),
          )
          .setCustomId('selectBot');

      const row = new ActionRowBuilder().addComponents(selectMenu);
      await interaction.update({ content: '', components: [row] });
  },






    ///FOMULAIRE
    async wlrules(interaction) {
      const query = await fetch(constants.masterUri+'get_button/?guild_id='+constants.guildId, {method: 'GET',headers: constants.header})
      const datat = await query.json()
      const data = datat.button[0]

      const modal = new ModalBuilder()
          .setCustomId('wlrules')
          .setTitle('Wl Restrictions');


      const footer = new TextInputBuilder()
          .setCustomId('footer')
          .setValue(data.footer)
          .setLabel("Rule name")
          .setRequired(true)
          .setStyle(TextInputStyle.Short);

      const content = new TextInputBuilder()
          .setCustomId('content')
          .setValue(data.content)
          .setLabel("User ID")
          .setRequired(true)
          .setStyle(TextInputStyle.Short);

          const name = new TextInputBuilder()
          .setCustomId('name')
          .setValue(data.name)
          .setLabel("Session Max /day ?")
          .setRequired(false)
          .setStyle(TextInputStyle.Short);

      const title = new TextInputBuilder()
          .setCustomId('title')
          .setValue(data.title)
          .setLabel("Maximum number of users allowed to join ?")
          .setRequired(false)
          .setStyle(TextInputStyle.Short);

          const footerActionRow = new ActionRowBuilder().addComponents(footer);
          const nameActionRow = new ActionRowBuilder().addComponents(name);
          const titleActionRow = new ActionRowBuilder().addComponents(title);
          const contentActionRow = new ActionRowBuilder().addComponents(content);
  
          modal.addComponents(footerActionRow);
          modal.addComponents(contentActionRow);
          modal.addComponents(nameActionRow);
          modal.addComponents(titleActionRow);

      await interaction.showModal(modal);
  }

};