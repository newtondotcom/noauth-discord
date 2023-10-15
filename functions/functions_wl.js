import constants from '../constants.js';


export default {

    ////////////////LISTWL

    async listwl(interaction) {
      const req = await fetch(constants.masterUri + `get_whitelist/?guild_id=${constants.guildId}`);
      const data = await req.json();
      const whitelist = data.whitelist;
      var content = "";
        for (let i in whitelist) {
          content += `\`${whitelist.indexOf(whitelist[i]) + 1}.\` ${interaction.client.users.cache.get(whitelist[i].user_id).tag} (\`${interaction.client.users.cache.get(whitelist[i].user_id).id}\`), added by \`${whitelist[i].added_by}\` at \`${whitelist[i].date}\` \n`;
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