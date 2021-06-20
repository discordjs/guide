module.exports = {
	data: {
		name: 'user-info',
		description: 'Display info about yourself.',
	},
	async run(interaction) {
		await interaction.reply(`Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`);
	},
};
