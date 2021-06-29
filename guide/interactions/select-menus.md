# Select menus

With the components API, you can create interactive message components. In this page, we'll be focusing on how to send, receive, and respond to select menus using discord.js!

::: tip
This page is a follow-up to the [CommandInteraction guide pages](/interactions/registering-slash-commands/). Please carefully read those first so that you can understand the methods used in this section.
:::

## Building and sending select menus

Select menus are part of the `MessageComponent` class, which can be sent via messages or interaction responses. A select menu, as any other message component, must be in an `ActionRow`.

::: warning
You can have a maximum of:
- five `ActionRows` per message
- one select menu within an `ActionRow`
:::

To create a select menu, use the `MessageActionRow()` and `MessageSelector()` builder functions and then pass the resulting object to `CommandInteraction#reply()` as `InteractionReplyOptions`, like so:

```js {1,7-24,26}
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

client.on('interaction', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomID('select')
					.setPlaceholder('Nothing selected')
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
					]),
			);

		await interaction.reply({ content: 'Pong!', components: [row] });
	}
});
```

::: tip
The custom ID is a developer-defined string of up to 100 characters.
:::

Restart your bot and then send the command to a channel your bot has access to. If all goes well, you should see something like this:

<!--- vue-discord-message doesn't yet have support for inline replies/interactions/ephemeral messages/components -->
<div is="discord-messages">
	<discord-message profile="user">
		/ping
	</discord-message>
	<discord-message profile="bot">
		Pong! (+ components)
	</discord-message>
</div>

You can also send message components within an ephemeral response or alongside message embeds.

```js {1,26-30,32}
const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');

client.on('interaction', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomID('select')
					.setPlaceholder('Nothing selected')
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
					]),
			);

		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Some title')
			.setURL('https://discord.js.org/')
			.setDescription('Some description here');

		await interaction.reply({ content: 'Pong!', ephemeral: true, embeds: [embed], components: [row] });
	}
});
```

Restart your bot and then send the command to a channel your bot has access to. If all goes well, you should see something like this:

<!--- vue-discord-message doesn't yet have support for inline replies/interactions/ephemeral messages/components -->
<div is="discord-messages">
	<discord-message profile="bot">
		Pong! (ephemeral + components)
		<discord-embed
			slot="embeds"
			color="#0099ff"
			title="Some title"
			url="https://discord.js.org/"
		>
			Some description here
		</discord-embed>
	</discord-message>
</div>

Additionally, if you don't want to construct an `ActionRow` every time, you can also pass an array of arrays containing components like this:

```js {7-21,23}
const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');

client.on('interaction', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		const menu = new MessageSelectMenu()
			.setCustomID('select')
			.setPlaceholder('Nothing selected')
			.addOptions([
				{
					label: 'Select me',
					description: 'This is a description',
					value: 'first_selection',
				},
				{
					label: 'You can select me too',
					description: 'This is also a description',
					value: 'second_selection',
				},
			]);

		await interaction.reply({ content: 'Pong!', ephemeral: true, embeds: [embed], components: [[menu]] });
	}
});
```

Now you know all there is to building and sending a `SelectMenu`! Let's move on to how to receive selected options!

## Receiving select menu options

## Receiving Select menus

To receive a `SelectMenuInteractionInteraction`, simply attach an event listener to your client and also use the `Interaction#isSelectMenu()` typeguard to make sure you only receive select menus:

```js {2}
client.on('interaction', interaction => {
	if (!interaction.isSelectMenu()) return;
	console.log(interaction);
});
```

## Component collectors

These work quite similarly to message and reaction collectors, except that you will receive instances of the `MessageComponentInteraction` class as collected items.

::: tip
You can create the collectors on either a `message` or a `channel`.
:::

### MessageComponentInteractionCollector

Here's how you can create a basic event-based `MessageComponentInteractionCollector`:

```js {5,7,9-10}
client.on('interaction', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		const filter = i => i.customID === 'select' && i.user.id === '122157285790187530';

		const collector = interaction.channel.createMessageComponentInteractionCollector({ filter, time: 15000 });

		collector.on('collect', i => console.log(`Collected ${i.customID}`));
		collector.on('end', collected => console.log(`Collected ${collected.size} items`));
	}
});
```

::: danger
For ephemeral responses you cannot fetch a message object, so create the collector on a channel instead.
:::

### awaitMessageComponentInteraction

As with other types of collectors, you can also use a promise-based collector.

::: warning
Unlike other promise-based collectors, this one only collects a single item!
:::

```js {7-9}
client.on('interaction', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		const filter = i => i.customID === 'select' && i.user.id === '122157285790187530';

		interaction.channel.awaitMessageComponentInteraction({ filter, time: 15000 })
			.then(i => console.log(`${i.customID} was selected!`))
			.catch(console.error);
	}
});
```


## Responding to select menus

The `MessageComponentInteraction` class provides the same methods as the `CommandInteraction` class. These methods behave equally:
- `reply()`
- `editReply()`
- `defer()`
- `fetchReply()`
- `deleteReply()`
- `followUp()`

### Updating the select menu's message

The `MessageComponentInteraction` class provides a method to update the message the button is attached to, by using `MessageComponentInteraction#update()`. Passing an empty array to the `components` option will remove any menus after an option has been selected.

```js {1,4-6}
client.on('interaction', async interaction => {
	if (!interaction.isSelectMenu()) return;

	if (interaction.customID === 'select') {
		await interaction.update({ content: 'Something was selected!', components: [] });
	}
});
```

### Deferring and updating the select menu's message

Additionally to deferring the response of the interaction, you can defer the menu, which will trigger a loading state and then revert back to its original state:

```js {1,6-10}
const wait = require('util').promisify(setTimeout);

client.on('interaction', async interaction => {
	if (!interaction.isSelectMenu()) return;

	if (interaction.customID === 'select') {
		await interaction.deferUpdate();
		await wait(4000);
		await interaction.editReply({ content: 'Something was selected!', components: [] });
	}
});
```

## Multi-select menus

A select menu is not bound to only one selection; you can specify a minimum and maximum amount of options that must be selected. You can use `MessageSelectMenu#setMinValues()` and `MessageSelectMenu#setMaxValues()` to determine these values.

```js {1,7-31,33}
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

client.on('interaction', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomID('select')
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
