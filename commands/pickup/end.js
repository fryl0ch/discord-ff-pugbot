import { SlashCommandBuilder } from 'discord.js';

import { pickup } from '../../pickup-game.js'

export const data = new SlashCommandBuilder()
		.setName('end')
		.setDescription('end the currently running pickup');

export const execute = async function (interaction) {
	await interaction.reply(pickup.end());
}