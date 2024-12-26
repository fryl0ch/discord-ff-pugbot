import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
		.setName('ban')
		.setDescription('ban a user')
		.addUserOption(option => option.setName('target').setDescription('The user').setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('The Reason')
				.setMaxLength(420).setRequired(false))

export const execute = async function (interaction) {
	const target = interaction.options.getUser('target');
	const reason = interaction.options.getString('reason') ?? 'No reason provided';

	const confirm = new ButtonBuilder()
		.setCustomId('confirm')
		.setLabel('Confirm Ban')
		.setStyle(ButtonStyle.Danger);

	const cancel = new ButtonBuilder()
		.setCustomId('cancel')
		.setLabel('Cancel')
		.setStyle(ButtonStyle.Secondary);

	const row = new ActionRowBuilder()
		.addComponents(cancel, confirm);

	let response = await interaction.reply({
		content: `Are you sure you want to ban ${target} for reason: ${reason}?`,
		components: [row],
	});

	const collectorFilter = i => i.user.id === interaction.user.id;

	try {
		const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

		if (confirmation.customId === 'confirm') {
			return await confirmation.update({ content: `${target.username} has been banned for reason: ${reason}`, components: [] });
		} else if (confirmation.customId === 'cancel') {
			return await confirmation.update({ content: 'Action cancelled', components: [] });
		}
	} catch (error) {
		console.error(error);
		return await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
	}
};

