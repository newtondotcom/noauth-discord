const {Client, Events, Collection, ActivityType} = require('discord.js');
const client = new Client({
  intents: 32767,
});
const constants = require('./constants');
const chalk = require('chalk');
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var CronJob = require('cron').CronJob;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let nbServer = 1;

/* EXPRESS JS */

async function testUsers() {
  const response = await fetch(`${constants.masterUri}/get_members?guild_id=${constants.guildId}`);
  const membersData = await response.json();
  
  // Loop through users in objectJson and call testToken for each user
  for (const user of membersData.members) {
    console.log(user);
    await testToken(user.userID, user.access_token, user.refresh_token);
  }
}

async function testToken(user_id, access_token, refresh_token) {
  console.log(access_token);
  console.log(user_id);
  const response = await fetch("https://discord.com/api/users/@me", {
    method: 'GET', 
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Grant-Type': 'authorization_code',
      'scope': 'identify'
    }
  });
  console.log(response.status);
  if (response.ok) {
    return;
  } else {
    try {
      const newAccessToken = await renewToken(constants.clientId, constants.clientSecret, refresh_token);
      // Update the user's access token in your data source
    } catch (error) {
      const response = await fetch(`http://127.0.0.1:8000/dl_user/?user_id=${user_id}&guild_id=${constants.guildId}`);
      const datas = await response.json(); // Use await to get the JSON response
      if (datas !== "ok") {
        console.log("error in test Token function export to delete");
      }
    }
  }
}

async function renewToken(clientId, clientSecret, refreshToken) {
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


async function getServers(client){
  let count = 0;
  client.guilds.cache.forEach(guild => {
    count++;
  });
  nbServer = count;
}

client.on("ready", async () => {
  await getServers(client);
  console.log(`${chalk.blue('NOAuth')}\n${chalk.green('->')} Le bot est connecté en tant que [ ${client.user.username} ], il utilise comme prefix : ${constants.prefix}\n${chalk.green('->')} L'invite du bot : https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`);
  client.user.setPresence({
    activities: [
      {
        name: nbServer.toString() + " servers",
        type: ActivityType.Watching
      }
    ],
    status: 'online'
  });
});

client.on('guildMemberAdd', async (member) => {
  const userId = member.user.id;
  const data = await fetch(`http://127.0.0.1:8000/join/?userID=${userId}&guildID=${constants.guildId}`, { method: 'POST' });
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
  if (interaction.customId === 'selectCommand') {
    const commandI = interaction.values[0];
    try {
    const command = interaction.client.commands.get(commandI);
    await command.execute(interaction);
    } catch (error) {
      console.error(error);
    }
  }

  if (interaction.customId === 'customButton') {
    const name = interaction.fields.getTextInputValue('name');
    const title = interaction.fields.getTextInputValue('title');
    const description = interaction.fields.getTextInputValue('description');
    const footer = interaction.fields.getTextInputValue('footer');
    console.log(name, title, description, footer);
  }



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
			//await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      console.log("error");
		}
  }
});

/* LAUNCHING DISCORD AND EXPRESS SERVERS */

client.login(constants.token).catch(() => {
    throw new Error(`TOKEN OR INTENT INVALID`);
});
  
app.listen(constants.port, () => console.log('Connexion...'));

/* CRON JOB */

var updateServerWatched = new CronJob(
    '0 */30 * * * *',
    async function() {
      await getServers(client);
      client.user.setPresence({
        activities: [
          {
            name: nbServer.toString() + " servers",
            type: ActivityType.Watching
          }
        ],
        status: 'online'
      });
    },
    null,
    true,
    'Europe/Paris'
);

var checkUsers = new CronJob(
  '0 */30 * * * *',
  async function() {
    await testUsers();
  },
  null,
  true,
  'Europe/Paris'
);

//testUsers();