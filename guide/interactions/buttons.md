# Button interactions

With the components API you can create interactive message components. In this page we'll be focusing on how to send, receive and respond to buttons using discord.js!


## Making and sending buttons

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

You've successfully sent a response containing a button! Let's move on to how to receive buttons!


## Receiving buttons


## Button collectors


## Responding to Buttons


## Button types