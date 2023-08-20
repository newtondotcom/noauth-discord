const { ComponentType, ModalBuilder,TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const fetch = require('node-fetch'); // Import the fetch library
const db = require('quick.db');
const constants = require('../constants');


module.exports = {

    //////////////////USERS
    async users(interaction) {
        
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
                    title: '<:users:995482295198826547> NOAuth Users:',
                    description: `There are ${data.members.length > 1 ? `\`${data.members.length}\` members` : `\`${data.members.length}\` users in the bot`}\nType command \`links\` to check your OAuth2 link`,
                    color: constants.color
                }]
            });
        } catch (error) {
            console.error(error);
            await interaction.reply("An error occurred while fetching data from the API.");
        }
    },

    ///////////JOIN

    async join(interaction) {
            
        if (db.get(`wl_${interaction.user.id}`) !== true && !constants.owners.includes(interaction.user.id)) {
                await interaction.reply("You don't have permission to use this command.");
                return;
        }

        let msg = await interaction.reply({
                    content: '**Joining users...**'
        });

            try {
                const response = await fetch(`${constants.masterUri}/get_members?guild_id=${constants.guildId}&amount=${amount}`);
                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
            }

                const json = await response.json();
                let error = 0;
                let success = 0;
                let alreadyJoined = 0;

                for (const userData of json.members) {
                    const user = await interaction.client.users.fetch(userData.userID).catch(() => {});
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

        //// SELECT COUNT JOIN
        async selectjoin(interaction) {
            const modal = new ModalBuilder()
                .setCustomId('countuser')
                .setTitle('Final step');
        
            const count = new TextInputBuilder()
                .setCustomId('count')
                .setLabel("Number of people you want to join")
                .setStyle(TextInputStyle.Short)
        
            const countActionRow = new ActionRowBuilder().addComponents(count);
        
            modal.addComponents(countActionRow);
        
            // Reply to the interaction with the modal
            await interaction.showModal(modal);
        },
        

/////////////////JOINALL

async joinall(interaction) {
        
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