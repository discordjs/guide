import { Command } from '@sapphire/framework';

export class BanCommand extends Command {
	constructor(context) {
		super(context, {
			description: 'Bans up to 5 members with optionally a reason',
		});
	}

	async run(message, args) {
		const members = await args.repeat('member', { times: 5 });
		const reason = args.finished ? null : args.rest('string');

		// De-duplicate members:
		for (const member of new Set(members)) {
			await member.ban({ reason });
		}

		await message.channel.send('Done!');
	}
};
