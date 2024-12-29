import { SlashCommandBuilder } from 'discord.js';

import { pickup } from '../../pickup-game.js'

export const data = new SlashCommandBuilder()
		.setName('pickup')
		.setDescription('start a pickup (and !add to it)');

export const execute = async function (interaction) {
	pickup.start(interaction.member);
	await interaction.channel.send('pickup is starting');
	await interaction.reply(pickup.add(interaction.member.displayName));
}