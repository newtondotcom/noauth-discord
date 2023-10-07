import db from 'quick.db';
import constants from '../constants.js';


export default {

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

        interaction.reply({
          embeds: [{
            title: "Whitelisted Users",
            description: `**${content}**`,
            color: constants.color,
          }]
        });

    },

};