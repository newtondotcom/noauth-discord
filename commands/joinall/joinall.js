const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const db = require('quick.db');
const Constants = require('../../constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joinall')
        .setDescription('Join all OAuth2 Users'),
    async execute(interaction) {
        const client = interaction.client; // Assuming your client instance is accessible this way

        if (db.get(`wl_${interaction.user.id}`) !== true && !Constants.owners.includes(interaction.user.id)) {
            await interaction.reply("You don't have permission to use this command.");
            return;
        }

        let msg = await interaction.reply({
            content: '**Joining users...**'
        });

        fs.readFile('./object.json', async function (err, data) {
            if (err) {
                console.error(err);
                return;
            }

            let json = JSON.parse(data);
            let error = 0;
            let success = 0;
            let alreadyJoined = 0;

            for (const i of json) {
                const user = await client.users.fetch(i.userID).catch(() => {});
                if (interaction.guild.members.cache.get(i.userID)) {
                    alreadyJoined++;
                }
                await interaction.guild.members.add(user, { accessToken: i.access_token }).catch(() => {
                    error++;
                });
                success++;
            }

            await msg.edit({
                content: `**Joining users...** : \`${success}\``
            });

            await msg.edit({
                embeds: [{
                    title: '<:users:995482295198826547> 0auth2 Joinall',
                    description: `<:info:997096855143989329> **Already in server**: ${alreadyJoined}\n<:join:997096856431640586> **Success**: ${success}\n<:fail:997096858105167922> **Error**: ${error}`,
                    color: Constants.color
                }]
            }).catch(() => {});
        });
    },
};
