import { Events } from 'discord.js';

export default {
	name: Events.ClientReady,
	once: true,
	execute: async function(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};