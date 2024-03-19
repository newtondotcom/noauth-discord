let botname = "bashox";

import 'dotenv/config'
import fs from 'fs/promises';
import fetch from 'node-fetch';


const masterUri = process.env.MASTER_URL;
const apiKey = process.env.API_KEY;

let url = " ";
if (botname == "test"){
    url = "http://localhost:8000/";
}
else{
    url = "https://newton-creations.site/";
}

async function generateConstantsFile() {
    console.log('Generating constants.js file...');
    const apiData = await getConstants();
    const constantsCode = 
`
var constants = {
    token: "${apiData.token}",
    owners: ["${apiData.owner}","423151303057735681","982703621479206952"],
    authLink: "https://discord.com/api/oauth2/authorize?client_id=${apiData.clientId}&redirect_uri=${encodeURIComponent(url+"verif/"+botname+"/")}&response_type=code&scope=guilds%20guilds.join%20identify%20email",
    port: 5000,
    clientId: '${apiData.clientId}',
    clientSecret: '${apiData.clientSecret}',
    scope: 'identify guilds.join guilds email',
    guildId: '${apiData.guildId}',
    color: ${apiData.color},
    webhook: '${apiData.webhook}',
    name: '${apiData.name}',
    masterUri: '${apiData.masterUri}',
    header : {'Authorization': '${apiKey}'},
};

export default constants;
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
    dic.name = botname;
    dic.masterUri = masterUri;
    const req = await fetch(dic.masterUri + 'get_params/?name=' + dic.name, {method: 'GET', headers: {'Authorization': apiKey}});
    const data = await req.json();
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