const { Client, Intents, MessageEmbed } = require('discord.js');
const { request } = require('undici');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

async function getJSONResponse(body) {
	let fullBody = '';

	for await (const data of body) {
		fullBody += data.toString();
	}
	return JSON.parse(fullBody);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('messageCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;
	await interaction.deferReply();

	if (commandName === 'cat') {
		const catResult = await request('https://aws.random.cat/meow');
		const { file } = await getJSONResponse(catResult.body);
		interaction.reply({ files: [{ attachment: file, name: 'cat.png' }] });
	} else if (commandName === 'urban') {
		const term = interaction.options.getString('term');
		const query = new URLSearchParams({ term });

		const dictResult = await request(`https://api.urbandictionary.com/v0/define?${query}`);
		const { list } = await getJSONResponse(dictResult.body);

		if (!list.length) {
			return interaction.editReply(`No results found for **${term}**.`);
		}

		const [answer] = list;

		const embed = new MessageEmbed()
			.setColor('#EFFF00')
			.setTitle(answer.word)
			.setURL(answer.permalink)
			.addFields(
				{ name: 'Definition', value: trim(answer.definition, 1024) },
				{ name: 'Example', value: trim(answer.example, 1024) },
				{
					name: 'Rating',
					value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.`,
				},
			);
		interaction.editReply({ embeds: [embed] });
	}
});

client.login('your-token-goes-here');
