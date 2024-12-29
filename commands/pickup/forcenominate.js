import { SlashCommandBuilder } from 'discord.js';

import { pickup } from '../../pickup-game.js'

export const data = new SlashCommandBuilder()
		.setName('forceenominate')
		.setDescription('force !nominate a map for a user')
		.addStringOption(option =>
	      option.setName('map')
	        .setDescription('The name of the map you want to nominate')
	        .setMaxLength(420)
	        .setRequired(true))
		.addUserOption(option => option.setName('target').setDescription('The user to !nominate as').setRequired(true));

export const execute = async function (interaction, options=null) {
	let map;
	const target = interaction.options.getUser('target');

	if (options)
	{
		map = options.map;
	}
	else
	{
		map = interaction.options.getString('map');
	}

	let nominator = target.displayName;
	return await interaction.reply(pickup.nominate(map,nominator));
}