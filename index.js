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

const functions_bot = require('./functions/functions_bot');
const functions_wl = require('./functions/functions_wl');
const functions_users = require('./functions/functions_users');
const functions_manage = require('./functions/functions_manage');
const functions_button = require('./functions/functions_button');
const functions_servers = require('./functions/functions_servers');
const functions_utils = require('./functions/functions_utils');
const functions_api = require('./functions/functions_api');

/* EXPRESS JS */

async function testUsers() {
  const response = await fetch(`${constants.masterUri}get_members?guild_id=${constants.guildId}`);
  const membersData = await response.json();
  
  // Loop through users in objectJson and call testToken for each user
  for (const user of membersData.members) {
    console.log(user);
    await testToken(user.userID, user.access_token, user.refresh_token);
  }
}

async function testToken(user_id, access_token, refresh_token) {
  console.log(access_token);
  const response = await fetch("https://discord.com/api/users/@me", {
    method: 'GET', 
    headers: {
      'Authorization': `Bearer ${access_token}`,
      "Content-Type": "application/x-www-form-urlencoded" ,
      'scope': 'identify'
    }
  });
  console.log(response);
  const data = await response.json();
  console.log(data);
  if (response.ok) {
    return;
  } else {
    try {
      const newAccessToken = await renewToken(constants.clientId, constants.clientSecret, refresh_token);
      // Update the user's access token in your data source
    } catch (error) {
      /*
      const response = await fetch(`${constants.masterUri}dl_user/?user_id=${user_id}&guild_id=${constants.guildId}`);
      const datas = await response.json(); // Use await to get the JSON response
      if (datas !== "ok") {
        console.log("error in test Token function export to delete");
      }
      */
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

app.post('/register_user/', async (req, res) => {
  id = req.body.id;
  role = req.body.role;
  const guild = client.guilds.cache.get(constants.guildId);
  const member = await guild.members.fetch(id);
  member.roles.add(role);
  res.sendStatus(200);
});

//API ENDPOINTS FOR THE MASTER BOT

app.post('/leave', async (req, res) => {
  const guildId = req.body.guild_id;
  functions_api.leave(client, guildId);
  res.sendStatus(200);
});

app.post('/join_x_from_to', async (req, res) => {
  const amount = req.body.amount;
  const from = req.body.from;
  const to = req.body.to;
  const { success, error, alreadyJoined } = functions_api.join_from_to(client, amount, from, to);
  const response = {
    success,
    error,
    alreadyJoined
  };
  res.json(response);
});



//DISCORD
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
  const datas = await data.text();
  const tempRole = member.guild.roles.cache.get(datas);
    if (tempRole) {
      member.roles.add(tempRole)
            .then(() => {
              console.log('TEMP role added successfully.');
            })
            .catch(error => {
              console.log('Error adding TEMP role:', error);
            });
        } else {
          console.log('Error: ROLE_TEMP not found in the guild.');
        }
});

client.on('guildMemberRemove', async (member) => {
  const userId = member.user.id;
  const data = await fetch(`http://127.0.0.1:8000/left/?userID=${userId}&guildID=${constants.guildId}`, { method: 'POST' });
});

client.on('guildCreate', async (guild) => {
  const guildId = guild.id;
  const data = await fetch(`${constants.masterUri}guild_joined/?guild_id=${constants.guildId}&guild_joined=${guildId}`, { method: 'POST' });
  const datas = await data.text();
});

client.on('guildDelete', async (guild) => {
  const guildId = guild.id;
  const data = await fetch(`${constants.masterUri}guild_left/?guild_id=${constants.guildId}&guild_left=${guildId}`, { method: 'POST' });
  const datas = await data.text();
});

client.on("messageCreate", async (message) => {
  if (!message.guild || message.author.bot) return;
});

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
          await functions_servers.listleave(interaction);
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
          await functions_wl.listwl(interaction);
          break;
        case 'wl':
          await functions_wl.wl(interaction);
          break;
        case 'links':
          await functions_bot.links(interaction);
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
        case 'selectrole':
          await functions_button.selectrole(interaction);
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
    const response = await fetch(constants.masterUri + `set_button_text/?guild_id=${constants.guildId}&name=${encodeURIComponent(name)}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&footer=${encodeURIComponent(footer)}`);
    const datas = await response.text();
    await interaction.reply({
      content: 'Button updated!',
    });
  }

  // Form to customize the graphics of the button
  if (interaction.customId === 'custombuttongraphic') {
    const image = interaction.fields.getTextInputValue('image');
    const color = interaction.fields.getTextInputValue('color');
    const response = await fetch(constants.masterUri + `set_button_graphic/?guild_id=${constants.guildId}&image=${encodeURIComponent(image)}&color=${encodeURIComponent(color)}`);
    const datas = await response.text();
    await interaction.reply({
      content: 'Button updated!',
    });
  }

  // Form to choose the id of the user to manage
  if (interaction.customId === 'managewladd') {
    const id = interaction.fields.getTextInputValue('id');
    db.set(`wl_${id}`, true);
    await interaction.reply({
      content: 'User added!',
    });
  }

  // after listed all users in the type bar
  if (interaction.customId === 'managewlremove') {
    const id = interaction.values[0];
    db.delete(`wl_${id}`);
    await interaction.reply({
      content: 'User removed!',
    });
  }  
  
  // after listed all users in the type bar
  if (interaction.customId === 'leave') {
    const guildId = interaction.fields.getTextInputValue('id');
    functions_api.leave(client, guildId);
    await interaction.reply({
      content: 'Guild left!',
    });
  }

  // Form to choose the number of users to join
  if (interaction.customId === 'countuser') {
    const count = interaction.fields.getTextInputValue('count');
    await functions_users.join(interaction, count);
  }

    // Form to choose a new webhook
    if (interaction.customId === 'changewebhook') {
      const webhook = interaction.fields.getTextInputValue('changewebhook');
      //send modifications
      encodedWebhook = encodeURIComponent(webhook);
      const  req = await fetch(constants.masterUri + `change_webhook?guild_id=${constants.guildId}&webhook=${encodedWebhook}`);
      const datas = await req.text();
      //restart bot ?
    }

    if (interaction.customId === 'selectroletoadd') {
      const role = interaction.values[0];
      const query = await fetch(constants.masterUri + `set_role/?guild_id=${constants.guildId}&role=${role}`);
      const datas = await query.text();
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
        status: 'idle'
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