import { REST, Routes } from 'discord.js';
import constants from './constants.js';
import fs from 'fs/promises';
import path from 'path';

const commands = [];

/*
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

/*for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}*/

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(constants.token);

import panel from './commands/panel/panel.js';
commands.push(panel.data.toJSON());

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			//Routes.applicationGuildCommands(constants.clientId, constants.guildId),
			Routes.applicationCommands(constants.clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
