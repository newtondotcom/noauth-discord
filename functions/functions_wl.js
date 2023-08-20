const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const db = require('quick.db');
const constants = require('../constants');


module.exports = {

    ////////////////LISTWL

    async listwl(interaction) {
        
        if (db.get(`wl_${interaction.user.id}`) !== true && !constants.owners.includes(interaction.user.id)) {
            await interaction.reply("You don't have permission to use this command.");
            return;
        }

        var content = "";
        const whitelistedUsers = db.all().filter((data) => data.ID.startsWith(`wl_`)).sort((a, b) => b.data - a.data);
        
        for (let i in whitelistedUsers) {
          if (whitelistedUsers[i].data === null) whitelistedUsers[i].data = 0;
          content += `\`${whitelistedUsers.indexOf(whitelistedUsers[i]) + 1}\` ${interaction.client.users.cache.get(whitelistedUsers[i].ID.split("_")[1]).tag} (\`${interaction.client.users.cache.get(whitelistedUsers[i].ID.split("_")[1]).id}\`)\n`;
        }

        interaction.channel.send({
          embeds: [{
            title: "Whitelisted Users",
            description: `**${content}**`,
            color: constants.color,
          }]
        });

    },


    ////////////////////WL
    async wl(interaction) {
        const action = interaction.options.getString('action');
        const user = interaction.options.getUser('user');

        if (action =="remove") {
            const userToRemove =  user;
            if (db.get(`wl_${userToRemove.id}`) !== null) {
                db.delete(`wl_${userToRemove.id}`);
                interaction.channel.send({
                  embeds: [{
                    description: `**${userToRemove.username}** has been removed from the whitelist`,
                    color: constants.color
                  }]
                });
              } else {
                interaction.channel.send({
                  embeds: [{
                    description: `**${userToRemove.username}** was not whitelisted`,
                    color: constants.color
                  }]
                });
              }
        } else if (action == "add") {
            const userToAdd = user;
            if (db.get(`wl_${userToAdd.id}`) === null) {
                db.set(`wl_${userToAdd.id}`, true);
                interaction.channel.send({
                  embeds: [{
                    description: `**${userToAdd.username}** has been added to the whitelist`,
                    color: constants.color
                  }]
                });
              } else {
                interaction.channel.send({
                  embeds: [{
                    description: `**${userToAdd.username}** is already whitelisted`,
                    color: constants.color
                  }]
                });
              }   
        } else {
            await interaction.update('Whitelist management logic here!');
        }
    },

};