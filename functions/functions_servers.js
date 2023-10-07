import {ModalBuilder,TextInputBuilder, TextInputStyle , ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import db from 'quick.db';
import constants from '../constants.js';
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

        // Create TextInputBuilders
        const name = new TextInputBuilder()
            .setCustomId('id')
            .setLabel("What's the ID?")
            .setStyle(TextInputStyle.Short);

        // Create ActionRowBuilders and add TextInputBuilders to them
        const nameActionRow = new ActionRowBuilder().addComponents(name);
        
        // Add each ActionRowBuilder to the modal
        modal.addComponents(nameActionRow);

        // Reply to the interaction with the modal
        await interaction.showModal(modal);
    },
};