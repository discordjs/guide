# Registering slash commands

Discord provides users the option to create client-integrated slash commands. In this section you'll be learning how to register these commands using discord.js!

::: tip
If you already have slash commands set-up for your application and want to learn to respond to them, refer to [the following page](/interactions/replying-to-slash-commands/).
:::


## Global commands

First up, we'll introduce you to global application commands. These types of commands will be available in all guilds your bot has the `applications.commands` authorization, as well as in DMs.

::: tip
Global commands are cached for one hour. That means that new global commands will fan out slowly across all guilds and will only be guaranteed to be updated in an hour. Guild commands however update instantly. As such we recommend you use these for quick testing and global commands when they're ready for public use.
:::

So, to register a global command we'll be passing an `ApplicationCommandData` object to the `ApplicationCommandManager#create()` method as follows:

```js
client.once('ready', async () => {
	const data = {
		name: 'ping',
		description: 'Replies with Pong!',
	};

	const command = await client.application?.commands.create(data);
	console.log(command);
});
```

That's it! You've successfully created your first global application command! Let's move on to guild specific commands.


## Guild commands

Guild specific application commands are only available in the guild they have been created in, as such we'll be using `GuildApplicationCommandManager#create()` to create them:

```js {7}
client.once('ready', async () => {
	const data = {
		name: 'ping',
		description: 'Replies with Pong!',
	};

	const command = await client.guilds.cache.get('123456789012345678')?.commands.create(data);
	console.log(command);
});
```

Excellent! Now you've learned how to register guild specific application commands. We're not done yet, there's still a few more topics to cover, keep reading!


## Bulk-update commands

If you, for example, deploy your application commands when starting your application, you may want to update all commands and their changes at once. You can do this by passing an array of `ApplicationCommandData` objects to the `set()` method on either of the managers you've been introduced to above: 

::: danger
This will overwrite all existing commands on the application or guild with the new data you provided!
:::

```js {2-11,13-14}
client.once('ready', async () => {
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
});
```

Perfect! You have now learned how to bulk-update application commands. 


## Options

Application commands can have `options`, think of these options like arguments to a function. You can specify them as seen below:

```js {5-10}
client.once('ready', async () => {
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
});
```

Notice how we specified `required: true` within the options object? Doing this will make the option a required field and will prevent the user from sending the command without specifying a value for this option!

Now you've learned how to create an application command with `options`. Keep reading, we have two more sections to cover!

## Option types

As you've seen in the example of the last section we can specify the `type` of an `ApplicationCommandOption`. Listed below you'll find a list of all possible values you can pass as `ApplicationCommandOptionType`:

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
