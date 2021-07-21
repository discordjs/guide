const { Command } = require('@sapphire/framework');

module.exports = class PingCommand extends Command {
	constructor(context) {
		super(context, {
			aliases: ['pong'],
			description: 'Tests the latency.',
		});
	}

	async run(message) {
		const response = await message.channel.send('Ping...');
		const latency = response.createdTimestamp - message.createdTimestamp;
		await response.edit(`Pong! Took me ${latency}ms.`);
	}
};
