import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js';

import { pickup } from '../../pickup-game.js'

export const data = new SlashCommandBuilder()
		.setName('end')
		.setDescription('end the currently running pickup');

export const execute = async function (interaction) {
	let ender = interaction.member;

	if (ender.username !== pickup.admin.username)
	{
		let vetoMessage = `@${interaction.member.displayName} is trying to end your pickup! You have 30 seconds to veto or the pickup will end.`

		let admin_response = await veto(vetoMessage, interaction);

		if (admin_response) return; //without !end ing
	}
	
	await interaction.reply(pickup.end());
}


export const veto = async function (thingToVeto, interaction) {
	const confirm = new ButtonBuilder()
		.setCustomId('veto')
		.setLabel('Veto')
		.setStyle(ButtonStyle.Danger);

	const cancel = new ButtonBuilder()
		.setCustomId('cancel')
		.setLabel('!end')
		.setStyle(ButtonStyle.Secondary);

	const row = new ActionRowBuilder()
		.addComponents(cancel, confirm);

	let response = await interaction.reply({
		content: thingToVeto,
		components: [row],
	});

	const collectorFilter = i => i.user.id === pickup.admin.id;

	try {
		const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });

		if (confirmation.customId === 'veto') {
			await response.edit({ content: `!end has been vetoed by ${pickup.admin.displayName}`, components: [] });
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

