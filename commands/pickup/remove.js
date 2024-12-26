import { SlashCommandBuilder } from 'discord.js';

import { pickup } from '../../pickup-game.js'

export const data = new SlashCommandBuilder()
		.setName('remove')
		.setDescription('remove from the currently running pickup');

export const execute = async function (interaction) {
	await interaction.reply(pickup.remove(interaction.member.displayName));
	if (pickup.pool.pool.length === 0) 
	{
		await interaction.followUp("pool is empty." + pickup.end());
	}
}