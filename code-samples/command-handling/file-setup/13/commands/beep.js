module.exports = {
	data: {
		name: 'beep',
		description: 'Beep!',
	},
	async execute(interaction) {
		return interaction.reply('Boop!');
	},
};
