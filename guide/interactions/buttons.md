# Button interactions

With the components API you can create interactive message components. In this page we'll be focusing on how to send, receive and respond to buttons using discord.js!


## Building and sending buttons

Buttons are part of the `MessageComponent` class, which can be sent via messages or interaction responses. A button, as any other message component, must be in an `ActionRow`.

::: warning
You can have a maximum of:
- five `ActionRow`s per message
- five buttons (or any other component type) within an `ActionRow`
:::

Now, to create a button we use the `MessageActionRow()` and `MessageButton()` builder functions and then pass the resulting object to `CommandInteraction#reply()` as `InteractionReplyOptions` as such:

```js {1, 8-14, 16}
const { MessageActionRow, MessageButton } = require('discord.js');

client.on('interaction', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {

		const row = new MessageActionRow()
		.addComponent(new MessageButton()
			.setCustomID('primary')
			.setLabel('primary')
			.setStyle('PRIMARY')
		);

		await interaction.reply('Pong!', row);
	}
});
```

::: warning
The custom id a dev defined string that can hold up to 100 characters.
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

```js {1}
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

client.on('interaction', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {

		const row = new MessageActionRow()
		.addComponent(new MessageButton()
			.setCustomID('primary')
			.setLabel('primary')
			.setStyle('PRIMARY')
		);

		const embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Some title')
		.setURL('https://discord.js.org/')
		.setDescription('Some description here');

		await interaction.reply('Pong!', { ephemeral: true, embeds:[embed], components: [row] });
	}
});
```

Restart your bot and then send the command to a channel your bot has access to. If all goes well, you should see something like this:

<!--- vue-discord-message doesn't yet have support for inline replies/interactions/ephemeral messages/components -->
<div is="discord-messages">
	<discord-message profile="bot">
		Pong! (ephemeral + components)
	</discord-message>
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

Whilst you can receive and handle a `ButtonInteraction` via the interaction event, we reccomend you use one of the collectors we'll be covering in the next section. Now to receive a `ButtonInteraction`, simply attach an event listener to your client and also use the `Interaction#isButton()` typeguard to make sure you only receive button interactions:

```js
client.on('interaction', interaction => {
	if (!interaction.isButton()) return;
	console.log(interaction);
});
```

## Button collectors

These work quite similarly to message collectors, except that you apply them on a message rather than a channel.

### ButtonInteractionCollector

To create a basic event-based `ButtonInteractionCollector` simply do as follows:

```js
client.on('message', message => {
	const filter = (interaction) => interaction.customID === 'primary' && interaction.user.id === '122157285790187530';

	const collector = message.createButtonInteractionCollector(filter, { time: 15000 });
	collector.on('collect', i => console.log(`Collected ${i.customID}`));
	collector.on('end', collected => console.log(`Collected ${collected.size} items`));
});
```

### awaitButtonInteractions

As with other types of collectors, you can also use a promise-based collector like this:

```js
client.on('message', message => {
	const filter = (interaction) => interaction.customID === 'primary' && interaction.user.id === '122157285790187530';

	message.awaitButtonInteraction(filter, { time: 15000 })
		.then(collected => console.log(`Collected ${collected.size} interactions`))
		.catch(console.error);
});
```

## Responding to Buttons




## Button types