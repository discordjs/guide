const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!';

function findEmoji(id) {
	const temp = this.emojis.get(id);
	if (!temp) return null;

	const emoji = Object.assign({}, temp);
	if (emoji.guild) emoji.guild = emoji.guild.id;
	emoji.require_colons = emoji.requiresColons;

	return emoji;
}

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'stats') {
		return client.shard.broadcastEval('this.guilds.size')
			.then(results => {
				return message.channel.send(`Server count: ${results.reduce((prev, val) => prev + val, 0)}`);
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
			else {
				false;
			}
		`)
			.then(sentArray => {
				if (!sentArray.includes(true)) {
					return message.reply('I could not find such a channel.');
				}

				return message.reply(`I have sent a message to channel \`${args[0]}\`!`);
			});
	}

	if (command === 'emoji') {
		if (!args.length) return message.reply('please specify an emoji id to search for.');

		return client.shard.broadcastEval(`(${findEmoji}).call(this, '${args[0]}')`)
			.then(emojiArray => {
				const foundEmoji = emojiArray.find(emoji => emoji);
				if (!foundEmoji) return message.reply('I could not find such an emoji.');

				return client.rest.makeRequest('get', Discord.Constants.Endpoints.Guild(foundEmoji.guild).toString(), true)
					.then(raw => {
						const guild = new Discord.Guild(client, raw);
						const emoji = new Discord.Emoji(guild, foundEmoji);
						return message.reply(`I have found an emoji ${emoji.toString()}!`);
					});
			});
	}
});

client.login('token');
