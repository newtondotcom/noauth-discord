const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
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

        fs.readFile('./object.json', async function (err, data) {
            if (err) {
                console.error(err);
                return;
            }

            await interaction.reply({
                embeds: [{
                    title: '<:users:995482295198826547> OAuth2 Users:',
                    description: `There are ${JSON.parse(data).length > 1 ? `\`${JSON.parse(data).length}\` members` : `\`${JSON.parse(data).length}\` users in the bot`}\nType command \`links\` to check your OAuth2 link`,
                    color: constants.color
                }]
            });
        });
    },
};
