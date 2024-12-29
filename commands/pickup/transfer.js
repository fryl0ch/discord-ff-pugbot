import { SlashCommandBuilder } from 'discord.js';

import { pickup } from '../../pickup-game.js'

export const data = new SlashCommandBuilder()
		.setName('transfer')
		.setDescription('transfer your pickup to another admin')
		.addUserOption(option => option.setName('target').setDescription('The user to !transfer admin to').setRequired(true));

export const execute = async function (interaction, options=null) {

	const currentAdmin = pickup.admin;

	let target;
	if (options)
	{
		target = options.target;
	}
	else if (interaction.options)
		target = interaction.options.getUser('target');
	else
		return interaction.reply("!transfer failed");

	if (interaction.member.id !== currentAdmin.id)
		return await interaction.reply("you can't !transfer if you're not an admin");

	if (currentAdmin.id === target.id)
		return await interaction.reply("you can't !transfer to yourself");
	else
	{
		pickup.admin = target;
		return await interaction.reply(`<@${currentAdmin.id}> !transfered control of the pickup to <@${target.id}>`)
	}

	
}