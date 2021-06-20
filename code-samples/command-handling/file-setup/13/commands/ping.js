module.exports = {
	data: {
		name: 'ping',
		description: 'Replies with Pong!',
	},
	async run(interaction) {
		await interaction.reply('Pong!');
	},
};