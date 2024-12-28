import { SlashCommandBuilder } from 'discord.js';

import { pickup } from '../../pickup-game.js'

export const data = new SlashCommandBuilder()
		.setName('remove')
		.setDescription('remove from the currently running pickup');

export const execute = async function (interaction) {
	let reply = await interaction.reply(pickup.remove(interaction.member.displayName));
	if (pickup.pool.pool.length === 0) 
	{
		await reply.reply("pool is empty. " + pickup.end());
	}
}