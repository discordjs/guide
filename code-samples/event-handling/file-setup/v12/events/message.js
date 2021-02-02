const { prefix } = require('../config.json');

module.exports = (message, client) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)

	if (!command) return;

	command.execute(message, args);
};
