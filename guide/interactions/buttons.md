# Buttons

With the components API, you can create interactive message components. On this page, we'll cover how to send, receive, and respond to buttons using discord.js!

::: tip
This page is a follow-up to the [interactions (slash commands) page](/interactions/slash-commands.md). Please carefully read those first so that you can understand the methods used in this section.
:::

## Building and sending buttons

Buttons are part of the `MessageComponent` class, which can be sent via messages or interaction responses. A button, as any other message component, must be in an `ActionRow`.

::: warning
You can have a maximum of five `ActionRow`s per message, and five buttons within an `ActionRow`.
:::

To create a button, use the `ActionRowBuilder()` and `ButtonBuilder()` functions and then pass the resulting object to `ChatInputCommandInteraction#reply()` as `InteractionReplyOptions`:

```js {1,7-13,15}
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('primary')
					.setLabel('Primary')
					.setStyle(ButtonStyle.Primary),
			);

		await interaction.reply({ content: 'Pong!', components: [row] });
	}
});
```

::: tip
The custom ID is a developer-defined string of up to 100 characters.
:::

Restart your bot and then send the command to a channel your bot has access to. If all goes well, you should see something like this:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
		<template #actions>
			<DiscordButtons>
				<DiscordButton>Primary</DiscordButton>
			</DiscordButtons>
		</template>
	</DiscordMessage>
</DiscordMessages>

You can also send message components within an ephemeral response or alongside message embeds.

```js {1,12-16,18}
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		const row = new ActionRowBuilder()
			.addComponents(
				// ...
			);

		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Some title')
			.setURL('https://discord.js.org')
			.setDescription('Some description here');

		await interaction.reply({ content: 'Pong!', ephemeral: true, embeds: [embed], components: [row] });
	}
});
```

::: warning
If you're using typescript you'll need to specify the type of components your action row holds. This can be done by specifying the generic parameter in `ActionRowBuilder`.

```diff
- new ActionRowBuilder()
+ new ActionRowBuilder<MessageActionRowComponentBuilder>()
```
:::

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
		<template #embeds>
			<DiscordEmbed
				border-color="#0099ff"
				embed-title="Some title"
				url="https://discord.js.org"
			>
				Some description here
			</DiscordEmbed>
		</template>
		<template #actions>
			<DiscordButtons>
				<DiscordButton>Primary</DiscordButton>
			</DiscordButtons>
		</template>
	</DiscordMessage>
</DiscordMessages>

### Disabled buttons

If you want to prevent a button from being used, but not remove it from the message, you can disable it with the `setDisabled()` method:

```js {5}
const button = new ButtonBuilder()
	.setCustomId('primary')
	.setLabel('Primary')
	.setStyle(ButtonStyle.Primary)
	.setDisabled(true);
```

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
		<template #actions>
			<DiscordButtons>
				<DiscordButton :disabled="true">Primary</DiscordButton>
			</DiscordButtons>
		</template>
	</DiscordMessage>
</DiscordMessages>

### Emoji buttons

If you want to use a guild emoji within a `ButtonBuilder`, you can use the `setEmoji()` method:

```js {5}
const button = new ButtonBuilder()
	.setCustomId('primary')
	.setLabel('Primary')
	.setStyle(ButtonStyle.Primary)
	.setEmoji('123456789012345678');
```

Now you know all there is to building and sending a Button! Let's move on to receiving button interactions!

## Receiving buttons

To receive a `ButtonInteraction`, attach an event listener to your client and use the `Interaction#isButton()` type guard to make sure you only receive buttons:

```js {2}
client.on('interactionCreate', interaction => {
	if (!interaction.isButton()) return;
	console.log(interaction);
});
```

## Component collectors

These work quite similarly to message and reaction collectors, except that you will receive instances of the `MessageComponentInteraction` class as collected items.

::: tip
You can create the collectors on either a `message` or a `channel`.
:::

For a detailed guide on receiving message components via collectors, please refer to the [collectors guide](/popular-topics/collectors.md#interaction-collectors).

## Responding to buttons

The `MessageComponentInteraction` class provides the same methods as the `CommandInteraction` class. These methods behave equally:
- `reply()`
- `editReply()`
- `deferReply()`
- `fetchReply()`
- `deleteReply()`
- `followUp()`

### Updating the button message

The `MessageComponentInteraction` class provides an `update()` method to update the message the button is attached to. Passing an empty array to the `components` option will remove any buttons after one has been clicked.

<!-- eslint-skip -->

```js {6}
const filter = i => i.customId === 'primary' && i.user.id === '122157285790187530';

const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

collector.on('collect', async i => {
	await i.update({ content: 'A button was clicked!', components: [] });
});

collector.on('end', collected => console.log(`Collected ${collected.size} items`));
```

### Deferring and updating the button message

In addition to deferring an interaction response, you can defer the button, which will trigger a loading state and then revert to its original state:

<!-- eslint-skip -->

```js {1,7-9}
const wait = require('node:timers/promises').setTimeout;

// ...

collector.on('collect', async i => {
	if (i.customId === 'primary') {
		await i.deferUpdate();
		await wait(4000);
		await i.editReply({ content: 'A button was clicked!', components: [] });
	}
});

collector.on('end', collected => console.log(`Collected ${collected.size} items`));
```


## Button styles

Currently there are five different button styles available:
- `Primary`, a blurple button;
- `Secondary`, a grey button;
- `Success`, a green button;
- `Danger`, a red button;
- `Link`, a button that navigates to a URL.

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #actions>
			<DiscordButtons>
				<DiscordButton>Primary</DiscordButton>
				<DiscordButton type="secondary">Secondary</DiscordButton>
				<DiscordButton type="success">Success</DiscordButton>
				<DiscordButton type="danger">Danger</DiscordButton>
				<DiscordButton type="link" url="https://discord.js.org">Link</DiscordButton>
			</DiscordButtons>
		</template>
	</DiscordMessage>
</DiscordMessages>

::: warning
Only `Link` buttons can have a `url`. `Link` buttons _cannot_ have a `customId` and _do not_ send an interaction event when clicked.
:::
