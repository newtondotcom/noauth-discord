import { ButtonBuilder, ActionRowBuilder } from 'discord.js';
import constants from '../constants.js';
import fetch from 'node-fetch';


export default{
    async links(interaction) {
        const client = interaction.client; 
        const authButton = new ButtonBuilder()
            .setLabel('NOAuth Link 📩')
            .setURL(constants.authLink)
            .setStyle(5);

        const inviteButton = new ButtonBuilder()
            .setLabel('Bot Invite 🤖')
            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`)
            .setStyle(5);

        const actionRow = new ActionRowBuilder()
            .addComponents(authButton, inviteButton);

        await interaction.update({
            embeds: [{
                title: 'NOAuth/Invite 🖇️',
                description: '**```Right click on the button below for copy your NOAuth or Invite Bot link```**\n',
                color: 0xff8000 
            }],
            components: [actionRow]
        });
    },
};