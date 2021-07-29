# Replying to slash commands

Discord provides developers the option to create client-integrated slash commands. In this section, we'll cover how to respond to these commands using discord.js!

::: tip
You need at least one slash command registered on your application to continue with the instructions on this page. If you haven't done that yet, refer to [the previous page](/interactions/registering-slash-commands/).
:::

## Receiving interactions

Every slash command is an `interaction`, so to respond to a command, you need to set up an event listener that will execute code when your application receives an interaction:

```js
client.on('interactionCreate', interaction => {
	console.log(interaction);
});
```

However, not every interaction is a slash command (e.g. `MessageComponent`s). Make sure to only receive slash commands by making use of the `CommandInteraction#isCommand()` method:

```js {2}
client.on('interactionCreate', interaction => {
	if (!interaction.isCommand()) return;
	console.log(interaction);
});
```

## Responding to a command

There are multiple ways of responding to a slash command, each of these are covered in the following segments.
The most common way of sending a response is by using the `CommandInteraction#reply()` method:

::: warning
Initially an interaction token is only valid for three seconds, so that's the timeframe in which you are able to use the `CommandInteraction#reply()` method. Responses that require more time ("Deferred Responses") are explained later in this page.
:::

```js {1,4-6}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
	}
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

```js {5}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply({ content: 'Pong!', ephemeral: true });
	}
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

## Editing responses

After you've sent an initial response, you may want to edit that response for various reasons. This can be achieved with the `CommandInteraction#editReply()` method:

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

## Deferred responses

As previously mentioned, you have three seconds to respond to an interaction before its token becomes invalid. But what if you have a command that performs a task which takes longer than three seconds before being able to reply?

In this case, you can make use of the `CommandInteraction#defer()` method, which triggers the `<application> is thinking...` message and also acts as initial response. This allows you 15 minutes to complete your tasks before responding.
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

If you have a command that performs longer tasks, be sure to call `defer()` as early as possible.

You can also pass an `ephemeral` flag to the `InteractionDeferOptions`:

<!-- eslint-skip -->

```js
await interaction.defer({ ephemeral: true });
```

## Follow-ups

Replying to slash commands is great and all, but what if you want to send multiple responses instead of just one? Follow-up messages got you covered, you can use `CommandInteraction#followUp()` to send multiple responses:

::: warning
After the initial response, an interaction token is valid for 15 minutes, so this is the timeframe in which you can edit the response and send follow-up messages.
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

You can also pass an `ephemeral` flag to the `InteractionReplyOptions`:

<!-- eslint-skip -->

```js
await interaction.followUp({ content: 'Pong again!', ephemeral: true });
```

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
Interaction responses can use masked links (e.g. `[text](http://site.com)`) and global emojis in the message content.
:::

## Parsing options

In this section, we'll cover how to access the values of a command's options. Let's assume you have a command that contains the following options:

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
			name: 'int',
			description: 'Enter an integer',
			type: 'INTEGER',
		},
		{
			name: 'num',
			description: 'Enter a number',
			type: 'NUMBER',
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
		{
			name: 'mentionable',
			description: 'Mention something',
			type: 'MENTIONABLE',
		},
	],
};
```

You can `get()` these options from the `CommandInteractionOptionResolver` as shown below:

```js
const string = interaction.options.getString('input');
const integer = interaction.options.getInteger('int');
const number = interaction.options.getNumber('num');
const boolean = interaction.options.getBoolean('choice');
const user = interaction.options.getUser('target');
const member = interaction.options.getMember('target');
const channel = interaction.options.getChannel('destination');
const role = interaction.options.getRole('muted');
const mentionable = interaction.options.getMentionable('mentionable');

console.log([string, integer, boolean, user, member, channel, role, mentionable]);
```

::: tip
If you want the Snowflake of a structure instead, grab the option via `get()` and access the Snowflake via the `value` property. Note that you should use `const { value: name } = ...` here to [destructure and rename](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) the value obtained from the <DocsLink path="typedef/CommandInteractionOption">`CommandInteractionOption`</DocsLink> structure to avoid identifier name conflicts.
:::

## Fetching and deleting responses

::: danger
You _cannot_ fetch nor delete an ephemeral message.
:::

In addition to replying to a slash command, you may also want to delete the initial reply. You can use `CommandInteraction#deleteReply()` for this:

<!-- eslint-skip -->

```js {2}
await interaction.reply('Pong!');
await interaction.deleteReply();
```

Lastly, you may require the `Message` object of a reply for various reasons, such as adding reactions. You can use the `CommandInteraction#fetchReply()` method to fetch the `Message` instance of an initial response:

<!-- eslint-skip -->

```js
await interaction.reply('Pong!');
const message = await interaction.fetchReply();
console.log(message);
```
