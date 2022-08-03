# Select menus

With the components API, you can create interactive message components. On this page, we'll cover how to send, receive, and respond to select menus using discord.js!

::: tip
This page is a follow-up to the [interactions (slash commands) page](/interactions/slash-commands.md). Please carefully read those first so that you can understand the methods used in this section.
:::

## Building and sending select menus

Select menus are one of the `MessageComponent` classes, which can be sent via messages or interaction responses. A select menu, as any other message component, must be in an `ActionRow`.

::: warning
You can have a maximum of five `ActionRow`s per message, and one select menu within an `ActionRow`.
:::

To create a select menu, use the <DocsLink path="class/ActionRowBuilder"/> and <DocsLink path="class/SelectMenuBuilder"/> classes. Then, pass the resulting row object to <DocsLink path="class/ChatInputCommandInteraction?scrollTo=reply" /> in the `components` array of <DocsLink path="typedef/InteractionReplyOptions" />:

```js {1,7-24,26}
const { ActionRowBuilder, SelectMenuBuilder } = require('discord.js');

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		const row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
					.addOptions(
						{
							label: 'Select me',
							description: 'This is a description',
							value: 'first_option',
						},
						{
							label: 'You can select me too',
							description: 'This is also a description',
							value: 'second_option',
						},
					),
			);

		await interaction.reply({ content: 'Pong!', components: [row] });
	}
});
```

::: tip
The custom id is a developer-defined string of up to 100 characters. Use this field to ensure you can uniquely define all incoming interactions from your select menus!
:::

Restart your bot and then send the command to a channel your bot has access to. If all goes well, you should see something like this:

<!--- vue-discord-message doesn't yet have support for select menus
<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
</DiscordMessages>
-->
![select](./images/select.png)

You can also send message components within an ephemeral response or alongside message embeds.

```js {1,12-16,18}
const { ActionRowBuilder, EmbedBuilder, SelectMenuBuilder } = require('discord.js');

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
			.setURL('https://discord.js.org/')
			.setDescription('Some description here');

		await interaction.reply({ content: 'Pong!', ephemeral: true, embeds: [embed], components: [row] });
	}
});
```

Restart your bot and then send the command to a channel your bot has access to. If all goes well, you should see something like this:

<!--- vue-discord-message doesn't yet have support for select menus
<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
				:ephemeral="true"
			>ping</DiscordInteraction>
		</template>
		Pong! (+ components)
		<template #embeds>
			<DiscordEmbed
				border-color="#0099ff"
				embed-title="Some title"
				url="https://discord.js.org"
			>
				Some description here
			</DiscordEmbed>
		</template>
	</DiscordMessage>
</DiscordMessages>
-->
![selectephem](./images/selectephem.png)

::: warning
If you're using TypeScript you'll need to specify the type of components your action row holds. This can be done by specifying the component builder you will add to it using a generic parameter in <DocsLink path="class/ActionRowBuilder"/>.

```diff
- new ActionRowBuilder()
+ new ActionRowBuilder<SelectMenuBuilder>()
```
:::

Now you know all there is to building and sending a `SelectMenu`! Let's move on to how to receive menus!

## Receiving select menu interactions

### Component collectors

Message component interactions can be collected within the scope of the slash command that sent them by utilising an <DocsLink path="class/InteractionCollector"/>, or their promisified `awaitMessageComponent` variant. These both provide instances of the <DocsLink path="class/MessageComponentInteraction"/> class as collected items.

::: tip
You can create the collectors on either a `message` or a `channel`.
:::

For a detailed guide on receiving message components via collectors, please refer to the [collectors guide](/popular-topics/collectors.md#interaction-collectors).

### The interactionCreate event

To receive a <DocsLink path="class/SelectMenuInteraction"/>, attach an <DocsLink path="class/Client?scrollTo=e-interactionCreate" /> event listener to your client and use the <DocsLink path="class/BaseInteraction?scrollTo=isSelectMenu"/> type guard to make sure you only receive select menus:

```js {2}
client.on('interactionCreate', interaction => {
	if (!interaction.isSelectMenu()) return;
	console.log(interaction);
});
```

## Responding to select menus

The <DocsLink path="class/MessageComponentInteraction"/> class provides the same methods as the <DocsLink path="class/ChatInputCommandInteraction"/> class. These methods behave equally:
- `reply()`
- `editReply()`
- `deferReply()`
- `fetchReply()`
- `deleteReply()`
- `followUp()`

### Updating the select menu's message

The <DocsLink path="class/MessageComponentInteraction"/> class provides an <DocsLink path="class/MessageComponentInteraction?scrollTo=update" /> method to update the message the select menu is attached to. Passing an empty array to the `components` option will remove any menus after an option has been selected.

This method should be used in favour of `editReply()` on the original interaction, to ensure you respond to the select menu interaction.

```js {1,4-6}
client.on('interactionCreate', async interaction => {
	if (!interaction.isSelectMenu()) return;

	if (interaction.customId === 'select') {
		await interaction.update({ content: 'Something was selected!', components: [] });
	}
});
```

### Deferring and updating the select menu's message

Additionally to deferring the response of the interaction, you can defer the menu, which will trigger a loading state and then revert back to its original state:

```js {1,6-10}
const wait = require('node:timers/promises').setTimeout;

client.on('interactionCreate', async interaction => {
	if (!interaction.isSelectMenu()) return;

	if (interaction.customId === 'select') {
		await interaction.deferUpdate();
		await wait(4000);
		await interaction.editReply({ content: 'Something was selected!', components: [] });
	}
});
```

## Multi-select menus

A select menu is not bound to only one selection; you can specify a minimum and maximum amount of options that must be selected. You can use <DocsLink path="class/SelectMenuBuilder?scrollTo=setMinValues" /> and <DocsLink path="class/SelectMenuBuilder?scrollTo=setMaxValues" /> to determine these values.

```js {1,7-31,33}
const { ActionRowBuilder, SelectMenuBuilder } = require('discord.js');

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		const row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
					.setMinValues(2)
					.setMaxValues(3)
					.addOptions([
						{
							label: 'Select me',
							description: 'This is a description',
							value: 'first_option',
						},
						{
							label: 'You can select me too',
							description: 'This is also a description',
							value: 'second_option',
						},
						{
							label: 'I am also an option',
							description: 'This is a description as well',
							value: 'third_option',
						},
					]),
			);

		await interaction.reply({ content: 'Pong!', components: [row] });
	}
});
```
