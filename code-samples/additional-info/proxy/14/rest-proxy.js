const { ProxyAgent } = require('undici');
const { Client } = require('discord.js');

// eslint-disable-next-line no-unused-vars
const myClient = new Client({
	// other client options
	rest: {
		agent: new ProxyAgent('http://my-proxy-server:port'),
	},
});
