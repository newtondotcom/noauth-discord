const { SlashCommandBuilder } = require('discord.js');
const constants = require('../../constants');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Display Help Information'),
    async execute(interaction) {

        if (db.get(`wl_${interaction.user.id}`) !== true && !constants.owners.includes(interaction.user.id)) {
            await interaction.reply("You don't have permission to use this command.");
            return;
        }
        await interaction.reply({
            components: [],
            // color : https://gist.github.com/thomasbnt/b6f455e2c7d743b796917fa3c205f812
            embeds: [{
                color: 0xff8000 ,
                title: `NOAuth Dashboard`,
                description: '**Prefix :** `;` or `/`\n**Bring all users :** `joinall`\n **Users list :** `users`\n **Bot links :** `Links`\n **Create a verification message :** `button`\n **whitelist user :** `wl`\n **Check whitelisted users:** `listwl`\n **Make your bot leave a server :** `leave`',
            }]
        });
    },
};

