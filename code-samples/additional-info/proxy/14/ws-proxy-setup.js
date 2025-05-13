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

module.exports = {
	NodeGlobalProxy,
};
