const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('Information about the options provided.')
		.addStringOption(option => option.setName('input').setDescription('The input to echo back')),
	async execute(interaction) {
		const value = interaction.options.getString('input');
		if (value) return interaction.reply(`The options value is: \`${value}\``);
		return interaction.reply('No option was provided!');
	},
};
