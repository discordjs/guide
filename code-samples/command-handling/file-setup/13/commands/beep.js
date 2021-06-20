module.exports = {
	data: {
		name: 'beep',
		description: 'Beep!',
	},
	async run(interaction) {
		await interaction.reply('Boop!');
	},
};
