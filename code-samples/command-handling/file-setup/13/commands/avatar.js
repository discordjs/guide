module.exports = {
	data: {
		name: 'avatar',
		description: 'Get the avatar URL of the selected user, or your own avatar.',
		options: [
			{
				name: 'target',
				description: 'The user who\'s avatar to show',
				type: 'USER',
			},
		],
	},
	async run(interaction) {
		const user = interaction.options.get('target').user;
		user ? interaction.reply(`${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true })}`) : interaction.reply(`Your avatar: ${interaction.user.displayAvatarURL({ dynamic: true })}`);
	},
};
