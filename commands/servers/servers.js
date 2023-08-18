const { SlashCommandBuilder } = require('discord.js');
const constants = require('../../constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servers')
        .setDescription('List all the servers the bot is in (with their id) !'),
    async execute(interaction) {
        const serverList = [];

        interaction.client.guilds.cache.forEach(guild => {
            serverList.push(`${guild.name} | ${guild.id}`);
        });

        const description =  " 🔶 " + serverList.join('\n \n 🔶 ');
        await interaction.reply({
            embeds: [{
                title: 'Server List of NOAuth',
                description:description,
                color: constants.color
            }]
        });
    },
};
