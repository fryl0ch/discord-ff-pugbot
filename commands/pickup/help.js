import fs from 'node:fs';
import path from 'node:path';
import Module from "node:module";
const require = Module.createRequire(import.meta.url);
const __dirname = import.meta.dirname;
import { SlashCommandBuilder } from 'discord.js';

const command_aliases = require('../../command-aliases.json');

export const data = new SlashCommandBuilder()
		.setName('help')
		.setDescription('view the list of available commands')
		.addStringOption(option =>
      option.setName('command')
        .setDescription('command to get more info about'));

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, '..', '..', 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // Grab all the command files from the commands directory you created earlier
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    if (file !== "help.js")
    {
	    const command = require(filePath);
	    if ('data' in command && 'execute' in command) {
	      commands.push(command.data.toJSON());
	    } else {
	      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	    }
		}
  }
}

export const execute = async function (interaction, options=null) {
	let response;

	let cmd;

	if (options || interaction.options)
	{
		if (options)
		{
			cmd = options.cmd;
		}
		if (interaction.options)
		{
			cmd = interaction.options.getString('command');
		}

		let command = commands.find((command) => command.name === cmd);
		response = "!" + command.name + ' - ' + command.description + "\n";
		if (command_aliases[command.name])
			response += "\t\taliases: " + command_aliases[command.name] + "\n";
		await interaction.reply(response);
	}
	else
	{
		response = "available commands:\n";

		for (let command of commands)
		{
			response += "!" + command.name + ' - ' + command.description + "\n";
		}
		await interaction.reply(response);
	}
}