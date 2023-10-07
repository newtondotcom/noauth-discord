import { ComponentType, ModalBuilder,TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';
import db from 'quick.db';
import constants from '../constants.js';

export default {

    async help(interaction) {
        if (db.get(`wl_${interaction.user.id}`) !== true && !constants.owners.includes(interaction.user.id)) {
            await interaction.reply("You don't have permission to use this command.");
            return;
        }
        await interaction.update({
            components: [],
            embeds: [{
                color: 0xff8000 ,
                title: `NOAuth Dashboard`,
                description: '**Prefix :** `;` or `/`\n**Bring all users :** `joinall`\n **Users list :** `users`\n **Bot links :** `Links`\n **Create a verification message :** `button`\n **whitelist user :** `wl`\n **Check whitelisted users:** `listwl`\n **Make your bot leave a server :** `leave`',
            }]
        });
    },

    async changewebhook(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('changewebhook')
            .setTitle('Final step');

        // Create TextInputBuilders
        const webhook = new TextInputBuilder()
            .setCustomId('changewebhook')
            .setLabel("Webhook link")
            .setStyle(TextInputStyle.Short);

        // Create ActionRowBuilders for each TextInputBuilder
        const ActionRow = new ActionRowBuilder().addComponents( webhook);

        // Add each ActionRowBuilder to the modal
        modal.addComponents(ActionRow);

        // Reply to the interaction with the modal
        await interaction.showModal(modal);
    },

    ///////////////CLOSEMENU

    async closemenu(interaction) {
        if (db.get(`wl_${interaction.user.id}`) !== true && !constants.owners.includes(interaction.user.id)) {
            await interaction.reply("You don't have permission to use this command.");
            return;
        }
        await interaction.message.delete();
    },

}