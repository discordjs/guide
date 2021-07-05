# Replying to slash commands

Discord provides users the option to create client-integrated slash commands. In this section you'll be learning how to respond to these commands using discord.js!

::: tip
You need to have at least one slash command set-up for your application to follow the instructions on this page. If you haven't done that yet, refer to [the previous page](/interactions/registering-slash-commands/).
:::


## Receiving interactions

Every slash command is an `interaction`, so to respond to a command you need to set up an event listener that will execute code when your application receives an interaction:

```js
client.on('interactionCreate', interaction => {
	console.log(interaction);
});
```
::: tip
You can easily adapt the command handler from earlier sections of the guide to work with interactions and thereby organize your commands properly!
:::

However, not every interaction is a slash command (e.g. `MessageComponent`'s). Make sure to only receive slash commands by making use of the `CommandInteraction#isCommand()` method:

```js {2}
client.on('interactionCreate', interaction => {
	if (!interaction.isCommand()) return;
	console.log(interaction);
});
```


## Responding to a command

There are multiple ways of responding to a slash command, we'll be covering each of these in the following segments.
The most common way of sending a response is by using the `CommandInteraction#reply()` method:

::: warning
Initially an interaction token is only valid for three seconds, so that's the timeframe in which you are able to use the `CommandInteraction#reply()` method. Responses that require more time ("Deferred Responses") are explained later in this page.
:::

```js {1,3}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	if (interaction.commandName === 'ping') await interaction.reply('Pong!');
});
```

Restart your bot and then send the command to a channel your bot has access to. If all goes well, you should see something like this:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
</DiscordMessages>

You've successfully sent a response to a slash command! This is only the beginning, there's more to look out for so let's move on to further ways of replying to a command!


## Ephemeral responses

You may not always want everyone who has access to the channel to see a slash command's response. Thankfully, Discord implemented a way to hide messages from everyone but the executor of the slash command. This type of message is called `ephemeral` and can be set by using `ephemeral: true` in the `InteractionReplyOptions`, as follows:

```js {3}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	if (interaction.commandName === 'ping') await interaction.reply({ content: 'Pong!', ephemeral: true });
});
```

Now when you run your command again, you should see something like this:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
				:ephemeral="true"
			>ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
</DiscordMessages>

That's it! You've successfully sent an ephemeral response to a slash command. There's still more to cover, so let's move on to the next topic!

## Editing responses

After you've sent an initial response, you may want to edit that response for various reasons. This can be easily achieved by making use of the `CommandInteraction#editReply()` method, as seen below:

::: warning
After the initial response, an interaction token is valid for 15 minutes, so this is the timeframe in which you can edit the response and send follow-up messages.
:::

```js {1,8-9}
const wait = require('util').promisify(setTimeout);

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
		await wait(2000);
		await interaction.editReply('Pong again!');
	}
});
```

Excellent, now you've successfully edited the response of a slash command!

## Deferred responses

As previously mentioned, you have three seconds to respond to an interaction before its token becomes invalid. But what if you have a command that performs a task which takes longer than three seconds before being able to reply?

In this case you can make use of the `CommandInteraction#defer()` method, which triggers the `<application> is thinking...` message and also acts as initial response. This in turn gives you 15 minutes time to complete your tasks before responding:
<!--- here either display the is thinking message via vue-discord-message or place a screenshot -->

```js {7-9}
const wait = require('util').promisify(setTimeout);

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.defer();
		await wait(4000);
		await interaction.editReply('Pong!');
	}
});
```

As you can see, you are now able to respond to your command even if you surpass the initial three-second timeframe! If you have a command that performs longer tasks, be sure to call `defer()` as soon as possible.

But what if you want the deferred response to be ephemeral? Fear not, you can pass an `ephemeral` flag to the `defer()` method as outlined below, making the deferred response ephemeral:

```js {7}
const wait = require('util').promisify(setTimeout);

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.defer({ ephemeral: true });
		await wait(4000);
		await interaction.editReply('Pong!');
	}
});
```

Perfect, now you know how to reply to a slash command when you have to perform time intensive tasks!

## Follow-ups

Replying to slash commands is great and all, but what if you want to send multiple responses instead of just one? Follow-up messages got you covered, you can use `CommandInteraction#followUp()` to send multiple responses:

::: warning
After the initial response an interaction token is valid for 15 minutes, so this is the timeframe in which you can edit the response and send follow-up messages.
:::

```js {6}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
		await interaction.followUp('Pong again!');
	}
});
```

If you run this code you should end up having something that looks like this:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="bot">Pong!</DiscordInteraction>
		</template>
		Pong again!
	</DiscordMessage>
</DiscordMessages>

Now you may want to send an ephemeral follow-up, to do so, just repeat the procedure as follows and also pass in `ephemeral: true` to the `InteractionReplyOptions`:

```js {6}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
		await interaction.followUp({ content: 'Pong again!', ephemeral: true });
	}
});
```

If you run this code you should end up having something that looks like this:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="bot" :ephemeral="true">Pong!</DiscordInteraction>
		</template>
		Pong again!
	</DiscordMessage>
</DiscordMessages>

That's all, now you know everything there is to know on how to reply to slash commands! 

::: tip
Interaction responses can use masked links and global emojis (they do not have to be in the guild the emoji is uploaded to) in the message content.
:::

## Parsing options

If you have a command that contains options, chances are you want to access their values in your code, so let's se how to that. 

Let's assume you have a command that contains the following options:

```js {4-35}
const data = {
	name: 'ping',
	description: 'Replies with Pong!',
	options: [
		{
			name: 'input',
			description: 'Enter a string',
			type: 'STRING',
		},
		{
			name: 'num',
			description: 'Enter an integer',
			type: 'INTEGER',
		},
		{
			name: 'choice',
			description: 'Select a boolean',
			type: 'BOOLEAN',
		},
		{
			name: 'target',
			description: 'Select a user',
			type: 'USER',
		},
		{
			name: 'destination',
			description: 'Select a channel',
			type: 'CHANNEL',
		},
		{
			name: 'muted',
			description: 'Select a role',
			type: 'ROLE',
		},
	],
};
```

You would `get()` these options from the `CommandInteraction#options` collection like this:

```js {5-11,13}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		const { value: string } = interaction.options.get('input');
		const { value: integer } = interaction.options.get('num');
		const { value: boolean } = interaction.options.get('choice');
		const { user } = interaction.options.get('target');
		const { member } = interaction.options.get('input');
		const { channel } = interaction.options.get('destination');
		const { role } = interaction.options.get('muted');

		console.log([string, integer, boolean, user, member, channel, role]);
		await interaction.reply('Pong!');
	}
});
```

::: tip
If you want the snowflake of a structure instead, you can retrieve that by accesing it with the `value` property.
:::

## Fetching and deleting responses

::: danger
You can _not_ fetch nor delete an ephemeral message.
:::

Additionally to replying to a slash command you may also want to delete the initial reply. You can do this by using `CommandInteraction#deleteReply()` like this:

```js {6}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
		await interaction.deleteReply();
	}
});
```

Lastly, you may require the `Message` object of a reply for various reasons, such as adding reactions. To retrieve the message instance of an interaction response you can use the `CommandInteraction#fetchReply()` method to fetch the initial response:

```js {6,7}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
		const message = await interaction.fetchReply();
		console.log(message);
	}
});
```
