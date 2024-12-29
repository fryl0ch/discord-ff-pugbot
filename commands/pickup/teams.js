import { SlashCommandBuilder } from 'discord.js';

import { pickup } from '../../pickup-game.js'

export const data = new SlashCommandBuilder()
		.setName('teams')
		.setDescription('view the current teams (or pool) of the current pickup');

export const execute = async function (interaction) {
	if (pickup.started)
	{
		let response;
		if (pickup.isFull())
		{
			const red = "### RED TEAM (defense):\n" + pickup.pool.red;
			const blue = "### BLUE TEAM (offense):\n" + pickup.pool.blue;
			response = `${red}\n${blue}`;
			
		}
		else
			if (pickup.pool.pool.length > 0)
				response = `### POOL ${pickup.pool.pool.length}/${pickup.players}\n` + pickup.pool.pool;
			else
				response = "no one has added to the pickup yet";

		return await interaction.reply(response);

	}
	else
		return await interaction.reply('no pickup is currently running. type /pickup to start one');
}