const fs = require('fs').promises; // Import the promises version of fs

masterUri = "http://127.0.0.1:8000/"

async function generateConstantsFile() {
    
    console.log('Generating constants.js file...');

    const apiData = await getConstants(); // Fetch data from API

    const constantsCode = `
const constants = {
    token: "${apiData.token}",
    prefix: ";",
    owners: ["${apiData.owner}"],
    authLink: "https://discord.com/api/oauth2/authorize?client_id=1132681850528202782&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fcallback&response_type=code&scope=guilds%20guilds.join%20identify%20email",
    port: 5000,
    clientId: '${apiData.clientId}',
    clientSecret: '${apiData.clientSecret}',
    redirectUri: 'http://localhost:8000/callback',
    scope: 'identify guilds.join guilds email',
    guildId: '${apiData.guildId}',
    color: ${apiData.color},
    webhook: '${apiData.webhook}',
    name: '${apiData.name}',
    masterUri: '${apiData.masterUri}'
};
        
module.exports = constants;
    `;

    try {
        await fs.writeFile('constants.js', constantsCode);
        console.log('constants.js file generated successfully.');
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function getConstants() {
    const dic = {};
    //dic.name = os.hostname();
    dic.name = "test";
    dic.masterUri = masterUri;
    const req = await fetch(dic.masterUri + 'get_params/?name=' + dic.name);
    const data = await req.json();
    console.log(data);
    dic.token = data.token;
    dic.clientId = data.clientId;
    dic.clientSecret = data.clientSecret;
    dic.token = data.token;
    dic.guildId = data.guildId;
    dic.webhook = data.webhook;
    dic.owner = [data.owner];
    dic.color = data.color;
    return dic;
}

generateConstantsFile();