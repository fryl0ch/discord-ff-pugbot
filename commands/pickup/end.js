import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js';

import { pickup } from '../../pickup-game.js'

export const data = new SlashCommandBuilder()
		.setName('end')
		.setDescription('end the currently running pickup');

export const execute = async function (interaction) {
	let ender = interaction.member;

	if (ender.id === pickup.admin.id)
		await interaction.reply(pickup.end());
	else
	{
		let vetoMessage = `<@${pickup.admin.id}>, <@${interaction.member.id}> is trying to end your pickup! You have 30 seconds to veto or the pickup will end.`;

		let admin_response = await veto(vetoMessage, interaction);

		if (admin_response) 
			return; //without !end ing
		else
			await interaction.reply(pickup.end());
	}
}


export const veto = async function (thingToVeto, interaction) {
	const confirm = new ButtonBuilder()
		.setCustomId('veto')
		.setLabel('!veto')
		.setStyle(ButtonStyle.Danger);

	const row = new ActionRowBuilder()
		.addComponents(confirm);

	let response = await interaction.reply({
		content: thingToVeto,
		components: [row],
	});

	const collectorFilter = i => i.user.id === pickup.admin.id;

	try {
		const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });

		if (confirmation.customId === 'veto') {
			await response.edit({ content: `!end has been !vetoed by ${pickup.admin.displayName}`, components: [] });
			return true;
		} else if (confirmation.customId === 'cancel') {
			await response.delete();
			return false;
		}
	} catch (error) {
		console.error(error);
		await response.delete();
		return false;
	}
};

