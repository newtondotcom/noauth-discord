const {Client, Events, Collection} = require('discord.js');
const Constants = require('./constants');
const client = new Client({
  intents: 32767,
});
const chalk = require('chalk');
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

app.get('/list', async (req, res) => {
  if (req.body.password){
    if (req.body.password==Constants.password){  
      fs.readFile('./object.json', function (err, data) {
      return res.json(JSON.parse(data));
    });
    }
  } else {
    return res.json("Please provide a valid password using : /list?password=YOUR PASSWORD");
  }
});

async function testUsers(){
  const objectData = fs.readFileSync('./object.json');
  const objectJson = JSON.parse(objectData);
  // for loop
    testToken(user.userID,user.access_token,user.refresh_token)
}

async function testToken(user_id,access_token,refresh_token){
  const formData = new URLSearchParams();
  formData.append();
  const response = await fetch("https://discordapp.com/api/users/@me",{
    method: 'POST', 
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization':`Bearer ${access_token}`
    }
  });
  if (response.ok){
    return;
  } else {
    try {
      renewToken(Constants.clientId,Constants.clientSecret,refresh_token)
    } catch (Error){
      const response = fetch(`http://127.0.0.1:8000/dl_user/?user_id=${user_id}&guild_id=${Constants.guildId}`);
      const datas = response.json();
      if (datas!=="ok"){
        console.log("error in test Token function export to delete");
      }
    }
  }
}

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
  } 
  finally {}
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
  client.user.setActivity(Constants.name, {
    type: "WATCHING",
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

client.on('guildMemberRemove', async (member) => {
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
  

/* LAUNCHING DISCORD AND EXPRESS SERVERS */

client.login(Constants.token).catch(() => {
    throw new Error(`TOKEN OR INTENT INVALID`);
});
  
app.listen(Constants.port, () => console.log('Connexion...'));