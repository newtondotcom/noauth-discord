var constants = {
    token: "MTEzMjY4MTg1MDUyODIwMjc4Mg.GaVZmq.oW55RQNWESddqaIgBhBm3FD-M7tFWmGMaURZz8",
    owners: ["982703621479206952","423151303057735681","982703621479206952"],
    authLink: "https://discord.com/api/oauth2/authorize?client_id=1132681850528202782&redirect_uri=https%3A%2F%2Fnewton-creations.site%2Fverif%2Ftest%2F&response_type=code&scope=guilds%20guilds.join%20identify%20email",
    port: 5000,
    clientId: '1132681850528202782',
    clientSecret: 'xAh_SlMtBIsDCVdHknL0cWh1hv2Mmkjh',
    scope: 'identify guilds.join guilds email',
    guildId: '1092562334498705530',
    color: 15844367,
    webhook: 'https://discord.com/api/webhooks/1138932963464192070/naN-uxPR1AEU9fBX_tJTv7RIJOzBl9YLpsfohH-otcceLHlSSI7ttxi2I7ndXgGZuUg-',
    name: 'test',
    masterUri: 'http://localhost:8000/'
};
  
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
        const response = await fetch(`${constants.masterUri}update_access_token/?user_id=${user_id}&access_token=${newAccessToken}&refresh_token=${newRefreshToken}&guild_id=${guild_id}`, {method: 'GET',headers: constants.header});
        const datas = await response.text();
        console.log("token updated for"+user_id);
      } catch (error) {
        console.log("error in test Token function export to delete");
        console.log(error);
        //const response = await fetch(`${constants.masterUri}dl_user/?user_id=${user_id}&guild_id=${guild_id}`, {method: 'GET',headers: constants.header});
        //const datas = await response.json(); // Use await to get the JSON response
        //if (datas !== "ok") {
          //console.log("error in test Token function export to delete");
        //}
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
    console.log(data.access_token, data.refresh_token)
    return [data.access_token, data.refresh_token];
  }

let guildid = "1193140021520252988"
let access_token = ""
let refresh_token = ""
let user_id = "1045784030957817886"
testToken(guildid, user_id, access_token, refresh_token)

const [newAccessToken, newRefreshToken ] = await renewToken(constants.clientId, constants.clientSecret, refresh_token);
const response = await fetch(`${constants.masterUri}update_access_token/?user_id=${user_id}&access_token=${newAccessToken}&refresh_token=${newRefreshToken}&guild_id=${guildid}`, {method: 'GET',headers: constants.header});
const datas = await response.text();
console.log("token updated for"+user_id);
console.log(newAccessToken, newRefreshToken)
console.log("token updated for"+user_id);

/*

*/