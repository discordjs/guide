module.exports = {
	data: {
		name: 'prune',
		description: 'Prune up to 99 messages.',
		options: [
			{
				name: 'amount',
				description: 'Number of messages to prune',
				type: 'INTEGER',
				required: true,
			},
		],
	},
	async run(interaction) {
		const amount = interaction.options.get('amount');

		if (amount <= 1 || amount > 100) return interaction.reply({ content: 'You need to input a number between 1 and 99.', ephemeral: true });
		
		await interaction.channel.bulkDelete(amount, true).catch(error => {
			console.error(error);
			interaction.reply({ content: 'There was an error trying to prune messages in this channel!', ephemeral: true });
		});

		await interaction.reply({ content: `Successfully pruned \`${amount}\` messages.`, ephemeral: true });
	},
};
