const { Client } = require('discord.js');
const { NodeGlobalProxy } = require('./NodeGlobalProxy');

const proxy = new NodeGlobalProxy({
	http: 'http://my-proxy-server:port',
	https: 'http://my-proxy-server:port',
});

proxy.start();

const client = new Client({
	// client options, including the proxy agent as described above
});

client.login('your-token-goes-here');
