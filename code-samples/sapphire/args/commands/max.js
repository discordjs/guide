const { Command } = require('@sapphire/framework');

module.exports = class MaxCommand extends Command {
	constructor(context) {
		super(context, {
			description: 'Gets the maximum between a number of numbers',
		});
	}

	async run(message, args) {
		const numbers = await args.repeat('number');
		return message.channel.send(`The highest number is ${Math.max(...numbers)}!`);
	}
};
