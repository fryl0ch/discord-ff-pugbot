import { SlashCommandBuilder } from 'discord.js';

import { pickup } from '../../pickup-game.js'

export const data = new SlashCommandBuilder()
		.setName('pickup')
		.setDescription('start a pickup');

export const execute = async function (interaction) {
	pickup.start();
	await interaction.reply('pickup started');
}