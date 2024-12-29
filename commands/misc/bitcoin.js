//

import fetch from 'node-fetch';
import { SlashCommandBuilder } from 'discord.js';

const now = function() {
  return (new Date()).getMilliseconds();
}

let cooldown = 300; // seconds

let lastChecked = now();

let lastPrices;

export const data = new SlashCommandBuilder()
    .setName('bitcoin')
    .setDescription('current bitcoin price')
    .addStringOption(option =>
      option.setName('currency')
        .setDescription('Current price in what currency?')
        .addChoices(
					{ name: '$ United States Dollar (USD)', value: 'USD' },
					{ name: '€ Euro (EUR)', value: 'EUR' },
					{ name: '£ Pound Sterling (GBP)', value: 'GBP' },
					{ name: '$ Canadian Dollar (CAD)', value: 'CAD' },
					{ name: 'Fr Swiss Franc (CHF)', value: 'CHF' },
					{ name: '$ Australian Dollar (AUD)', value: 'AUD' },
					{ name: '¥ Yen (JPY)', value: 'JPY' },
				));

let symbols = {
	USD: "$",
	EUR: "€",
	GBP: "£",
	CAD: "$",
	CHF: "Fr",
	AUD: "$",
	JPY: "¥"
}

export const execute = async function (interaction) {
	let currency = 'USD';
	if (interaction.options && interaction.options.getString('currency'))
    	currency = interaction.options.getString('currency');

    if (!lastPrices || lastChecked + (cooldown * 1000) > now())
    {
    	lastChecked = now();
		const response = await fetch('https://mempool.space/api/v1/prices');
		lastPrices = await response.json();
	}

	let formattedPrice = new Intl.NumberFormat('en-US').format(lastPrices[currency])
	await interaction.reply("1 ₿ == " + symbols[currency] + formattedPrice + " " + currency);
}