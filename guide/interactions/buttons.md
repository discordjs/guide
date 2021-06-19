# Buttons

With the components API, you can create interactive message components. In this page, we'll be focusing on how to send, receive, and respond to buttons using discord.js!

::: danger
This page is a follow-up to the [CommandInteraction preview guide pages](https://deploy-preview-638--discordjs-guide.netlify.app/interactions/registering-slash-commands.html). Please carefully read those first so that you can understand the methods used in this section.
:::


## Building and sending buttons

Buttons are part of the `MessageComponent` class, which can be sent via messages or interaction responses. A button, as any other message component, must be in an `ActionRow`.

::: warning
You can have a maximum of:
- five `ActionRows` per message
- five buttons within an `ActionRow`
:::

To create a button, you use the `MessageActionRow()` and `MessageButton()` builder functions and then pass the resulting object to `CommandInteraction#reply()` as `InteractionReplyOptions`, like so:

```js {1,7-13,15}
const { MessageActionRow, MessageButton } = require('discord.js');

client.on('interaction', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomID('primary')
					.setLabel('primary')
					.setStyle('PRIMARY'),
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

```js {1,13-19}
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

client.on('interaction', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		const row = new MessageActionRow()
			.addComponents(new MessageButton()
				.setCustomID('primary')
				.setLabel('primary')
				.setStyle('PRIMARY'));

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

```js {7-10,18}
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

client.on('interaction', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		const button = new MessageButton()
			.setCustomID('primary')
			.setLabel('primary')
			.setStyle('PRIMARY');

		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Some title')
			.setURL('https://discord.js.org/')
			.setDescription('Some description here');

		await interaction.reply({ content: 'Pong!', ephemeral: true, embeds: [embed], components: [[button]] });
	}
});
```

### Disabled buttons

If you want to prevent a button from being used, but not remove it from the message, you can make use of the `setDisabled()` method, which will make it unclickable for everyone:

```js {13}
const { MessageActionRow, MessageButton } = require('discord.js');

client.on('interaction', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomID('primary')
					.setLabel('primary')
					.setStyle('PRIMARY')
					.setDisabled(true),
			);

		await interaction.reply({ content: 'Pong!', components: [row] });
	}
});
```

### Emoji buttons

The label of a button can hold unicode emojis, but if you want to use guild emojis you have to use the `setEmoji()` method like so:

```js {13}
const { MessageActionRow, MessageButton } = require('discord.js');

client.on('interaction', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomID('primary')
					.setLabel('primary')
					.setStyle('PRIMARY')
					.setEmoji('123456789012345678'),
			);

		await interaction.reply({ content: 'Pong!', components: [row] });
	}
});
```

Now you know all there is to building and sending a `MessageButton`! Let's move on to how to receive buttons!


## Receiving buttons

Whilst you can receive and handle a `ButtonInteraction` via the interaction event, we recommend you use one of the collectors we'll be covering in the next section. To receive a `ButtonInteraction`, attach an event listener to your client and use the `Interaction#isButton()` type guard to make sure you only receive component interactions.

```js {2}
client.on('interaction', interaction => {
	if (!interaction.isButton()) return;
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

```js {6,8,10-11}
client.on('interaction', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		const message = await interaction.fetchReply();
		const filter = i => i.customID === 'primary' && i.user.id === '122157285790187530';

		const collector = message.createMessageComponentInteractionCollector(filter, { time: 15000 });

		collector.on('collect', i => console.log(`Collected ${i.customID}`));
		collector.on('end', collected => console.log(`Collected ${collected.size} items`));
	}
});
```

::: danger
For ephemeral responses you cannot fetch a message object, so create the collector on a channel instead.
:::

### awaitMessageComponentInteraction

As with other types of collectors, you can also use a promise-based collector like this:

::: warning
Unlike other promise-based collectors, this one only collects a single item!
:::

```js 8-11}
client.on('interaction', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		const message = await interaction.fetchReply();
		const filter = i => i.customID === 'primary' && i.user.id === '122157285790187530';

		message.awaitMessageComponentInteraction(filter, { time: 15000 })
			.then(i => console.log(`${i.customID} was clicked!`))
			.catch(console.error);
	}
});
```


## Responding to buttons

The `MessageComponentInteraction` class has similar methods as the `CommandInteraction` class. These methods behave exactly the same as on the `CommandInteraction` class:
- `reply()`
- `editReply()`
- `defer()`
- `fetchReply()`
- `deleteReply()`
- `followUp()`

### Updating the button message

The `MessageComponentInteraction` class provides a method to update the message the button is attached to, by using `MessageComponentInteraction#update()`. Passing an empty array to the `components` option will remove any buttons after one has been clicked.

```js {11-13}
client.on('interaction', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		const message = await interaction.fetchReply();
		const filter = i => i.customID === 'primary' && i.user.id === '122157285790187530';

		const collector = message.createMessageComponentInteractionCollector(filter, { time: 15000 });

		collector.on('collect', async i => {
			if (i.customID === 'primary') {
				await i.update({ content: 'A button was clicked!', components: [] });
			}
		});
		collector.on('end', collected => console.log(`Collected ${collected.size} items`));
	}
});
```

### Deferring and updating the button message

Additionally to deferring the response of the interaction, you can defer the button, which will trigger a loading state:

```js {9,11-17}
client.on('interaction', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		const message = await interaction.fetchReply();
		const filter = i => i.customID === 'primary' && i.user.id === '122157285790187530';

		const collector = message.createMessageComponentInteractionCollector(filter, { time: 15000 });
		const wait = require('util').promisify(setTimeout);

		collector.on('collect', async i => {
			if (i.customID === 'primary') {
				await i.deferUpdate();
				await wait(4000);
				await i.editReply({ content: 'A button was clicked!', components: [] });
			}
		});
		collector.on('end', collected => console.log(`Collected ${collected.size} items`));
	}
});
```


## Button styles

Currently there are five different button styles available:
<!--- vue-discord-message doesn't yet have support for inline replies/interactions/ephemeral messages/components -->
- `PRIMARY`, a blurple button;
- `SECONDARY`, a grey button;
- `SUCCESS`, a green button;
- `DANGER`, a red button;
- `LINK`, a button that navigates to a URL.

::: warning
Only `LINK` buttons can have a `url`. `LINK` buttons _cannot_ have a `custom_id` and _do not_ send an interaction event when clicked.
:::
