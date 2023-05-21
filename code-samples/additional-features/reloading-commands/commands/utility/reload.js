const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a command.')
		.addStringOption(option =>
			option.setName('command')
				.setDescription('The command to reload.')
				.setRequired(true)),
	async execute(interaction) {
		const commandName = interaction.options.getString('command', true).toLowerCase();
		const command = interaction.client.commands.get(commandName);

		if (!command) {
			return interaction.reply(`There is no command with name \`${commandName}\`!`);
		}

		const dirPath = path.resolve(__dirname, '..');
		const subdirs = fs.readdirSync(dirPath, { withFileTypes: true })
			.filter(dirent => dirent.isDirectory())
			.map(dirent => dirent.name);

		let commandPath = null;

		for (const subdir of subdirs) {
			const filePath = path.join(dirPath, subdir, `${command.data.name}.js`);
			if (fs.existsSync(filePath)) {
				commandPath = filePath;
				break;
			}
		}

		if (!commandPath) {
			return interaction.reply(`Cannot find the file for command \`${command.data.name}\`!`);
		}

		delete require.cache[require.resolve(commandPath)];

		try {
	        interaction.client.commands.delete(command.data.name);
	        const newCommand = require(commandPath);
	        interaction.client.commands.set(newCommand.data.name, newCommand);
	        await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
		} catch (error) {
	        console.error(error);
	        await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
		}
	},
};
