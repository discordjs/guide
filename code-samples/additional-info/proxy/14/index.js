const { ProxyAgent } = require('undici');
const { Client } = require('discord.js');
const { bootstrap } = require('global-agent');

bootstrap();

class NodeGlobalProxy {
	config = {
		http: '',
		https: '',
	};

	constructor(config) {
		this.config = config;
	}

	start() {
		global.GLOBAL_AGENT.HTTP_PROXY = this.config.http;
		global.GLOBAL_AGENT.HTTPS_PROXY = this.config.https;
	}

	stop() {
		global.GLOBAL_AGENT.HTTP_PROXY = null;
		global.GLOBAL_AGENT.HTTPS_PROXY = null;
	}
}

const proxy = new NodeGlobalProxy({
	http: 'http://my-proxy-server:port',
	https: 'http://my-proxy-server:port',
});

proxy.start();

// eslint-disable-next-line no-unused-vars
const client = new Client({
	// other client options
	rest: {
		agent: new ProxyAgent('http://my-proxy-server:port'),
	},
});

client.login('your-token-goes-here');
