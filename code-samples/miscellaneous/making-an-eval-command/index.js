const util = require('util');
const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;
	const args = message.content.slice(config.prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'eval') {
		if (message.author.id !== config.owner) return;
		const clean = content => {
			if (typeof content === 'string') {
				return content.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
			}
			return content;
		};
		try {
			// eslint-disable-next-line no-eval
			let res = eval(args.join(' '));
			if (typeof res !== 'string') res = util.inspect(res);
			message.channel.send(clean(res), { code: 'xl' });
		} catch (err) {
			message.channel.send(`\`Error\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}
	}
});

client.login(config.token);
