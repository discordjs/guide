module.exports = {
	data: {
		name: 'server',
		description: 'Display info about this server.',
	},
	async run(interaction) {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	},
};
