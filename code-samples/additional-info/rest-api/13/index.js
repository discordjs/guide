const { Client, Intents, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'cat') {
		await interaction.deferReply();
		const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());

		interaction.editReply({ files: [file] });
	} else if (commandName === 'urban') {
		await interaction.deferReply();
		const term = interaction.options.getString('term');
		const query = new URLSearchParams({ term });

		const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());

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
				{ name: 'Rating', value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.` },
			);
		interaction.editReply({ embeds: [embed] });
	}
});

client.login('your-token-goes-here');
