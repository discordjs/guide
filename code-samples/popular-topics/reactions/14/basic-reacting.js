const { Client, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions],
});

client.once(Events.ClientReady, () => {
	console.log('Ready!');
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'react') {
		const message = await interaction.reply({ content: 'You can react with Unicode emojis!', fetchReply: true });
		message.react('😄');
	} else if (commandName === 'react-custom') {
		const message = await interaction.reply({ content: 'You can react with custom emojis!', fetchReply: true });
		message.react('123456789012345678');
	} else if (commandName === 'fruits') {
		const message = await interaction.reply({ content: 'Reacting with fruits!', fetchReply: true });
		message.react('🍎')
			.then(() => message.react('🍊'))
			.then(() => message.react('🍇'))
			.catch(() => console.error('One of the emojis failed to react.'));
	}
});

client.login('your-token-goes-here');
