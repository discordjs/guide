# Reloading commands

When writing your commands, you may find it tedious to restart your bot every time for testing the smallest changes, With a command handler, you can eliminate this issue and reload your commands while your bot is running.

This section assumes you did follow the [Command Handling](/guide/creating-your-bot/command-handling.md) part.

```js {1}
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a command.')
		.addStringOption(option =>
			option.setName('command')
			.setDescription('The command to reload.')
			.setRequired(true)),
	async execute(interaction) {
		// ...
	},
};
```

First off, you need to check if the command you want to reload exists. You can do this check similarly to getting a command.

```js {4-6,8-10}
module.exports = {
	// ...
	async execute(interaction) {
		const commandName = interaction.options.getString('command', true).toLowerCase();
		const command = interaction.client.commands.get(commandName);

		if (!command) {
			return interaction.reply(`There is no command with name \`${commandName}\`!`);
		}
	},
};
```

To build the correct file path, you will need the file name. You can use `command.data.name` for doing that.

In theory, all there is to do is delete the previous command from `client.commands` and require the file again. In practice, you cannot do this easily as `require()` caches the file. If you were to require it again, you would load the previously cached file without any changes. You first need to delete the file from the `require.cache`, and only then should you require and set the command file to `client.commands`:

```js {3,5-12}
delete require.cache[require.resolve(`./${command.data.name}.js`)];

try {
	interaction.client.commands.delete(command.data.name);
	const newCommand = require(`./${command.data.name}.js`);
	interaction.client.commands.set(newCommand.data.name, newCommand);
	await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
} catch (error) {
	console.error(error);
	await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
}
```

The snippet above uses a `try/catch` block to load the command file and add it to `client.commands`. In case of an error, it will log the full error to the console and notify the user about it with the error's message component `error.message`. Note that you never actually delete the command from the commands Collection and instead overwrite it. This behavior prevents you from deleting a command and ending up with no command at all after a failed `require()` call, as each use of the reload command checks that Collection again.