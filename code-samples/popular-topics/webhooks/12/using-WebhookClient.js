const Discord = require('discord.js');
const config = require('./config.json');

const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);

const embed = new Discord.MessageEmbed()
	.setTitle('Webhooks are very cool')
	.setColor('GREEN');

webhookClient.send('Webhook test', {
	username: 'burger',
	avatarURL: 'https://i.imgur.com/0lYWsg9.jpg',
	embeds: [embed],
});
