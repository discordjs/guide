# Replying to slash commands

In this section, we'll cover how to respond to these commands using discord.js!

::: tip
You need at least one slash command registered on your application to continue with the instructions on this page. If you haven't done that yet, refer to [the previous section](/slash-commands/registering) on registering.
:::

## Receiving command interactions

Every slash command is an `interaction`, so to respond to a command, you need to create a listener for the `interactionCreate` event that will execute code when your application receives an interaction:

```js
client.on('interactionCreate', interaction => {
	console.log(interaction);
});
```

However, not every interaction is a slash command (e.g. `MessageComponent`s). Make sure to only receive and handle slash commands in this function by making use of the `BaseInteraction#isChatInputCommand()` method to exit if another type is encountered:

```js {2}
client.on('interactionCreate', interaction => {
	if (!interaction.isChatInputCommand()) return;
	console.log(interaction);
});
```

## Responding to a command

There are multiple ways of responding to a slash command; each of these are covered in the following segments. Using an interaction response method confirms to Discord that your bot successfully received the interaction, and has responded to the user. Discord enforces this to ensure that all slash commands provide a good user experience (UX). Failing to respond will cause Discord to show that the command failed, even if your bot is performing other actions as a result.

The most common way of sending a response is by using the `ChatInputCommandInteraction#reply()` method:

::: warning
Initially an interaction token is only valid for three seconds, so that's the timeframe in which you are able to use the `ChatInputCommandInteraction#reply()` method. Responses that require more time ("Deferred Responses") are explained later in this page.
:::

```js {1,4-6}
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

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

You've successfully sent a response to a slash command! This is only the beginning, so let's move on to further ways of replying to a command!

## Ephemeral responses

You may not always want everyone who has access to the channel to see a slash command's response. Previously, you would have had to DM the user to achieve this, potentially encountering the high rate limits associated with DM messages, or simplying being unable to if the user's DMs are disabled. 

Thankfully, Discord provides a way to hide resposne messages from everyone but the executor of the slash command. This type of message is called an `ephemeral` message and can be set by providing `ephemeral: true` in the `InteractionReplyOptions`, as follows:

```js {5}
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply({ content: 'Secret Pong!', ephemeral: true });
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

Ephemeral responses are *only* available for interaction responses; another great reason to switch across to the new and improved features.

## Editing responses

After you've sent an initial response, you may want to edit that response for various reasons. This can be achieved with the `ChatInputCommandInteraction#editReply()` method:

::: warning
After the initial response, an interaction token is valid for 15 minutes, so this is the timeframe in which you can edit the response and send follow-up messages. You also **cannot** edit the ephemeral state of a message, so ensure that your first response sets this correctly.
:::

```js {1,8-9}
const wait = require('node:timers/promises').setTimeout;

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
		await wait(2000);
		await interaction.editReply('Pong again!');
	}
});
```

In fact, editing your interaction response is necessary to [calculate the ping](popular-topics/faq#how-do-i-check-the-bot-s-ping) properly for this command.

## Deferred responses

As previously mentioned, Discord requires an acknowledgement from your bot within three seconds that the interaction was received. Otherwise, Discord considers the interaction to have failed and the token becomes invalid. But what if you have a command that performs a task which takes longer than three seconds before being able to reply?

In this case, you can make use of the `ChatInputCommandInteraction#deferReply()` method, which triggers the `<application> is thinking...` message. This also acts as the initial response, to confirm to Discord that the interaction was received successfully. This allows you 15 minutes to complete your tasks before responding.
<!--- here either display the is thinking message via vue-discord-message or place a screenshot -->

```js {7-9}
const wait = require('node:timers/promises').setTimeout;

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.deferReply();
		await wait(4000);
		await interaction.editReply('Pong!');
	}
});
```

If you have a command that performs longer tasks, be sure to call `deferReply()` as early as possible.

Note that if you want your response to be ephemeral, you must pass an `ephemeral` flag to the `InteractionDeferOptions` here:

<!-- eslint-skip -->

```js
await interaction.deferReply({ ephemeral: true });
```

It is not possible to edit a reply to change its ephemeral state once sent.

## Follow-ups

The `reply()` and `deferReply()` methods are both *initial* responses, which tell Discord that your bot successfully receieved the interaction, but cannot be used to send additional messages. This is where follow-up messages come in. After having initially responded to an interaction, you can use `ChatInputCommandInteraction#followUp()` to send additional messages:

::: warning
After the initial response, an interaction token is valid for 15 minutes, so this is the timeframe in which you can edit the response and send follow-up messages.
:::

```js {6}
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

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

Note that if you use `followUp()` after a `deferReply()`, the first follow-up will edit the `<application> is thinking` message rather than sending a new one.

That's all, now you know everything there is to know on how to reply to slash commands! 

::: tip
Interaction responses can use masked links (e.g. `[text](http://site.com)`) and global emojis in the message content.
:::

## Fetching and deleting responses

::: danger
You _cannot_ delete an ephemeral message.
:::

In addition to replying to a slash command, you may also want to delete the initial reply. You can use `ChatInputCommandInteraction#deleteReply()` for this:

<!-- eslint-skip -->

```js {2}
await interaction.reply('Pong!');
await interaction.deleteReply();
```

Lastly, you may require the `Message` object of a reply for various reasons, such as adding reactions. You can use the `ChatInputCommandInteraction#fetchReply()` method to fetch the `Message` instance of an initial response:

<!-- eslint-skip -->

```js
await interaction.reply('Pong!');
const message = await interaction.fetchReply();
console.log(message);
```

## Localized responses

In additional to the ability to provide localized command definitions, you can also localize your responses. To do this, get the locale of the user with `ChatInputCommandInteraction#locale` and respond accordingly:

```js
client.on('interactionCreate', interaction => {
	const locales = {
		pl: 'Witaj Świecie!',
		de: 'Hallo Welt!',
	};
	interaction.reply(locales[interaction.locale] ?? 'Hello World (default is english)');
});
```

## Further reading

Everything covered here has only focused on text responses to slash commands, but much more is available to enhance the user experience including:

* adding formatted [Embeds](/popular-topics/embeds) to your responses
* furthering the command functionality with [Buttons](/components/buttons) and [Select Menus](/components/select-menus)
* prompting the user for more information with [Modals](/modals/creating-modals.md)