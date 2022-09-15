# Buttons

With the components API, you can create interactive buttons and select menus to further enhance the functionality and user experience of your slash commands. On this page, we'll cover how to send, receive, and respond to buttons using discord.js!

::: tip
This page is a follow-up to the [slash commands](/application-commands/advanced-creation.md) section. Please carefully read those first so that you can understand the methods used in this section.
:::

Buttons are one of the `MessageComponent` classes, which can be sent via messages or interaction responses.

## Creating buttons

For this example, we're going to take our `ban` command from the [Parsing options](/slash-commands/parsing-options.md#command-options) section and add a confirmation workflow. Let's start by creating two buttons using the <DocsLink path="class/ButtonBuilder"/> class.

```js {6-10,12-16}
const { ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	// data: new SlashCommandBuilder()...
	async execute(interaction) {
		const target = interaction.options.getUser('target');

		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary);

		const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm')
			.setStyle(ButtonStyle.Danger);
	},
};
```

::: tip
There are UX principles in play when creating buttons! We've created a Secondary (grey) Cancel button for the less important action, and a Danger (red) Confirm button for the "destructive" ban action!
:::

In order to send any type of message component, they must be placed in an `ActionRow`. Each row can contain up to 5 buttons or 1 select menu, up to a total of 5 rows in a message. To create one, we'll use the <DocsLink path="class/ActionRowBuilder"/> class, add our buttons to it, then send it in the `InteractionReplyOptions#components` array.

```js {1,18-19,21-25}
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	// data: new SlashCommandBuilder()...
	async execute(interaction) {
		const target = interaction.options.getUser('target');

		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary);

		const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm')
			.setStyle(ButtonStyle.Danger);

		const row = new ActionRowBuilder()
			.addComponents(cancel, confirm);

		interaction.reply({
			content: `Are you sure you want to ban ${target.username}?`,
			components: [row],
		});
	},
};
```

Restart your bot and test your ban command. If all goes well, you should see something like this.

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">button</DiscordInteraction>
		</template>
		Are you sure you want to ban DiscordTroll69?
		<template #actions>
			<DiscordButtons>
				<DiscordButton type="secondary">Cancel</DiscordButton>
			</DiscordButtons>
			<DiscordButtons>
				<DiscordButton type="danger">Confirm</DiscordButton>
			</DiscordButtons>
		</template>
	</DiscordMessage>
</DiscordMessages>

::: warning
If you're using TypeScript you'll need to specify the type of components your action row holds. This can be done by specifying the component builder you will add to it using a generic parameter in <DocsLink path="class/ActionRowBuilder"/>.

```diff
- new ActionRowBuilder()
+ new ActionRowBuilder<ButtonBuilder>()
```
:::

## Receiving button interactions

Our buttons created and shown to the user, but there's no functionality behind them yet. For this confirmation workflow, your bot is expecting a single `ButtonInteraction` to be received before it can continue. The best way to handle this is with the <DocsLink path="class/Message?scrollTo?=awaitMessageComponent" /> method. This method wraps a Promise around an `InteractionCollector` to return only the first interaction that meets the criteria - checkout the [full guide on Collectors]() for more information on those.

```js {6,10,12,15,17-20}
module.exports = {
	// data: new SlashCommandBuilder()...
	async execute(interaction) {
		// Build our buttons and row...

		const sentMessage = await interaction.reply({
			content: `Are you sure you want to ban ${target.username}?`,
			components: [row],
			fetchReply: true,
		});

		const filter = i => i.user.id === interaction.user.id;

		try {
			const btnInteraction = await sentMessage.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 60000 });
		} catch (err) {
			interaction.editReply({
				content: 'Ban confirmation timed out',
				components: [],
			});
		}
	},
};
```

A few things are happening here, so lets take a look at each one in order

* First, we need a reference to our reply message to attach the listener to, so we set `fetchReply: true` in our response.
* We then create a `filter` to ensure we only capture button clicks from the same user who initiated the original interaction. For anyone else, they'll see Discord's error notification since we aren't responding to those.
* We await a valid button interaction for up to 60 seconds.
* If `awaitMessageComponent` times out, an error is thrown, in which case we `catch` it, notify the user, and remove the buttons by calling `editReply` on the original interaction.

With everything else covered, the last thing to handle is a successful click from the user. 

## Responding to button interactions

Like slash commands, Discord must receive a response to a button interaction within three seconds. This can be a `reply()` or `deferReply()` to send a new message, or one of two methods unique to interactions coming from , `update()` and `deferUpdate()` which instead modify the original message or give you 15 minutes to do so respectively.

First though, we need to know which button the user clicked. We're going do that by checking the `ButtonInteraction#customId` then use `update()` to notify the user and remove the buttons by modifying the original message.

```js {7,9-17}
module.exports = {
	// data: new SlashCommandBuilder()...
	async execute(interaction) {
		// Send our buttons...

		try {
			const btnInteraction = await sentMessage.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 60000 });
			if (btnInteraction.customId === 'confirm') {
				await interaction.guild.members.ban(target);
				await interaction.update({
					content: `${target.username} has been banned`,
					components: [],
				});
			} else if (btnInteraction.customId === 'cancel') {
				await interaction.update({
					content: `Action cancelled`,
					components: [],
				});
			}
		} catch (err) {
			interaction.editReply({
				content: 'Ban confirmation timed out',
				components: [],
			});
		}
	},
};
```

That's it! Your ban command now has a confirmation step! 

### Disabled buttons

If you want to prevent a button from being used, but not remove it from the message, you can disable it with the <DocsLink path="class/ButtonBuilder?scrollTo=setDisabled"/> method:

```js {5}
const button = new ButtonBuilder()
	.setCustomId('primary')
	.setLabel('Click me!')
	.setStyle(ButtonStyle.Primary)
	.setDisabled(true);
```

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">button</DiscordInteraction>
		</template>
		I think you should,
		<template #actions>
			<DiscordButtons>
				<DiscordButton :disabled="true">Click me!</DiscordButton>
			</DiscordButtons>
		</template>
	</DiscordMessage>
</DiscordMessages>

### Emoji buttons

If you want to use a guild emoji within a <DocsLink path="class/ButtonBuilder"/>, you can use the <DocsLink path="class/ButtonBuilder?scrollTo=setEmoji"/> method:

```js {5}
const button = new ButtonBuilder()
	.setCustomId('primary')
	.setLabel('Primary')
	.setStyle(ButtonStyle.Primary)
	.setEmoji('123456789012345678');
```

Now you know all there is to building and sending a Button! Let's move on to receiving button interactions!

## Receiving button interactions

### Component collectors

Message component interactions can be collected within the scope of the slash command that sent them by utilising an <DocsLink path="class/InteractionCollector"/>, or their promisified `awaitMessageComponent` variant. These both provide instances of the <DocsLink path="class/MessageComponentInteraction"/> class as collected items.

::: tip
You can create the collectors on either a `message` or a `channel`.
:::

For a detailed guide on receiving message components via collectors, please refer to the [collectors guide](/popular-topics/collectors.md#interaction-collectors).

### The interactionCreate event

To receive a <DocsLink path="class/ButtonInteraction"/> event, attach an <DocsLink path="class/Client?scrollTo=e-interactionCreate"/> event listener to your client and use the <DocsLink path="class/BaseInteraction?scrollTo=isButton"/> type guard to make sure you only receive buttons:

```js {2}
client.on('interactionCreate', interaction => {
	if (!interaction.isButton()) return;
	console.log(interaction);
});
```

## Responding to buttons

The <DocsLink path="class/MessageComponentInteraction"/> class provides the same methods as the <DocsLink path="class/ChatInputCommandInteraction"/> class. These methods behave equally:
- `reply()`
- `editReply()`
- `deferReply()`
- `fetchReply()`
- `deleteReply()`
- `followUp()`

### Updating the button message

The <DocsLink path="class/MessageComponentInteraction"/> class also provides an <DocsLink path="class/MessageComponentInteraction?scrollTo=update"/> method to update the message the button is attached to. Passing an empty array to the `components` option will remove any buttons after one has been clicked.

This method should be used in favour of `editReply()` on the original interaction, to ensure you respond to the button interaction.

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

In addition to deferring an interaction response, you can defer the button update, which will trigger a loading state and then revert to its original state:

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
