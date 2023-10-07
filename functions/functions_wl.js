import constants from '../constants.js';


export default {

    ////////////////LISTWL

    async listwl(interaction) {

      const userid = interaction.user.id;
      const req = await fetch(constants.masterUri + `get_whitelist/?guild_id=${constants.guildId}`);
      const data = await req.json();
      const whitelist = data.whitelist;
        if (!constants.owners.includes(userid)) {
            await interaction.reply("You don't have permission to use this command.");
            return;
        }

        var content = "";
        
        for (let i in whitelist) {
          content += `\`${whitelist.indexOf(whitelist[i]) + 1}\` ${interaction.client.users.cache.get(whitelist[i].user_id).tag} (\`${interaction.client.users.cache.get(whitelist[i].user_id).id}\`)\n`;
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