module.exports = {
	name: 'ping',
	description: 'Replies with Pong!',
	async execute(interaction) {
		return interaction.reply('Pong!');
	},
};
