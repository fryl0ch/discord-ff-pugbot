import fs from 'node:fs/promises';
import path from 'node:path';
const __dirname = import.meta.dirname;


import { SlashCommandBuilder } from 'discord.js';

const rulesPath = path.join(__dirname, '..', '..', 'docs', 'rules.md');

export const data = new SlashCommandBuilder()
		.setName('rules')
		.setDescription('view the rules');

export const execute = async function (interaction) {
	const rules = await fs.readFile(rulesPath, { encoding: 'utf8'});
	return await interaction.reply(rules);
}