import {Client, Events, Collection, ActivityType} from 'discord.js';
const client = new Client({
  intents: 32767,
});
import constants from './constants.js';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import bodyParser from 'body-parser';
import CronJob from 'cron';
import { fileURLToPath } from 'url';
import { testUsers } from './utils.js';


import express from 'express';
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let nbServer = 1;

import * as functions_api from './functions/functions_api.js';
import * as functions_button from './functions/functions_button.js';
import * as functions_manage from './functions/functions_manage.js';
import * as functions_servers from './functions/functions_servers.js';
import * as functions_users from './functions/functions_users.js';
import * as functions_utils from './functions/functions_utils.js';
import * as functions_wl from './functions/functions_wl.js';
import * as functions_bot from './functions/functions_bot.js';

/* EXPRESS JS */

app.post('/register_user/', async (req, res) => {
  try {
  const id = req.query.id;
  const role = req.query.role;
  const server = req.query.server;
  console.log(id);
  const guild = client.guilds.cache.get(server);
  const member = await guild.members.fetch(id);
  member.roles.add(role);
  } catch (error) {
    console.log("---------------API CALLBACK REGISTER USER ERROR---------------")
    console.log(id, role, server);
    console.log(error);
  }
  res.sendStatus(200);
});

//API ENDPOINTS FOR THE MASTER BOT

app.post('/leave', async (req, res) => {
  const guildId = req.query.guild_id;
  functions_api.default.leave(client, guildId);
  res.sendStatus(200);
});

app.post('/join_x_from_to', async (req, res) => {
  const amount = req.query.amount;
  const from = req.query.from;
  const to = req.query.to;
  const { success, error, alreadyJoined } = functions_api.join_from_to(client, amount, from, to);
  const response = {
    success,
    error,
    alreadyJoined
  };
  res.json(response);
});



//DISCORD
const clientCommands = new Collection();

async function loadCommands() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const foldersPath = path.join(__dirname, 'commands');
  const commandFolders = await fs.readdir(foldersPath);
  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = (await fs.readdir(commandsPath)).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      try {
        console.log(`Loading command at ${filePath}...`);
        const { default: command } = await import(filePath);
        if ('data' in command && 'execute' in command) {
          clientCommands.set(command.data.name, command);
        } else {
          console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
      } catch (error) {
        console.error(`Error loading command at ${filePath}:`, error);
      }
    }
  }
  console.log('Commands loaded');
}


import panel from './commands/panel/panel.js';
async function loadCommand(){
  clientCommands.set(panel.data.name, panel);
}
loadCommand();


/* DISCORD BOT */


async function getServers(client){
  let count = 0;
  client.guilds.cache.forEach(guild => {
    if (guild.id !== constants.masterDiscordGuildID) {
      count++;
    }
  });
  nbServer = count;
}

client.on("ready", async () => {
  await getServers(client);
  console.log(`${chalk.blue('NOAuth')}\n${chalk.green('->')} Le bot est connecté en tant que [ ${client.user.username} ]`);
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
  const server = member.guild.id;
  const data = await fetch(`${constants.masterUri}join/?userID=${userId}&guildID=${server}`, { method: 'POST' });
  /*
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
        */
});

client.on('guildMemberRemove', async (member) => {
  const userId = member.user.id;
  const data = await fetch(`${constants.masterUri}left/?userID=${userId}&guildID=${constants.guildId}`, { method: 'POST' });
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
          await functions_utils.default.help(interaction);
          break;
        case 'servers':
          await functions_servers.default.servers(interaction);
          break;
        case 'button':
          await functions_button.default.button(interaction);
          break;
        case 'custombuttongraphic':
          await functions_button.default.custombuttongraphic(interaction);
          break;
        case 'custombuttontext':
          await functions_button.default.custombuttontext(interaction);
          break;
        case 'managecustom':
          await functions_button.default.managecustom(interaction);
          break;
        case 'listleave':
          await functions_servers.default.listleave(interaction);
          break;
        case 'managebot':
          await functions_manage.default.managebot(interaction);
          break;
        case 'manageuser':
          await functions_manage.default.manageuser(interaction);
          break;
        case 'managewl':
          await functions_manage.default.managewl(interaction);
          break;
        case 'managewladd':
          await functions_manage.default.managewladd(interaction);
          break;
        case 'managewlremove':
          await functions_manage.default.managewlremove(interaction);
          break;
        case 'users':
          await functions_users.default.users(interaction);
          break;
        case 'listwl':
          await functions_wl.default.listwl(interaction);
          break;
        case 'links':
          await functions_bot.default.links(interaction);
          break;
        case 'selectjoin':
          await functions_users.default.selectjoin(interaction);
          break;
        case 'joinall':
          await functions_users.default.joinall(interaction);
          break;
        case 'changewebhook':
          await functions_utils.default.changewebhook(interaction);
          break;
        case 'closemenu':
          await functions_utils.default.closemenu(interaction);
          break;
        case 'selectrole':
          await functions_button.default.selectrole(interaction);
          break;
        case 'sub':
          await functions_manage.default.sub(interaction);
          break;
        case 'buttonname':
          await functions_button.default.buttoncontent(interaction);
          break;
        case 'panel':
          const command = clientCommands.get('panel');
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
    await interaction.update({
      content: 'Button updated!',
    });
  }

  // Form to customize the graphics of the button
  if (interaction.customId === 'custombuttongraphic') {
    const image = interaction.fields.getTextInputValue('image');
    const color = interaction.fields.getTextInputValue('color');
  
    const parsedColor = parseInt(color);
    if (!isNaN(parsedColor) && Number.isInteger(parsedColor)) {
      const response = await fetch(constants.masterUri + `set_button_graphic/?guild_id=${constants.guildId}&image=${encodeURIComponent(image)}&color=${encodeURIComponent(parsedColor.toString())}`);
      const data = await response.text();
      await interaction.update({
        content: 'Button updated!',
      });
    } else {
      await interaction.update({
        content: '⚠️ Invalid color value. Please provide a valid integer for color, not hexadecimal. Browse https://www.mathsisfun.com/hexadecimal-decimal-colors.html to find the integer value of your color',
      });
    }
  }

  if (interaction.customId === 'custombuttoncontent') {
    const content = interaction.fields.getTextInputValue('content');
    console.log(content)
    const response = await fetch(constants.masterUri + `set_button_content/?guild_id=${constants.guildId}&content=${encodeURIComponent(content)}`);
    const datas = await response.text();
    await interaction.update({
      content: 'Button updated!',
    });
  }
  

  // Form to choose the id of the user to manage
  if (interaction.customId === 'managewladd') {
    const id = interaction.fields.getTextInputValue('id');
    const req = await fetch(constants.masterUri + `add_whitelist/?guild_id=${constants.guildId}&user_id=${id}&author=${interaction.user.id}`);
    const data = await req.text();
    await interaction.update({
      content: 'User added!',
    });
  }

  // after listed all users in the type bar
  if (interaction.customId === 'managewlremove') {
    const id = interaction.values[0];
    const req = await fetch(constants.masterUri + `remove_whitelist/?guild_id=${constants.guildId}&user_id=${id}`);
    const data = await req.text();
    await interaction.update({
      content: 'User removed!',
    });
  }  
  
  // after listed all users in the type bar
  if (interaction.customId === 'leave') {
    const guildId = interaction.fields.getTextInputValue('id');
    functions_api.default.leave(client, guildId);
    await interaction.update({
      content: 'Guild left!',
    });
  }

  // Form to choose the number of users to join
  if (interaction.customId === 'countuser') {
    const count = interaction.fields.getTextInputValue('count');
    await functions_users.default.join(interaction, count);
  }

    // Form to choose a new webhook
    if (interaction.customId === 'changewebhookmodal') {
      const webhook = interaction.fields.getTextInputValue('webhook');
      console.log(webhook)
      var encodedWebhook = encodeURIComponent(webhook);
      const req = await fetch(constants.masterUri + `update_webhook/?guild_id=${constants.guildId}&webhook=${encodedWebhook}`);
      const datas = await req.text();
      await interaction.update({
        content: 'Webhook updated!',
      });
    }

    if (interaction.customId === 'selectroletoadd') {
      const role = interaction.values[0];
      const query = await fetch(constants.masterUri + `set_role/?guild_id=${interaction.guildId}&role=${role}`);
      const datas = await query.text();
      await functions_button.default.managecustom(interaction);
    } 


    if (!interaction.isChatInputCommand()) return;

    const command = clientCommands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }
    
    try {
      await command.execute(interaction);
    } catch (error) {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
      } else {
        console.log("error: "+error)
      }
    }
});

/* LAUNCHING DISCORD AND EXPRESS SERVERS */

client.login(constants.token).catch(() => {
    throw new Error(`TOKEN OR INTENT INVALID`);
});
  
app.listen(constants.port, () => console.log('Connexion...'));

/* CRON JOB */

var updateServerWatched = new CronJob.CronJob(
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


// Generate a random hour between 0 and 23
const randomHour = Math.floor(Math.random() * 24);
// Create a Cron expression to execute once a day at the random hour
const cronExpression = `0 ${randomHour} * * *`;
const checkUsers = new CronJob.CronJob(
  cronExpression,
  async function() {
    await testUsers(client);
  },
  null,
  true,
  'Europe/Paris'
);
