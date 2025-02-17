import { SlashCommandBuilder } from 'discord.js';

import { pickup } from '../../pickup-game.js'

export const data = new SlashCommandBuilder()
		.setName('nominate')
		.setDescription('nominate a map')
		.addStringOption(option =>
	      option.setName('map')
	        .setDescription('The name of the map you want to nominate')
	        .setMaxLength(420)
	        .setRequired(true));

export const execute = async function (interaction, options=null) {
	let map;
	if (options)
	{
		map = options.map;
	}
	else
	{
		map = interaction.options.getString('map');
	}

	let nominator = interaction.member.displayName;
	return await interaction.reply(pickup.nominate(map,nominator));
}