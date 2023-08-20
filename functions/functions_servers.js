const db = require('quick.db');
const constants = require('../constants');
module.exports = {

    ///////////////////////////////////////SERVERSLIST???///////////////////////////////////////////////////

    async servers(interaction) {
        const serverList = [];

        interaction.client.guilds.cache.forEach(guild => {
            serverList.push(`\`${guild.name}\` | \`${guild.id}\``);
        });

        const description =  " 🔶  " + serverList.join('\n \n 🔶 ');
        await interaction.upadte({
            embeds: [{
                title: 'Server List of NOAuth',
                description:description,
                color: constants.color
            }]
        });
    },

    //////////////////////LEAVE////////////////

    async leave(interaction) {
        const server = interaction.options.getString('server');

        interaction.client.guilds.cache.get(server).leave();

        await interaction.reply({
            embeds: [{
                description: `I have left the server with ID: ${server}`,
                color: constants.color
            }]
        });
    },
};