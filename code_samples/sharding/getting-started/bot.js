const Discord = require('discord.js');
const client = new Discord.Client();

client.on('message', message => {
	if (message.content === 'stats') {
		client.shard.broadcastEval('this.guilds.size').then(results => {
			message.reply(`Server count: ${results.reduce((prev, val) => prev + val, 0)}`);
		}).catch(console.error);
	}
});

client.login('token');
