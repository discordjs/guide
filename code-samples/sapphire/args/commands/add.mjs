import { Command } from '@sapphire/framework';

export class AddCommand extends Command {
	constructor(context) {
		super(context, {
			description: 'Adds two numbers',
		});
	}

	async run(message, args) {
		const a = await args.pick('number');
		const b = await args.pick('number');
		return message.channel.send(`The result is... ${a + b}!`);
	}
}
