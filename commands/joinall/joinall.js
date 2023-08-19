const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch'); // Import the fetch function
const db = require('quick.db');
const constants = require('../../constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joinall')
        .setDescription('Join all OAuth2 Users'),
    async execute(interaction) {
        
        if (db.get(`wl_${interaction.user.id}`) !== true && !constants.owners.includes(interaction.user.id)) {
            await interaction.reply("You don't have permission to use this command.");
            return;
        }

        let msg = await interaction.reply({
            content: '**Joining users...**'
        });

        try {
            const response = await fetch(`${constants.masterUri}/get_members?guild_id=${constants.guildId}`);
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const json = await response.json();
            let error = 0;
            let success = 0;
            let alreadyJoined = 0;

            for (const userData of json.members) {
                const user = await interaction.client.users.fetch(userData.userID).catch(() => {});
                console.log(user);
                if (!user) {
                    error++;
                    continue;
                }
                
                if (interaction.guild.members.cache.get(userData.userID)) {
                    alreadyJoined++;
                }

                await interaction.guild.members.add(user, { accessToken: userData.access_token }).catch((error) => {
                    error++;
                });
                success++;
            }

            await msg.edit({
                content: `**Joining \`${success}\` users...**  `
            });

            await msg.edit({
                embeds: [{
                    title: '🧑 NOAuth Joinall',
                    description: `ℹ️ **Already in server**: ${alreadyJoined}\n✅ **Success**: ${success}\n❌ **Error**: ${error}`,
                    color: constants.color
                }]
            });
            } catch (error) {
                console.error(error);
                await msg.edit({
                    content: 'An error occurred while processing the request.'
                });
            }
        },
    };