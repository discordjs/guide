const { Client } = require('discord.js');
const client = new Client();

client.on('ready', () => {
	console.log('Ready!');
});

client.on('message', async message => {
	if (message.content === '!reaction-role') {
		const reactmessage = await message.channel.send('React with 👌 to get your role!');
		await reactmessage.react('👌');

		const filter = (reaction, user) => reaction.emoji.name === '👌' && !user.bot;
		const collector = reactmessage.createReactionCollector(filter, { time: 15000 });

		collector.on('collect', async reaction => {
			const user = reaction.users.last();
			const guild = reaction.message.guild;
			const member = guild.member(user) || await guild.fetchMember(user);
			member.addRole('some-role-id');
			console.log(`Added the role to ${member.displayName}`);
		});
	}
});

client.login('your-token-goes-here');
