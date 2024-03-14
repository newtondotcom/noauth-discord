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
      await interaction.update({ content: '', components: [row], embeds: []});
  },


    //// REMOVE RULES
    async wlrulesrmv(interaction) {
      const modal = new ModalBuilder()
          .setCustomId('wlrulermreq')
          .setTitle('Wl Restrictions');

      const name = new TextInputBuilder()
          .setCustomId('ruleid')
          .setValue(" ")
          .setLabel("Rule ID")
          .setRequired(true)
          .setStyle(TextInputStyle.Short);

          const nameActionRow = new ActionRowBuilder().addComponents(name);
          modal.addComponents(nameActionRow);

      await interaction.showModal(modal);
  },

    ///FOMULAIRE
    async wlrules(interaction) {
      const query = await fetch(constants.masterUri+'get_button/?guild_id='+constants.guildId, {method: 'GET',headers: constants.header})
      const datat = await query.json()
      const data = datat.button[0]

      const modal = new ModalBuilder()
          .setCustomId('wlrules')
          .setTitle('Wl Restrictions');

      const content = new TextInputBuilder()
          .setCustomId('userid')
          .setValue(data.content)
          .setLabel("User ID")
          .setRequired(true)
          .setStyle(TextInputStyle.Short);

          const name = new TextInputBuilder()
          .setCustomId('session')
          .setValue(data.name)
          .setLabel("Session Max /day ? (0 for ∞)")
          .setRequired(false)
          .setStyle(TextInputStyle.Short);

      const title = new TextInputBuilder()
          .setCustomId('number')
          .setValue(data.title)
          .setLabel("Max nb of users to join ? (0 for ∞)")
          .setRequired(false)
          .setStyle(TextInputStyle.Short);

          const nameActionRow = new ActionRowBuilder().addComponents(name);
          const titleActionRow = new ActionRowBuilder().addComponents(title);
          const contentActionRow = new ActionRowBuilder().addComponents(content);
          modal.addComponents(contentActionRow);
          modal.addComponents(nameActionRow);
          modal.addComponents(titleActionRow);

      await interaction.showModal(modal);
  },


  async wlruleslist(interaction){
   const req = await fetch(constants.masterUri + `get_whitelist_rules/?guild_id=${constants.guildId}`, {method: 'GET',headers: constants.header});
    const data = await req.json();
    const rules = data.rules;
    var content = "";
      content = " **ID | User | Session Limit | Join Limit** \n"
      for (let i in rules) {
        content += `\`${rules[i].id}\` ${interaction.client.users.cache.get(rules[i].user_id).tag} | \`${rules[i].sessionlimit}\`| \`${rules[i].joinlimit}\` \n`;
      }

      if (content == "") {
        content = "No rules for now, try to add one";
      } else {
        content = `${content}`;
      
      }

      await interaction.update({
        embeds: [{
          title: "Rules",
          description: content,
          color: constants.color,
        }]
      });
  }

};