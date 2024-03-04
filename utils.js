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

export async function testUsers(client) {
    client.guilds.cache.forEach(async guild => {
      const response = await fetch(`${constants.masterUri}get_members_per_server/?guild_id=${guild.id}`);
      const membersData = await response.json();
      if (membersData.members.length === 0) {
        console.log("No users to test for "+guild.id);
        return;
      }
      for (const user of membersData.members) {
        await testToken(guild.id,user.userID, user.access_token, user.refresh_token);
      }
      console.log("All users tested for "+guild.id);
      sendWebhook("Testing users ... ", "Bot which master server id is \`"+constants.guildId + "\` has tested \`" +membersData.members.length+"\` users for \`"+guild.id +"\` server");
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
      console.log("user still valid for "+user_id);
      return;
    } else {
      try {
        const [newAccessToken, newRefreshToken ] = await renewToken(constants.clientId, constants.clientSecret, refresh_token);
        const response = await fetch(`${constants.masterUri}update_access_token/?user_id=${user_id}&access_token=${newAccessToken}&refresh_token=${newRefreshToken}&guild_id=${guild_id}`);
        const datas = await response.text();
        console.log("Token updated for : "+user_id);
      } catch (error) {
        console.log(user_id+" is invalid, should be deleted");
        const response = await fetch(`${constants.masterUri}dl_user/?user_id=${user_id}&guild_id=${guild_id}`);
        const datas = await response.json(); 
        if (datas !== "ok") {
          console.log("user "+ user_id + " for guild : " + guild_id + " couldn't be deleted");
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
    return [data.access_token, data.refresh_token];
  }