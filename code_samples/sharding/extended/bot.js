const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!';

function findEmoji(id) {
	const temp = this.emojis.get(id);
	if (!temp) return false;

	const emoji = Object.assign({}, temp);
	if (emoji.guild) emoji.guild = emoji.guild.id;
	emoji.require_colons = emoji.requiresColons;

	return emoji;
}

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'stats') {
		return client.shard.broadcastEval('this.guilds.size')
			.then(results => {
				return message.reply(`Server count: ${results.reduce((prev, val) => prev + val, 0)}`);
			})
			.catch(console.error);
	}

	if (command === 'send') {
		if (!args.length) return message.reply('please specify a destination channel id.');

		return client.shard.broadcastEval(`
			const channel = this.channels.get('${args[0]}');
			if (channel) {
				channel.send('This is a message from shard ${this.shard.id}!');
				true;
			}
			else false;
		`)
			.then(results => {
				const found = results.find(result => result);
				if (!found) return message.reply('I could not find such a channel.');

				return message.reply(`I have sent a message to channel \`${args[0]}\`!`);
			});
	}

	if (command === 'emoji') {
		if (!args.length) return message.reply('please specify an emoji id to search for.');

		return client.shard.broadcastEval(`(${findEmoji}).call(this, '${args[0]}')`)
			.then(results => {
				const found = results.find(result => result);
				if (!found) return message.reply('I could not find such an emoji.');

				const emoji = new Discord.Emoji(client.guilds.get(found.guild), found);
				return message.reply(`I have found an emoji ${emoji}!`);
			});
	}
});

client.login('token');
