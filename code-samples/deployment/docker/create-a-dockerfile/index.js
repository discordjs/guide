const { Client, Intents } = require('discord.js');
require('dotenv').config();

const commands = [
	{
		name: 'ping',
		description: 'Pong!',
	},
];

const client = new Client({ intents: [Intents.FLAGS.GUILDS] }).once('ready', () => {
	console.log('Ready!');

	client.application.commands.fetch().then(existingCommands => {
		existingCommands.find(c => c.name === 'ping')
			&& client.application.commands.set(commands);
	});
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	await interaction.reply({ content: 'ok', ephemeral: true });
});

client.login();
