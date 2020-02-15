const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client();

function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
}

// eslint-disable-next-line no-unused-vars
function getUserFromMentionRegEx(mention) {
	const matches = mention.match(/^<@!?(\d+)>$/);
	// The id is the first and only match found by the RegEx.
	// However the first element in the matches array will be the entire mention, not just the ID,
	// so use index 1.
	const id = matches[1];

	return client.users.cache.get(id);
}

client.on('message', message => {
	if (!message.content.startsWith(config.prefix)) return;

	const withoutPrefix = message.content.slice(config.prefix.length);
	const split = withoutPrefix.split(/ +/);
	const command = split[0];
	const args = split.slice(1);

	if (command === 'avatar') {
		if (args[0]) {
			// Change `getUserFromMention` to `getUserFromMentionRegEx` to try the RegEx variant.
			const user = getUserFromMention(args[0]);

			if (!user) {
				return message.reply('Please use a proper mention if you want to see someone else\'s avatar.');
			}

			return message.channel.send(`${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true })}`);
		}

		return message.channel.send(`${message.author.username}, your avatar: ${message.author.displayAvatarURL({ dynamic: true })}`);
	}
});

client.login(config.token);
