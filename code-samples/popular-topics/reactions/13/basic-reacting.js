const { Client, Intents } = require('discord.js');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'react') {
		interaction.reply('You can react with Unicode emojis!');
		const message = await interaction.fetchReply();
		message.react('😄');
	} else if (interaction.commandName === 'react-custom') {
		interaction.reply('You can react with custom emojis!');
		const message = await interaction.fetchReply();
		message.react('123456789012345678');
	} else if (interaction.commandName === 'fruits') {
		interaction.reply('Reacting with fruits!');
		const message = await interaction.fetchReply();
		message.react('🍎')
			.then(() => message.react('🍊'))
			.then(() => message.react('🍇'))
			.catch(() => console.error('One of the emojis failed to react.'));
	}
});

client.login('your-token-goes-here');
