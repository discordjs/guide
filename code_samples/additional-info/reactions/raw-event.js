const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
	console.log('Ready!');
});

client.on('raw', async event => {
	if (event.t !== 'MESSAGE_REACTION_ADD') return;

	const { d: data } = event;
	const channel = client.channels.get(data.channel_id);

	if (channel.messages.has(data.message_id)) return;

	const user = client.users.get(data.user_id);
	const message = await channel.fetchMessage(data.message_id);

	let emoji = ''

	if(data.emoji.id) {
		emoji = `${data.emoji.name}:${data.emoji.id}`
	} else {
		emoji = data.emoji.name
	}

	const reaction = message.reactions.get(emoji);

	client.emit('messageReactionAdd', reaction, user);
});

client.on('messageReactionAdd', (reaction, user) => {
	console.log(`${user.username} reacted with "${reaction.emoji.name}".`);
});

client.login('your-token-goes-here');
