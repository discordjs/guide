# Buttons

With the components API, you can create interactive message components. In this page, we'll be focusing on how to send, receive and respond to buttons using discord.js!


## Building and sending buttons

Buttons are part of the `MessageComponent` class, which can be sent via messages or interaction responses. A button, as any other message component, must be in an `ActionRow`.

::: warning
You can have a maximum of:
- five `ActionRows` per message
- five buttons within an `ActionRow`
:::

Now, to create a button we use the `MessageActionRow()` and `MessageButton()` builder functions and then pass the resulting object to `CommandInteraction#reply()` as `InteractionReplyOptions` like this:

```js {1,7-11,13}
const { MessageActionRow, MessageButton } = require('discord.js');

client.on('interaction', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		const row = new MessageActionRow()
			.addComponent(new MessageButton()
				.setCustomID('primary')
				.setLabel('primary')
				.setStyle('PRIMARY'));

		await interaction.reply('Pong!', row);
	}
});
```

::: tip
The custom id is a dev defined string that can hold up to 100 characters.
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

```js {1,13-19}
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

client.on('interaction', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		const row = new MessageActionRow()
			.addComponent(new MessageButton()
				.setCustomID('primary')
				.setLabel('primary')
				.setStyle('PRIMARY'));

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

Now you know all there is to building and sending a `MessageButton`! Let's move on to how to receive buttons!


## Receiving buttons

Whilst you can receive and handle a `MessageComponentInteraction` via the interaction event, we reccomend you use one of the collectors we'll be covering in the next section. Now to receive a `MessageComponentInteraction`, simply attach an event listener to your client and also use the `Interaction#isButton()` typeguard to make sure you only receive button interactions:

```js {2}
client.on('interaction', interaction => {
	if (!interaction.isComponent() && interaction.componentType !== 'BUTTON') return;
	console.log(interaction);
});
```


## Button collectors

These work quite similarly to message and reaction collectors, except that you will receive instances of the `MessageComponentInteraction` class as collected items.

::: tip
You can create the collectors on either a `message` or a `channel`.
:::

### MessageComponentInteractionCollector

To create a basic event-based `MessageComponentInteractionCollector`, simply do as follows:

```js
client.on('message', message => {
	const filter = interaction => interaction.customID === 'primary' && interaction.user.id === '122157285790187530';

	const collector = message.createMessageComponentInteractionCollector(filter, { time: 15000 });
	collector.on('collect', i => console.log(`Collected ${i.customID}`));
	collector.on('end', collected => console.log(`Collected ${collected.size} items`));
});
```

### awaitMessageComponentInteractions

As with other types of collectors, you can also use a promise-based collector like this:

```js {4-6}
client.on('message', message => {
	const filter = interaction => interaction.customID === 'primary' && interaction.user.id === '122157285790187530';

	message.awaitMessageComponentInteraction(filter, { time: 15000 })
		.then(collected => console.log(`Collected ${collected.size} interactions`))
		.catch(console.error);
});
```


## Responding to buttons

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

### Updating the button message

The `MessageComponentInteraction` class provides a method to update the message the button is attached to, by using `MessageComponentInteraction#update()`. We'll be passing an empty array as components, which will remove the button after clicking it:

```js {1,3}
client.on('interaction', async interaction => {
	if (!interaction.isButton()) return;
	if (interaction.customID === 'primary') await interaction.update('A button was clicked', { components: [] });
});
```

### Deferring and updating the button message

Additionally to deferring the response of the interaction, you can defer the button, which will trigger a loading state:

```js {1,5-9}
const wait = require('util').promisify(setTimeout);

client.on('interaction', async interaction => {
	if (!interaction.isButton()) return;
	if (interaction.customID === 'primary') {
		await interaction.deferUpdate();
		await wait(4000);
		await interaction.update('A button was clicked', { components: [] });
	}
});
```


## Button styles

Currently there are five different button styles available:
<!--- vue-discord-message doesn't yet have support for inline replies/interactions/ephemeral messages/components -->
* `PRIMARY` a blurple button
* `SECONDARY` a grey button
* `SUCCESS` a green button
* `DANGER` a red button
* `LINK` a button that navigates to a URL

::: warning
Only `LINK` buttons can have a `url`. `LINK` buttons can _not_ have a `custom_id`. `LINK` buttons also do _not_ send an interaction event when clicked.
:::

