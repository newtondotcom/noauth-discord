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

        interaction.update({
          embeds: [{
            title: "Whitelisted Users",
            description: content,
            color: constants.color,
          }]
        });

    },

};