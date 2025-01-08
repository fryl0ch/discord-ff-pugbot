import { SlashCommandBuilder } from 'discord.js';

import { pickup } from '../../pickup-game.js'

const minValue = 2;
const maxValue = 16;

export const data = new SlashCommandBuilder()
		.setName('players')
		.setDescription('set the total number of players in the pickup')
	    .addIntegerOption(option =>
	      option.setName('number')
	        .setDescription('The total number of players')
	        .setMinValue(minValue)
	        .setMaxValue(maxValue)
	        .setRequired(true));

export const execute = async function (interaction, options=null) {

	if (interaction.member.displayName !== pickup.admin.displayName)
		return await interaction.reply('you have to be an admin to do that');

	let player_count;

	if (options)
	{
		if (options.number < minValue)
			options.number = minValue;
		else if (options.number > maxValue)
			options.number = maxValue
		player_count = options.number;
	}
	else
	{
		player_count = interaction.options.getInteger('number');
	}

	pickup.players = player_count;

	return await interaction.reply('!players set to ' + player_count);
}