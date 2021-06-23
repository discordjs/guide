module.exports = {
	data: {
		name: 'ping',
		description: 'Replies with Pong!',
	},
	async execute(interaction) {
		return interaction.reply('Pong!');
	},
};