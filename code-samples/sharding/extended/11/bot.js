const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!';

function findEmoji(nameOrID) {
	return this.emojis.get(nameOrID) || this.emojis.find(e => e.name.toLowerCase() === nameOrID.toLowerCase());
}

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'stats') {
		return client.shard.broadcastEval('this.guilds.size')
			.then(results => {
				return message.channel.send(`Server count: ${results.reduce((acc, val) => acc + val, 0)}`);
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
		if (!args.length) return message.reply('please specify an emoji ID or name to search for.');

		return client.shard.broadcastEval(`(${findEmoji}).call(this, '${args[0]}')`)
			.then(emojiArray => {
				const foundEmoji = emojiArray.find(emoji => emoji);
				if (!foundEmoji) return message.reply('I could not find such an emoji.');
				return message.reply(`I have found the ${foundEmoji.id ? `<${foundEmoji.animated ? 'a' : ''}:${foundEmoji.name}:${foundEmoji.id}>` : foundEmoji.name} emoji!`);
			});
	}
});

client.login('your-token-goes-here');
