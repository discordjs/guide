# Select menus

With the components API, you can create interactive message components. In this page, we'll be focusing on how to send, receive, and respond to select menus using discord.js!

::: danger
This page is a follow-up to the [CommandInteraction preview guide pages](https://deploy-preview-638--discordjs-guide.netlify.app/interactions/registering-slash-commands.html). Please carefully read those first so that you can understand the methods used in this section.
:::


## Building and sending select menus

Buttons are part of the `MessageComponent` class, which can be sent via messages or interaction responses. A button, as any other message component, must be in an `ActionRow`.

::: warning
You can have a maximum of:
- five `ActionRows` per message
- one select menu within an `ActionRow`
:::

Now, to create a select menu we use the `MessageActionRow()` and `MessageSelector()` builder functions and then pass the resulting object to `CommandInteraction#reply()` as `InteractionReplyOptions` like this:

```js {1,7-22,24}
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

client.on('interaction', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		const row = new MessageActionRow()
			.addComponents(new MessageSelectMenu()
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
				]));

		await interaction.reply('Pong!', { components: [row] });
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

You can of course also send message components within an ephemeral response or alongside message embeds:

```js {1,7-22}
const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');

client.on('interaction', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		const row = new MessageActionRow()
			.addComponents(new MessageSelectMenu()
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
				]));

		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Some title')
			.setURL('https://discord.js.org/')
			.setDescription('Some description here');

		await interaction.reply('Pong!', { ephemeral: true, embeds: [embed], components: [row] });
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

Now you know all there is to building and sending a `SelectMenu`! Let's move on to how to receive selected options!


## Receiving Select menus

Whilst you can receive and handle a `MessageComponentInteraction` via the interaction event, we reccomend you use one of the collectors we'll be covering in the next section. Now to receive a `MessageComponentInteraction`, simply attach an event listener to your client and also use the `Interaction#isMessageComponent()` typeguard to make sure you only receive component interactions:

```js {2}
client.on('interaction', interaction => {
	if (!interaction.isMessageComponent() && interaction.componentType !== 'SELECT_MENU') return;
	console.log(interaction);
});
```


## Component collectors

These work quite similarly to message and reaction collectors, except that you will receive instances of the `MessageComponentInteraction` class as collected items.

::: tip
You can create the collectors on either a `message` or a `channel`.
:::

### MessageComponentInteractionCollector

To create a basic event-based `MessageComponentInteractionCollector`, simply do as follows:

```js
client.on('message', message => {
	const filter = interaction => interaction.customID === 'select' && interaction.user.id === '122157285790187530';
	const collector = message.createMessageComponentInteractionCollector(filter, { time: 15000 });

	collector.on('collect', interaction => console.log(`Collected ${interaction.customID}`));
	collector.on('end', collected => console.log(`Collected ${collected.size} items`));
});
```

### awaitMessageComponentInteractions

As with other types of collectors, you can also use a promise-based collector like this:

```js {4-6}
client.on('message', message => {
	const filter = interaction => interaction.customID === 'primary' && interaction.user.id === '122157285790187530';

	message.awaitMessageComponentInteractions(filter, { time: 15000 })
		.then(collected => console.log(`Collected ${collected.size} interactions`))
		.catch(console.error);
});
```


## Responding to select menus

The `MessageComponentInteraction` class has similar methods as the `CommandInteraction` class, which we we'll be covering in the following section:

::: tip
The following methods behave exactly the same as on the `CommandInteraction` class:
- `reply()`
- `editReply()`
- `defer()`
- `fetchReply()`
- `deleteReply()`
- `followUp()`
:::

### Updating the select menu's message

The `MessageComponentInteraction` class provides a method to update the message the button is attached to, by using `MessageComponentInteraction#update()`. We'll be passing an empty array as components, which will remove the menu after selecting an option:

```js {1,3-5}
client.on('interaction', async interaction => {
	if (!interaction.isMessageComponent() && interaction.componentType !== 'SELECT_MENU') return;
	if (interaction.customID === 'select') {
		await interaction.update('Something was selected', { components: [] });
	}
});
```

### Deferring and updating the select menu's message

Additionally to deferring the response of the interaction, you can defer the button, which will trigger a loading state:

```js {1,5-9}
const wait = require('util').promisify(setTimeout);

client.on('interaction', async interaction => {
	if (!interaction.isMessageComponent() && interaction.componentType !== 'SELECT_MENU') return;
	if (interaction.customID === 'primary') {
		await interaction.deferUpdate();
		await wait(4000);
		await interaction.editReply('Something was selected!', { components: [] });
	}
});
```


## Multi-select menus

A select menu is not bound to only one selection; you can specify a minimum and maximum amount of options that must be selected. You can use `MessageSelectMenu#setMinValues()` and `MessageSelectMenu#setMaxValues()` to determine these values.

```js {1,7-30,32}
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

		await interaction.reply('Pong!', row);
	}
});
```
