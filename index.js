const {Client, Events, Collection, ActivityType} = require('discord.js');
const client = new Client({
  intents: 32767,
});
const db = require('quick.db');
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

const functions_bot = require('./functions/functions_bot');
const functions_wl = require('./functions/functions_wl');
const functions_users = require('./functions/functions_users');
const functions_manage = require('./functions/functions_manage');
const functions_button = require('./functions/functions_button');
const functions_servers = require('./functions/functions_servers');
const functions_utils = require('./functions/functions_utils');

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.customId === 'selectCommand' || interaction.customId === 'selectCustom' || interaction.customId === 'selectUser'|| interaction.customId === 'selectBot'){
    const commandI = interaction.values[0];
    console.log(commandI)
    try {
      switch (commandI) {
        case 'help':
          await functions_utils.help(interaction);
          break;
        case 'servers':
          await functions_servers.servers(interaction);
          break;
        case 'button':
          await functions_button.button(interaction);
          break;
        case 'custombuttongraphic':
          await functions_button.custombuttongraphic(interaction);
          break;
        case 'custombuttontext':
          await functions_button.custombuttontext(interaction);
          break;
        case 'managecustom':
          await functions_button.managecustom(interaction);
          break;
        case 'leave':
          await functions_servers.leave(interaction);
          break;
        case 'managebot':
          await functions_manage.managebot(interaction);
          break;
        case 'manageuser':
          await functions_manage.manageuser(interaction);
          break;
        case 'managewl':
          await functions_manage.managewl(interaction);
          break;
        case 'managewladd':
          await functions_manage.managewladd(interaction);
          break;
        case 'managewlremove':
          await functions_manage.managewlremove(interaction);
          break;
        case 'users':
          await functions_users.users(interaction);
          break;
        case 'listwl':
          await functions_listwl.listwl(interaction);
          break;
        case 'wl':
          await functions_wl.wl(interaction);
          break;
        case 'links':
          await functions_bot.links(interaction);
          break;
        case 'join':
          await functions_users.join(interaction);
          break;
        case 'selectjoin':
          await functions_users.selectjoin(interaction);
          break;
        case 'joinall':
          await functions_users.joinall(interaction);
          break;
        case 'changewebhook':
          await functions_utils.changewebhook(interaction);
          break;
        case 'closemenu':
          await functions_utils.closemenu(interaction);
          break;
        case 'changewebhook':
          await functions_utils.changewebhook(interaction);
        case 'panel':
          const command = interaction.client.commands.get('panel');
          if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
          }
          await command.execute(interaction);
          break;
        default:
          console.error(`Unknown command: ${commandI}`);
      }
    } catch (error) {
      console.error(error);
    }
  }
    

  // Form to customize the texts of the button
  if (interaction.customId === 'custombuttontext') {
    const name = interaction.fields.getTextInputValue('name');
    const title = interaction.fields.getTextInputValue('title');
    const description = interaction.fields.getTextInputValue('description');
    const footer = interaction.fields.getTextInputValue('footer');
    console.log(name, title, description, footer);
  }

  // Form to customize the graphics of the button
  if (interaction.customId === 'custombuttongraphic') {
    const image = interaction.fields.getImageInputValue('image');
    const color = interaction.fields.getColorInputValue('color');
    console.log(image, color);
  }

  // Form to choose the id of the user to manage
  if (interaction.customId === 'managewladd') {
    const id = interaction.fields.getTextInputValue('id');
    console.log(id);
  }

  // after listed all users in the type bar
  if (interaction.customId === 'managewlremove') {
    const id = interaction.values[0];
    db.delete(id);
    console.log(id);
  }

  // Form to choose the number of users to join
  if (interaction.customId === 'countuser') {
    const count = interaction.fields.getTextInputValue('count');
    console.log(count);
  }

    // Form to choose a new webhook
    if (interaction.customId === 'changewebhook') {
      const webhook = interaction.fields.getTextInputValue('changewebhook');
      console.log(webhook);

      //send modifications

      //restart bot ?
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