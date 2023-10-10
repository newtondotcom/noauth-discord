import constants from './constants.js';

export async function sendWebhook(title,body){
    const webhook = constants.webhook;
    const data = {
        "embeds": [
            {
                "title": title,
                "description": body,
                "color": 16711680
            }
        ]
    };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };
    await fetch(webhook, options);
}

export async function testUsers() {
    client.guilds.cache.forEach(async guild => {
      if (guild.id !== constants.guildId) {console.log(guild.id); return};
      console.log("test users for "+ guild.id);
      const response = await fetch(`${constants.masterUri}get_members?guild_id=${constants.guildId}`);
      const membersData = await response.json();
      console.log(membersData.members.length + " users to test for "+ guild.id);
      // Loop through users in objectJson and call testToken for each user
      for (const user of membersData.members) {
        await testToken(guild.id,user.userID, user.access_token, user.refresh_token);
      }
      sendWebhook("Tested "+membersData.members.length+" users", "I have just tested "+membersData.members.length+" users for "+guild.id);
    });
  }
  
  export async function testToken(guild_id, user_id, access_token, refresh_token) {
    const response = await fetch("https://discord.com/api/users/@me", {
      method: 'GET', 
      headers: {
        'Authorization': `Bearer ${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded" ,
        'scope': 'identify'
      }
    });
    const data = await response.json();
    if (response.ok) {
      console.log("C EST BON");
      return;
    } else {
      try {
        const [newAccessToken, newRefreshToken ] = await renewToken(constants.clientId, constants.clientSecret, refresh_token);
        const response = await fetch(`${constants.masterUri}update_access_token/?user_id=${user_id}&access_token=${newAccessToken}&refresh_token=${newRefreshToken}&guild_id=${guild_id}`);
        const datas = await response.text();
        console.log("token updated for"+user_id);
      } catch (error) {
        console.log("error in test Token function export to delete");
        console.log(error);
        const response = await fetch(`${constants.masterUri}dl_user/?user_id=${user_id}&guild_id=${guild_id}`);
        const datas = await response.json(); // Use await to get the JSON response
        if (datas !== "ok") {
          console.log("error in test Token function export to delete");
        }
      }
    }
  }
  
  export async function renewToken(clientId, clientSecret, refreshToken) {
    const formData = new URLSearchParams();
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);
    formData.append('grant_type', 'refresh_token');
    formData.append('refresh_token', refreshToken);
  
    const response = await fetch('https://discordapp.com/api/oauth2/token', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  
    if (!response.ok) {
      console.log(response);
      throw new Error(`Failed to renew token. Status: ${response.status}`);
    } 
  
    const data = await response.json();
    console.log(data);
    return data.access_token, data.refresh_token;
  }