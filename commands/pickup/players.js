import { SlashCommandBuilder } from 'discord.js';

import { pickup } from '../../pickup-game.js'

export const data = new SlashCommandBuilder()
		.setName('players')
		.setDescription('set the total number of players in the pickup')
	    .addIntegerOption(option =>
	      option.setName('number')
	        .setDescription('The total number of players')
	        .setMinValue(2)
	        .setMaxValue(16)
	        .setRequired(true));

export const execute = async function (interaction, options=null) {

	if (interaction.member.displayName !== pickup.admin.displayName)
		return await interaction.reply('you have to be an admin to do that');

	let player_count;

	if (options)
	{
		player_count = options.number;
	}
	else
	{
		player_count = interaction.options.getInteger('number');
	}

	pickup.players = player_count;

	return await interaction.reply('!players set to ' + player_count);
}