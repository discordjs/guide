# Registering slash commands

Discord provides developers with the option to create client-integrated slash commands. In this section, we'll cover how to register these commands using discord.js!

::: tip
If you already have slash commands set-up for your application and want to learn how to respond to them, refer to [the following page](/interactions/replying-to-slash-commands/).
:::

## Global commands

First up, we'll introduce you to global application commands. These types of commands will be available in all guilds your application has the `applications.commands` scope authorized, as well as in DMs.

::: tip
Global commands are cached for one hour. New global commands will fan out slowly across all guilds and will only be guaranteed to be updated after an hour. Guild commands update instantly. As such, we recommend you use guild-based commands during development and publish them to global commands when they're ready for public use.
:::

To register a global command, pass an `ApplicationCommandData` object to the `ApplicationCommandManager#create()` method:

```js
client.on('messageCreate', async message => {
	if (!client.application?.owner) await client.application?.fetch();

	if (message.content.toLowerCase() === '!deploy' && message.author.id === client.application?.owner.id) {
		const data = {
			name: 'ping',
			description: 'Replies with Pong!',
		};

		const command = await client.application?.commands.create(data);
		console.log(command);
	}
});
```

::: danger
Command names must be lowercase. You will receive an API error otherwise.
:::

That's it! You've successfully created your first global application command! Let's move on to guild commands.

## Guild commands

Guild-specific application commands are only available in the guild they were created in. You can use `GuildApplicationCommandManager#create()` to create them:

```js {10}
client.on('messageCreate', async message => {
	if (!client.application?.owner) await client.application?.fetch();

	if (message.content.toLowerCase() === '!deploy' && message.author.id === client.application?.owner.id) {
		const data = {
			name: 'ping',
			description: 'Replies with Pong!',
		};

		const command = await client.guilds.cache.get('123456789012345678')?.commands.create(data);
		console.log(command);
	}
});
```

## Bulk-update commands

If, for example, you deploy your application commands when starting your application, you may want to update all commands and their changes at once. You can do this by passing an array of `ApplicationCommandData` objects to the `set()` method on either of the managers introduced above: 

::: danger
This will overwrite all existing commands on the application or guild with the new data provided!
:::

```js {5-14,16-17}
client.on('messageCreate', async message => {
	if (!client.application?.owner) await client.application?.fetch();

	if (message.content.toLowerCase() === '!deploy' && message.author.id === client.application?.owner.id) {
		const data = [
			{
				name: 'ping',
				description: 'Replies with Pong!',
			},
			{
				name: 'pong',
				description: 'Replies with Ping!',
			},
		];

		const commands = await client.application?.commands.set(data);
		console.log(commands);
	}
});
```

## Options

Application commands can have `options`. Think of these options as arguments to a function. You can specify them as shown below:

```js {4-9}
const data = {
	name: 'echo',
	description: 'Replies with your input!',
	options: [{
		name: 'input',
		type: 'STRING',
		description: 'The input to echo back',
		required: true,
	}],
};
```

Notice how `required: true` is specified within the options object. Setting this will prevent the user from sending the command without specifying a value for this option!

## Option types

As shown in the options example above, you can specify the `type` of an `ApplicationCommandOption`. Listed below are all the possible values you can pass as `ApplicationCommandOptionType`:

::: tip
Refer to the Discord API documentation for detailed explanations on the [`SUB_COMMAND` and `SUB_COMMAND_GROUP` option types](https://discord.com/developers/docs/interactions/slash-commands#subcommands-and-subcommand-groups).
:::

* `SUB_COMMAND` sets the option to be a sub-command
* `SUB_COMMAND_GROUP` sets the option to be a sub-command-group
* `STRING` sets the option to require a string value
* `INTEGER` sets the option to require an integer value
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

Specify them by providing an array of `ApplicationCommandOptionChoice`'s to the option when creating a command:

```js {9-22}
const data = {
	name: 'gif',
	description: 'Sends a random gif!',
	options: [{
		name: 'category',
		type: 'STRING',
		description: 'The gif category',
		required: true,
		choices: [
			{
				name: 'Funny',
				value: 'gif_funny',
			},
			{
				name: 'Meme',
				value: 'gif_meme',
			},
			{
				name: 'Movie',
				value: 'gif_movie',
			},
		],
	}],
};
```

## Advanced deployment

Advanced users should make use of a deploy script to deploy their commands when needed. In this section, we'll be using a script that is usable in conjunction with the [slash command handler](/command-handling) from the command handling section.

First off, install the discord.js REST module by running `npm i @discordjs/rest` in your terminal.

::: warning
For this script to work, **don't** use string literals for the `ApplicationCommandOptionType` in your command files, but instead use the `ApplicationCommandOptionType` enum from `discord-api-types`.
:::

<!-- eslint-skip -->

```js
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('./config.json');

/* 
	assumes client is available in this context and that
 	client#commands exists according to earlier guide sections
*/
const commands = client.commands.map(({ execute, ...data }) => data); 

const rest = new REST({ version: '9' }).setToken(token);

try {
	console.log('Started refreshing application (/) commands');

	await rest.put(
		Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
		{ body: commands },
	);

	console.log('Sucessfully reloaded application (/) commands.');
} catch (e) {
	console.error(e);
}
```

Running this script will register all your commands to the guild of which the id was passed in above.
You can also modify this to deploy global commands by adjusting the route to `.applicationCommands(CLIENT_ID)`.
