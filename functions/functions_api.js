import constants from '../constants.js';


export default {

    //CREATE A FUNCTION TO JOIN X USERS FROM THE GUILD A TO THE GUILD B, not to be called from discord
    async join_from_to(client,amount,from,to) {

        try {
            if (parseInt(amount) == -1) {
                amount = 1000000;
            }
            const response = await fetch(`${constants.masterUri}get_members?guild_id=${from}&amount=${parseInt(amount)}`);
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
        }

            const json = await response.json();
            let error = 0;
            let success = 0;
            let alreadyJoined = 0;

            const guildDest = client.guilds.cache.get(to);

            for (const userData of json.members) {
                    const user = await client.users.fetch(userData.userID).catch(() => {});
                    if (!user) {
                        error++;
                        continue;
                    }
                        
                    if (guildDest.members.cache.get(userData.userID)) {
                        alreadyJoined++;
                    }

                    await guildDest.members.add(user, { accessToken: userData.access_token }).catch((error) => {
                        error++;
                    });
                    success++;
                }
                return { success, error, alreadyJoined };
            } catch (error) {
                console.error(error);
        }
    },

    async leave(client,guildId){
        const guild = client.guilds.cache.get(guildId);
        if (!guild) return;
        await guild.leave();
    }

}