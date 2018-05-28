const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!';


client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'stats') {
		return client.shard.broadcastEval('this.guilds.size')
			.then(results => {
				return message.channel.send(`Server count: ${results.reduce((prev, val) => prev + val, 0)}`);
			})
			.catch(console.error);
	}
});

client.login('token');
