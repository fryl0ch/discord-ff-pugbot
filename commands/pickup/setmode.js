import { SlashCommandBuilder } from 'discord.js';

import { pickup } from '../../pickup-game.js'

export const data = new SlashCommandBuilder()
		.setName('setmode')
		.setDescription('change the way the map is picked')
		.addStringOption(option =>
	      option.setName('mode')
	        .setDescription('The map pick mode you want to set the pickup to')
	        .setRequired(true)
	        .addChoices(
					{ name: 'vote', value: 'vote' },
					{ name: 'random', value: 'random' },
				));

export const execute = async function (interaction, options=null) {
	let mode;
	if (options)
	{
		mode = options.mode;
	}
	else
	{
		mode = interaction.options.getString('mode');
	}

	return await interaction.reply(pickup.setMode(mode));
}