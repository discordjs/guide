const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.GUILDS] });

client.once('ready', () => {
	console.log('Ready!');
});

client.login(token);
