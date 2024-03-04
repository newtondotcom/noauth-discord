import {ModalBuilder,TextInputBuilder, TextInputStyle , ActionRowBuilder} from 'discord.js';
import constants from '../constants.js';
import fetch from 'node-fetch';
export default {

    ///////////////////////////////////////SERVERSLIST???///////////////////////////////////////////////////

    async servers(interaction) {
        const serverList = [];

        interaction.client.guilds.cache.forEach(guild => {
            if (guild.id == constants.masterDiscordGuildID) return;
            serverList.push(`\`${guild.name}\` | \`${guild.id}\``);
        });

        const description =  " 🔶  " + serverList.join('\n \n 🔶 ');
        await interaction.update({
            embeds: [{
                title: 'Server List of NOAuth',
                description:description,
                color: constants.color
            }]
        });
    },

    // MODAL TO GET THE SERVER ID TO LEAVE
    async listleave(interaction) {
        const modal = new ModalBuilder()
        .setCustomId('leave')
        .setTitle('Final step');

        const name = new TextInputBuilder()
            .setCustomId('id')
            .setLabel("What's the ID?")
            .setStyle(TextInputStyle.Short);

        const nameActionRow = new ActionRowBuilder().addComponents(name);
        
        modal.addComponents(nameActionRow);

        await interaction.showModal(modal);
    },
};