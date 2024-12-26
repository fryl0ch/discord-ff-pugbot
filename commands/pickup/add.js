import { SlashCommandBuilder } from 'discord.js';

import { pickup } from '../../pickup-game.js'

export const data = new SlashCommandBuilder()
		.setName('add')
		.setDescription('add to the currently running pickup');

export const execute = async function (interaction) {
	return await interaction.reply(pickup.add(interaction.member.displayName));
}

export const add = execute;