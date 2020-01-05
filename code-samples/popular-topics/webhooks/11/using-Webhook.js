const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client();

const embed = new Discord.RichEmbed()
	.setTitle('Webhooks are very cool')
	.setColor('GREEN');

client.once('ready', async () => {
	const channel = client.channels.get('222197033908436994');
	try {
		const webhooks = await channel.fetchWebhooks();
		const webhook = webhooks.first();

		await webhook.send('Webhook test', {
			username: 'burger',
			avatarURL: 'https://i.imgur.com/0lYWsg9.jpg',
			embeds: [embed],
		});
	} catch (error) {
		console.error('Error trying to send: ', error);
	}
});

client.login(config.token);
