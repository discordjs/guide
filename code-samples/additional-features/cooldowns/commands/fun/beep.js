const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Boop!'),
	async execute(interaction) {
		return interaction.reply('Boop.');
	},
};
