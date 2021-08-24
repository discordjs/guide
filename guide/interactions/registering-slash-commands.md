# Registering slash commands

Discord provides developers with the option to create client-integrated slash commands. In this section, we'll cover how to register these commands using discord.js!

::: tip
This page assumes you use the same file structure as our [command handling](/creating-your-bot/command-handling.md) section. The scripts provided are made to function with that setup.

If you already have slash commands set up for your application and want to learn how to respond to them, refer to [the following page](/interactions/replying-to-slash-commands.md).
:::

## Guild commands

Guild application commands are only available in the guild they were created in, if your application has the `applications.commands` scope authorized.

In this section, we'll be using a script that is usable in conjunction with the slash command handler from the [command handling](/creating-your-bot/command-handling.md) section.

First off, install the [`@discordjs/rest`](https://github.com/discordjs/discord.js-modules/blob/main/packages/rest/) and [`discord-api-types`](https://github.com/discordjs/discord-api-types/) by running the following command in your terminal:

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npm install @discordjs/rest discord-api-types
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn add @discordjs/rest discord-api-types
```
:::
::::

<!-- eslint-skip -->

```js
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('./config.json');
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Place your client and guild ids here
const clientId = '123456789012345678';
const guildId = '876543210987654321';

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
```

Running this script will register all your commands to the guild of which the id was passed in above.

## Global commands

Global application commands will be available in all the guilds your application has the `applications.commands` scope authorized, as well as in DMs.

::: tip
Global commands are cached for one hour. New global commands will fan out slowly across all guilds and will only be guaranteed to be updated after an hour. Guild commands update instantly. As such, we recommend you use guild-based commands during development and publish them to global commands when they're ready for public use.
:::

To deploy global commands, you can use the same script from the [guild commands](#guild-commands) section and adjust the route in the script to `.applicationCommands(clientId)`.

<!-- eslint-skip -->

```js {2}
await rest.put(
	Routes.applicationCommands(clientId),
	{ body: commands },
);
```

## Options

Application commands can have `options`. Think of these options as arguments to a function. You can specify them as shown below:

```js {6-9}
const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back')
			.setRequired(true));
```

Notice how `.setRequired(true)` is specified within the options builder. Setting this will prevent the user from sending the command without specifying a value for this option!

## Option types

As shown in the options example above, you can specify the `type` of an `ApplicationCommandOption`. Listed below are all the possible values you can pass as `ApplicationCommandOptionType`:

::: tip
The [slash command builder](/popular-topics/builders.md#slash-command-builders) has a method for each of these types respectively.
Refer to the Discord API documentation for detailed explanations on the [`SUB_COMMAND` and `SUB_COMMAND_GROUP` option types](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups).
:::

* `SUB_COMMAND` sets the option to be a subcommand
* `SUB_COMMAND_GROUP` sets the option to be a subcommand group
* `STRING` sets the option to require a string value
* `INTEGER` sets the option to require an integer value
* `NUMBER` sets the option to require a decimal (also known as a floating point) value
* `BOOLEAN` sets the option to require a boolean value
* `USER` sets the option to require a user or snowflake as value
* `CHANNEL` sets the option to require a channel or snowflake as value
* `ROLE` sets the option to require a role or snowflake as value
* `MENTIONABLE` sets the option to require a user, role or snowflake as value

## Choices

The `STRING` and `INTEGER` option types both can have `choices`. `choices` are a set of predetermined values users can pick from when selecting the option that contains them.

::: warning
If you specify `choices` for an option, they'll be the **only** valid values users can pick!
:::

Specify them by using the `addChoice()` method from the slash command builder:

```js {10-12}
const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('gif')
	.setDescription('Sends a random gif!')
	.addStringOption(option =>
		option.setName('category')
			.setDescription('The gif category')
			.setRequired(true)
			.addChoice('Funny', 'gif_funny')
			.addChoice('Meme', 'gif_meme')
			.addChoice('Movie', 'gif_movie'));
```
