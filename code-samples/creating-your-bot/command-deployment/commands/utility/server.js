const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Display info about this server.'),
	async execute(interaction) {
		return interaction.reply(`***Server name:*** ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}\nWhat Server is About: The Lifestealer SMP is about a Minecraft Java server which is currently closed due to maintenance`);
	},
};
