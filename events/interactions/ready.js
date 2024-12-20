import { Events } from 'discord.js';


export const name = Events.ClientReady;
export const once = true;
export const execute = async function(client) {
	console.log(`Ready! Logged in as ${client.user.tag}`);
}