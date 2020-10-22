const { Client } = require('discord.js');
const client = new Client();
const prefix = '!';


client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'stats') {
		const promises = [
			client.shard.fetchClientValues('guilds.size'),
			client.shard.broadcastEval('this.guilds.reduce((acc, guild) => acc + guild.memberCount, 0)'),
		];

		return Promise.all(promises)
			.then(results => {
				const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
				const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
				return message.channel.send(`Server count: ${totalGuilds}\nMember count: ${totalMembers}`);
			})
			.catch(console.error);
	}
});

client.login('your-token-goes-here');
