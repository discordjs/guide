const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

function findEmoji(c, { nameOrId }) {
	return c.emojis.cache.get(nameOrId) || c.emojis.cache.find(e => e.name.toLowerCase() === nameOrId.toLowerCase());
}

client.on('interactionCreate', interaction => {
	if (!interaction.isCommand()) return;

	const { commandName: command } = interaction;

	if (command === 'send') {
		const id = interaction.options.getString('destination');

		return client.shard.broadcastEval(async (c, { channelId }) => {
			const channel = c.channels.cache.get(channelId);
			if (channel) {
				await channel.send(`This is a message from shard ${client.shard.ids.join(',')}!`);
				return true;
			}
			return false;
		}, { context: { channelId: id } })
			.then(sentArray => {
				if (!sentArray.includes(true)) {
					return interaction.reply('I could not find such a channel.');
				}

				return interaction.reply(`I have sent a message to channel: \`${id}\`!`);
			});
	}

	if (command === 'emoji') {
		const emojiNameOrId = interaction.options.getString('emoji');

		return client.shard.broadcastEval(findEmoji, { context: { nameOrId: emojiNameOrId } })
			.then(emojiArray => {
				// Locate a non falsy result, which will be the emoji in question
				const foundEmoji = emojiArray.find(emoji => emoji);
				if (!foundEmoji) return interaction.reply('I could not find such an emoji.');
				return interaction.reply(`I have found the ${foundEmoji.animated ? `<${foundEmoji.identifier}>` : `<:${foundEmoji.identifier}> emoji!`}!`);
			});
	}
});

client.login('your-token-goes-here');
