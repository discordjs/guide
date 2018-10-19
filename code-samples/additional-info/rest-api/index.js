const Discord = require('discord.js');
const fetch = require('node-fetch');
const querystring = require('querystring');

const client = new Discord.Client();
const prefix = '!';

const trim = (str, max) => (str.length > max) ? `${str.slice(0, max - 3)}...` : str;

client.on('ready', () => {
	console.log('Ready!');
});

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'cat') {
		const { body } = await fetch('https://aws.random.cat/meow').then(response => response.json());

		message.channel.send(body.file);
	}
	else if (command === 'urban') {
		if (!args.length) {
			return message.channel.send('You need to supply a search term!');
		}

		const query = querystring.stringify({ term: args.join(' ') });

		const { body } = await fetch.get(`https://api.urbandictionary.com/v0/define${query}`).then(response => response.json());

		if (!body.list.length) {
			return message.channel.send(`No results found for **${args.join(' ')}**.`);
		}

		const [answer] = body.list;

		const embed = new Discord.RichEmbed()
			.setColor('#EFFF00')
			.setTitle(answer.word)
			.setURL(answer.permalink)
			.addField('Definition', trim(answer.definition, 1024))
			.addField('Example', trim(answer.example, 1024))
			.addField('Rating', `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.`);

		message.channel.send(embed);
	}
});

client.login('pleaseinsertyourtokenheresothistutorialcanwork');
