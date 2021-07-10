module.exports = {
	data: {
		name: 'avatar',
		description: 'Get the avatar URL of the selected user, or your own avatar.',
		options: [
			{
				name: 'target',
				description: 'The user\'s avatar to show',
				type: 'USER',
			},
		],
	},
	async execute(interaction) {
		const { user } = interaction.options.get('target');
		if (user) return interaction.reply(`${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true })}`);
		return interaction.reply(`Your avatar: ${interaction.user.displayAvatarURL({ dynamic: true })}`);
	},
};
