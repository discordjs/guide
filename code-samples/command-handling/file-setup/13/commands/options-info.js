module.exports = {
	data: {
		name: 'options-info',
		description: 'Information about the options provided.',
		options: [
			{
				name: 'input',
				description: 'The input to echo back',
				type: 'STRING',
			},
		],
	},
	async run(interaction) {
		const option = interaction.options.get('input').value;
		option ? interaction.reply(`The options value is: \`${option}\``) : interaction.reply('No option was provided!');
	},
};
