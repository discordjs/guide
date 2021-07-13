const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const prefix = '!';

function findEmoji(client, { nameOrId }) {
	return client.emojis.cache.get(nameOrId) || client.emojis.cache.find(e => e.name.toLowerCase() === nameOrId.toLowerCase());
}

client.on('messageCreate', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'send') {
		if (!args.length) return message.reply('please specify a destination channel id.');

		return client.shard.broadcastEval(async (client, { channelId }) => {
			const channel = client.channels.cache.get(channelId);
			if (channel) {
				await channel.send(`This is a message from shard ${client.shard.ids.join(',')}!`);
				return true;
			}
			return false;
		}, { context: { channelId: args[0] } })
			.then(sentArray => {
				if (!sentArray.includes(true)) {
					return message.reply('I could not find such a channel.');
				}

				return message.reply(`I have sent a message to channel \`${args[0]}\`!`);
			});
	}

	if (command === 'emoji') {
		if (!args.length) return message.reply('please specify an emoji ID or name to search for.');

		return client.shard.broadcastEval(findEmoji, { context: { nameOrId: args[0] } })
			.then(emojiArray => {
				// Locate a non falsy result, which will be the emoji in question
				const foundEmoji = emojiArray.find(emoji => emoji);
				if (!foundEmoji) return message.reply('I could not find such an emoji.');
				return message.reply(`I have found the ${foundEmoji.animated ? `<${foundEmoji.identifier}>` : `<:${foundEmoji.identifier}> emoji!`}!`);
			});
	}
});

client.login('your-token-goes-here');
