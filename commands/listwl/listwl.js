const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const db = require('quick.db');
const constants = require('../../constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listwl')
        .setDescription('Checking whitelist!'),
        
    async execute(interaction) {
        
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
            description: `${content}`,
            color: constants.color,
          }]
        });

    },
};
