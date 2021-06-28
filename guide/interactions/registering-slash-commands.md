# Registering slash commands

Discord provides users with the option to create client-integrated slash commands. In this section, you'll be learning how to register these commands using discord.js!

::: tip
If you already have slash commands set-up for your application and want to learn to respond to them, refer to [the following page](/interactions/replying-to-slash-commands/).
:::

## Global commands

First up, we'll introduce you to global application commands. These types of commands will be available in all guilds your application has the `applications.commands` scope authorized, as well as in DMs.

::: tip
Global commands are cached for one hour. New global commands will fan out slowly across all guilds and will only be guaranteed to be updated after an hour. Guild commands update instantly. As such, we recommend you use guild-based commands during development and publish them to global commands when they're ready for public use.
:::

To register a global command you'll be passing an `ApplicationCommandData` object to the `ApplicationCommandManager#create()` method as follows:

```js
client.on('message', async message => {
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
Command names must be lowercase. You will receive an API error if this is not the case.
:::

That's it! You've successfully created your first global application command! Let's move on to guild specific commands.


## Guild commands

Guild-specific application commands are only available in the guild they have been created in. You'll be using `GuildApplicationCommandManager#create()` to create them:

```js {10}
client.on('message', async message => {
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

Excellent! Now you've learned how to register guild specific application commands. We're not done yet, there's still a few more topics to cover, keep reading!


## Bulk-update commands

If you, for example, deploy your application commands when starting your application, you may want to update all commands and their changes at once. You can do this by passing an array of `ApplicationCommandData` objects to the `set()` method on either of the managers you've been introduced to above: 

::: danger
This will overwrite all existing commands on the application or guild with the new data you provided!
:::

```js {5-14,15-17}
client.on('message', async message => {
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

Perfect! You have now learned how to bulk-update application commands. 


## Options

Application commands can have `options`, think of these options like arguments to a function. You can specify them as seen below:

```js {8-13}
client.on('message', async message => {
	if (!client.application?.owner) await client.application?.fetch();

	if (message.content.toLowerCase() === '!deploy' && message.author.id === client.application?.owner.id) {
		const data = {
			name: 'echo',
			description: 'Replies with your input!',
			options: [{
				name: 'input',
				type: 'STRING',
				description: 'The input which should be echoed back',
				required: true,
			}],
		};

		const command = await client.application?.commands.create(data);
		console.log(command);
	}
});
```

Notice how we specified `required: true` within the options object? Doing this will make the option a required field and will prevent the user from sending the command without specifying a value for this option!

Now you've learned how to create an application command with `options`. Keep reading, we have two more sections to cover!

## Option types

As you've seen in the example of the last section, we can specify the `type` of an `ApplicationCommandOption`. Listed below you'll find a list of all possible values you can pass as `ApplicationCommandOptionType`:

::: tip
For detailed explanations on the `SUB_COMMAND` and `SUB_COMMAND_GROUP` option types please see [this section](https://discord.com/developers/docs/interactions/slash-commands#subcommands-and-subcommand-groups) of the Discord API documentation.
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

The `STRING` and `INTEGER` option types both can have `choices`. Now what are choices? Simply put, `choices` are a set of predetermined values that a user can pick from when selecting the option that contains them.

::: warning
If you specify `choices` for an option, they are the **only** valid values for a user to pick!
:::

To specify them you simply provide an array of `ApplicationCommandOptionChoice`'s to the option when creating a command:

```js {13-26}
client.on('message', async message => {
	if (!client.application?.owner) await client.application?.fetch();

	if (message.content.toLowerCase() === '!deploy' && message.author.id === client.application?.owner.id) {
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

		const command = await client.application?.commands.create(data);
		console.log(command);
	}
});
```
