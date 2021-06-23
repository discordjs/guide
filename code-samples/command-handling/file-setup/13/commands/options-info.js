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
	async execute(interaction) {
		const { value } = interaction.options?.get('input');
		if (value) return interaction.reply(`The options value is: \`${value}\``);
		else return interaction.reply('No option was provided!');
	},
};
