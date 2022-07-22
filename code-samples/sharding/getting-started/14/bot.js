// bot.js
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('interactionCreate', interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'stats') {
		return interaction.reply(`Server count: ${client.guilds.cache.size}.`);
	}
});

client.login('your-token-goes-here');
