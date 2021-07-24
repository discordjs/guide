const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interacton.commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (interacton.commandName === 'beep') {
		await interaction.reply('Boop!');
	} else if (interacton.commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	} else if (interacton.commandName === 'user-info') {
		await interaction.reply(`Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`);
	}
});

client.login('your-token-goes-here');
