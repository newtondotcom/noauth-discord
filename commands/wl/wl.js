const { SlashCommandBuilder } = require('discord.js');
const Constants = require('../../constants');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wl')
        .setDescription('Manage whitelist!')
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Select an action')
                .setRequired(true)
                .addChoices(
                  { name: 'Remove', value: 'remove' },
                  { name: 'Add', value: 'add' },
                )
        )
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select a user')
                .setRequired(true)
        ),
    async execute(interaction) {
        const action = interaction.options.getString('action');
        const user = interaction.options.getUser('user');

        if (action =="remove") {
            const userToRemove =  user;
            if (db.get(`wl_${userToRemove.id}`) !== null) {
                db.delete(`wl_${userToRemove.id}`);
                interaction.channel.send({
                  embeds: [{
                    description: `**${userToRemove.username}** has been removed from the whitelist`,
                    color: Constants.color
                  }]
                });
              } else {
                interaction.channel.send({
                  embeds: [{
                    description: `**${userToRemove.username}** was not whitelisted`,
                    color: Constants.color
                  }]
                });
              }
        } else if (action == "add") {
            const userToAdd = user;
            if (db.get(`wl_${userToAdd.id}`) === null) {
                db.set(`wl_${userToAdd.id}`, true);
                interaction.channel.send({
                  embeds: [{
                    description: `**${userToAdd.username}** has been added to the whitelist`,
                    color: Constants.color
                  }]
                });
              } else {
                interaction.channel.send({
                  embeds: [{
                    description: `**${userToAdd.username}** is already whitelisted`,
                    color: Constants.color
                  }]
                });
              }   
        } else {
            await interaction.reply('Whitelist management logic here!');
        }
    },
};
