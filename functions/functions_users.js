import { ModalBuilder,TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';
import constants from '../constants.js';


export default {

    //////////////////USERS
    async users(interaction) {

        try {
            // Fetch data from the API
            const response = await fetch(constants.masterUri + 'get_members?guild_id=' + interaction.guildId);
            const response2 = await fetch(constants.masterUri + 'get_members_count?guild_id=' + interaction.guildId);
            if (!response.ok) {
                throw new Error(`Failed to fetch data from the API. Status: ${response.status}`);
            }

            const data = await response.json();
            const text = data.members.splice(0,50).map((member) => `<@${member.userID}>`).join(' ');

            const data2 = await response2.json();
            const count = data2.count

            await interaction.update({
                content: `**NOAuth Users:**\n${text}`,
                embeds: [{
                    title: '💪 NOAuth Users:',
                    description: `🎯 There are \`${data.members.length}\` users in the this server and \`${count}\` users in your NOAuth database splited accross all your servers.`,
                    color: constants.color
                }]
            });
        } catch (error) {
            console.error(error);
            await interaction.update("An error occurred while fetching data from the API.");
        }
    },

    ///////////JOIN

    async join(interaction,amount) {
            
        if (!constants.owners.includes(interaction.user.id)) {
                await interaction.update("You don't have permission to use this command.");
                return;
        }

        let msg = await interaction.update({
                    content: '**Joining users...**'
        });

            try {
                const response = await fetch(`${constants.masterUri}get_members?guild_id=${constants.guildId}&amount=${amount}`);
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
                        title: '🧑 NOAuth Joinall Command',
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
    
    let msg = await interaction.update({
        content: '**Joining users...**'
    });
    
    try {
        const response = await fetch(`${constants.masterUri}get_members/?guild_id=${constants.guildId}`);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
    
        const json = await response.json();
        let error = 0;
        let success = 0;
        let alreadyJoined = 0;

        console.log("We fetched " + json.members.length + " users from the API");
    
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
            }).then(() => {
                success++;
                console.log("Joined " + user.username + " in the server : "+interaction.guild.name);
            });

            await new Promise(r => setTimeout(r, 1000));
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