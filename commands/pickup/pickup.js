import { SlashCommandBuilder } from 'discord.js';

import { pickup } from '../../pickup-game.js'
import add from './add.js';

export const data = new SlashCommandBuilder()
		.setName('pickup')
		.setDescription('start a pickup');

export const execute = async function (interaction) {
	pickup.start();
	return await add.execute(await interaction.reply('pickup started'));
}