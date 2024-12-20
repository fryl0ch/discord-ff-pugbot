import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
		.setName('pickup')
		.setDescription('start a pickup');

export const execute = async function (interaction) {
	await interaction.reply('pickup started'); // tbi
}