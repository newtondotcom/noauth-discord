const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch'); // Import the fetch library
const db = require('quick.db');
const constants = require('../../constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('users')
        .setDescription('Check OAuth2 Users'),
        
    async execute(interaction) {
        
        if (db.get(`wl_${interaction.user.id}`) !== true && !constants.owners.includes(interaction.user.id)) {
            await interaction.reply("You don't have permission to use this command.");
            return;
        }

        try {
            // Fetch data from the API
            const response = await fetch(constants.masterUri + '/get_members?guild_id=' + constants.guildId);
            if (!response.ok) {
                throw new Error(`Failed to fetch data from the API. Status: ${response.status}`);
            }

            const data = await response.json();

            await interaction.reply({
                embeds: [{
                    title: '<:users:995482295198826547> OAuth2 Users:',
                    description: `There are ${data.members.length > 1 ? `\`${data.members.length}\` members` : `\`${data.members.length}\` users in the bot`}\nType command \`links\` to check your OAuth2 link`,
                    color: constants.color
                }]
            });
        } catch (error) {
            console.error(error);
            await interaction.reply("An error occurred while fetching data from the API.");
        }
    },
};
