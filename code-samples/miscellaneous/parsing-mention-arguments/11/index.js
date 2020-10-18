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

		return client.users.get(mention);
	}
}

// eslint-disable-next-line no-unused-vars
function getUserFromMentionRegEx(mention) {
	// The id is the first and only match found by the RegEx.
	const matches = mention.match(/^<@!?(\d+)>$/);

	// If supplied variable was not a mention, matches will be null instead of an array.
	if (!matches) return;

	// However the first element in the matches array will be the entire mention, not just the ID,
	// so use index 1.
	const id = matches[1];

	return client.users.get(id);
}

client.on('message', async message => {
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

			return message.channel.send(`${user.username}'s avatar: ${user.displayAvatarURL}`);
		}

		return message.channel.send(`${message.author.username}, your avatar: ${message.author.displayAvatarURL}`);
	}

	if (command === 'ban') {
		if (args.length < 2) {
			return message.reply('Please mention the user you want to ban and specify a ban reason.');
		}

		const user = getUserFromMention(args[0]);
		if (!user) {
			return message.reply('Please use a proper mention if you want to ban someone.');
		}

		const reason = args.slice(1).join(' ');
		try {
			await message.guild.ban(user, { reason });
		} catch (error) {
			return message.channel.send(`Failed to ban **${user.tag}**: ${error}`);
		}

		return message.channel.send(`Successfully banned **${user.tag}** from the server!`);
	}
});

client.login(config.token);
