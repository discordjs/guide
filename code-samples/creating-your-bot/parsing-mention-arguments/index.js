const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client();

function getUserFromMention(mention) {
	// Check if `mention` contains a string.
	// If not, just return undefined to signal there is no user to be found.
	if (!mention) return undefined;

	// A user mention starts with <@ as well as a > at the end,
	// so check for those.
	if (mention.startsWith('<@') && mention.endsWith('>')) {
		// Now remove the <@ and >, they are not necessary.
		mention = mention.slice(2, -1);

		// If the user has a nickname they will also have a ! in their mention.
		// Remove that as well.
		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		// Now all that is left should be the ID,
		// which can be used to get the user object.
		const user = client.users.get(mention);
		// The ID might be invalid, so check for that as well.
		if (!user) {
			// Just return undefined to indicate nothing was found.
			return undefined;
		}
		else {
			// A user was found, so return that.
			return user;
		}
	}

	// Return undefined here as well.
	// If the code reaches this point nothing was found.
	return undefined;
}

// eslint-disable-next-line no-unused-vars
function getUserFromMentionRegEx(mention) {
	const matches = mention.match(/^<@!?(\d+)>$/);
	// The id is the first and only match found by the RegEx.
	// However the first element in the matches array will be the entire mention, not just the ID,
	// so use index 1.
	const id = matches[1];
	// Now just get the User with the ID and return that.
	return client.users.get(id);
}

client.on('message', message => {
	// Don not go any further if there is no command prefix.
	if (!message.content.startsWith(config.prefix)) return;

	// Remove the prefix from the message.
	const withoutPrefix = message.content.slice(config.prefix.length);
	// Split the message by spaces
	const split = withoutPrefix.split(/ +/);
	// The first element is the command, the rest are the arguments.
	const command = split[0];
	const args = split.slice(1);

	if (command === 'avatar') {
		// First check if the user even tried to supply a mention arg
		if (args[0]) {
			// If he did try to turn that mention into a user object.
			// The first argument should be the mention, so pass it to the function.
			// Change `getUserFromMention` to `getUserFromMentionRegEx` to try the RegEx variant.
			const user = getUserFromMention(args[0]);

			// The function can return undefined, in which case notify
			// the user that the argument was invalid.
			if (!user) {
				return message.reply('Please use a proper mention if you want to see someone else\'s avatar.');
			}
			else {
				return message.channel.send(`${user.username}'s avatar: ${user.displayAvatarURL}`);
			}
		}
		else {
			return message.channel.send(`${message.author.username}, your avatar: ${message.author.displayAvatarURL}`);
		}
	}
});

client.login(config.token);
