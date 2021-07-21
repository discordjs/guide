import { Command } from '@sapphire/framework';

export class PowCommand extends Command {
	constructor(context) {
		super(context, {
			description: 'Calculates the exponent of a number with an exponent',
		});
	}

	async run(message, args) {
		const base = await args.pick('number');
		const exponent = args.finished ? 2 : await args.pick('number');
		return message.channel.send(`The result is... ${Math.pow(base, exponent)}!`);
	}
}
