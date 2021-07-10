module.exports = {
	data: {
		name: 'kick',
		description: 'Select a member and kick them (but not really).',
		options: [
			{
				name: 'target',
				description: 'The member to kick',
				type: 'USER',
				required: true,
			},
		],
	},
	async execute(interaction) {
		const { user } = interaction.options.get('target');
		return interaction.reply({ content: `You wanted to kick: ${user.username}`, ephemeral: true });
	},
};
