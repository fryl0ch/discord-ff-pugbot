import { SlashCommandBuilder } from 'discord.js';

import { pickup } from '../../pickup-game.js'

export const data = new SlashCommandBuilder()
		.setName('maps')
		.setDescription('show the nominated maps of the current pickup');

export const execute = async function (interaction) {
	if (pickup.started)
		await interaction.reply(JSON.stringify(pickup.nominated));
	else
		return await interaction.reply('no pickup is currently running. type /pickup to start one');
}