const { Client, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

/**
 * You should set commands in your deploy.js file to prevent api spamming
*/

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
	console.log('I am ready!');
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isCommand()) return;
	if (interaction.commandName === 'ping') {
		await interaction.reply({ content: 'Pong!', ephemeral: true });
	}
});

// It doesn't require putting token as DISCORD_TOKEN is set
client.login();
