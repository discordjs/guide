module.exports = {
	name: 'user-info',
	description: 'Display info about yourself.',
	async execute(interaction) {
		return interaction.reply(`Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`);
	},
};
