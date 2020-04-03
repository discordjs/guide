
const Discord = require('discord.js');
const Keyv = require('keyv');
const config = require('./config.json');

const client = new Discord.Client();
const prefixes = new Keyv('sqlite://path/to.sqlite');
const globalPrefix = config.prefix;

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', async message => {
	if (message.author.bot) return;

	let args;
	if (message.guild) {
		let prefix;

		if (message.content.startsWith(globalPrefix)) {
			prefix = globalPrefix;
		} else {
			const guildPrefix = await prefixes.get(message.guild.id);
			if (message.content.startsWith(guildPrefix)) prefix = guildPrefix;
		}

		if (!prefix) return;
		args = message.content.slice(prefix.length).split(/\s+/);
	} else {
		const slice = message.content.startsWith(globalPrefix) ? globalPrefix.length : 0;
		args = message.content.slice(slice).split(/\s+/);
	}

	const command = args.shift().toLowerCase();

	if (command === 'prefix') {
		if (args.length) {
			await prefixes.set(message.guild.id, args[0]);
			return message.channel.send(`Successfully set prefix to \`${args[0]}\``);
		}

		return message.channel.send(`Prefix is \`${await prefixes.get(message.guild.id) || globalPrefix}\``);
	}
});

client.login(config.token);
