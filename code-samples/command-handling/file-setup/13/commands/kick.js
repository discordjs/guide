module.exports = {
	data: {
		name: 'kick',
		description: 'Select a member and kick them (but not really).',
		options: [
			{
				name: 'target',
				description: 'The member to kick',
				type: 'USER',
			},
		],
	},
	async run(interaction) {
		const user = interaction.options.get('target').user;
		await interaction.reply({ content: `You wanted to kick: ${user.username}`, ephemeral: true });
	},
};
