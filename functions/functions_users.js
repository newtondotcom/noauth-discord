import {ModalBuilder,TextInputBuilder, TextInputStyle, ButtonBuilder , ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import constants from '../constants.js';
import fetch from 'node-fetch';


export default {

    //////////////////USERS
    async users(interaction) {

        try {
            const response = await fetch(constants.masterUri + 'get_members/?guild_id=' + constants.guildId, {method: 'GET',headers: constants.header});
            const response3 = await fetch(constants.masterUri + 'get_revoked/?guild_id=' + constants.guildId, {method: 'GET',headers: constants.header});
            if (!response.ok) {
                throw new Error(`Failed to fetch data from the API. Status: ${response.status}`);
            }

            const data = await response.json();
            const members = data.members;
            const globalMembersCount = members.length;

            const data3 = await response3.json();
            const membersRevoked = data3.revoked;

            await interaction.update({
                content: "",
                embeds: [{
                    title: '💪 NOAuth Users',
                    //**✅ Already in this server :** \`${localGuildCount}\` \n 
                    description: `**🎯 Total :** \`${globalMembersCount}\` \n **🗑️ Revoked :**\`${membersRevoked}\` `,
                    color: constants.color
                }]
            });
        } catch (error) {
            console.error(error);
            await interaction.update({
                content: "An error occurred while fetching data from the API.",
                embeds: []
            });
        }
    },

        async joinspeed(interaction) {
            const selectMenu = new StringSelectMenuBuilder()
                .setPlaceholder('Select an option')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setEmoji('🐢')
                        .setLabel('Slow')
                        .setDescription('each 7s')
                        .setValue('slow'),
                )
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setEmoji('🐇')
                        .setLabel('Fast')
                        .setDescription('each 3s')
                        .setValue('fast'),
                )
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setEmoji('🏎️')
                        .setLabel('Max')
                        .setDescription('each 1s')
                        .setValue('max'),
                )
                .setCustomId('selectspeed');
      
        const row = new ActionRowBuilder().addComponents(selectMenu);
        await interaction.update({ content: 'The **slowest** is the **safest** in terms of Discord Terms of Utilisation.', components: [row] });
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
        await interaction.showModal(modal);
    },


    /////////////////JOIN

    async join(interaction, amount) {

        let msg = await interaction.update({
            content: '**Joining users...**',
            embeds: []
        });
    
    try {
        const response = await fetch(`${constants.masterUri}get_members/?guild_id=${constants.guildId}`, {method: 'GET',headers: constants.header});
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
    
        const json = await response.json();
        let error = 0;
        let success = 0;
        let alreadyJoined = 0;
        let max100 = 0;
        let userNotFound = 0;
        let accountNotVerified = 0;
        let userPerempted = 0;
    
        const speed = constants.speed;
        console.log("We fetched " + json.members.length + " users from the API");

        const cancel = new ButtonBuilder()
        .setCustomId('canceljoin')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
        .addComponents(cancel);

        let userAsked = "";
        if (amount != 0) userAsked = " " + amount + " users asked to join";
        else userAsked = " All users asked to join";

        for (const userData of json.members) {
            if (amount != 0 && success >= amount) break;
            if (constants.pauseJoin && constants.pauseJoin == true) break;
            try {
                const user = await interaction.client.users.fetch(userData.userID).catch(() => { });
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
                            const LocalError = erro.toString();
                            console.log(LocalError);
                            if (LocalError.includes("You are at the 100 server limit.")) max100++;
                            if (LocalError.includes("The user account must first be verified")) accountNotVerified++;
                            if (LocalError.includes("Invalid OAuth2 access token")) userPerempted++;
                        });
                }
                await msg.edit({
                    embeds: [{
                        title: '🧑 NOAuth Joinall',
                        description: `ℹ️ **Already in server**: ${alreadyJoined}\n✅ **Success**: ${success}\n❌ **Error**: ${error}\n __Details__ :\n💯 **100-server Limit**: ${max100}\n🔍 **Users not found**: ${userNotFound}\n🧯 **Accounts not verified**: ${accountNotVerified}\n⚰️ **Users Access Lost**: ${userPerempted}`,
                        color: constants.color
                    }],
                    components: [row]
                });
                const delay = Math.random() * (1000) + speed*1000;
                await new Promise(r => setTimeout(r, delay));
            }
            catch (error) {
                console.error(error);
                error++;
            }
            await msg.edit({
                embeds: [{
                    title: '🧑 NOAuth -' + userAsked,
                    description: `ℹ️ **Already in server**: ${alreadyJoined}\n✅ **Success**: ${success}\n❌ **Error**: ${error}\n __Details__ :\n💯 **100-server Limit**: ${max100}\n🔍 **Users not found**: ${userNotFound}\n🧯 **Accounts not verified**: ${accountNotVerified}\n⚰️ **Users Access Lost**: ${userPerempted}`,
                    color: constants.color
                }]
            });
        }
    
        if (constants.pauseJoin && constants.pauseJoin == true) {
            await msg.edit({
                content: "The join process has been paused.",
                embeds: []
            });
            constants.pauseJoin = false;
        } else {
            await msg.edit({
                content: `**Joined successfully \`${success}\` users**  `,
                embeds: []
            });
        }
    } catch (error) {
        console.log(error);
        await msg.edit({
            content: "An error occurred while fetching data from the API.",
            embeds: []
        });
    }
}
}