# Component Interactions

Every button click or select menu selection on a component sent by your bot fires an `interaction`, triggering the <DocsLink path="class/Client?scrollTo=e-interactionCreate" /> event. How you decide to handle this will likely depend on the purpose of the components. Options include:

- Waiting for a single interaction via <DocsLink path="class/InteractionResponse?scrollTo=awaitMessageComponent" />.
- Listening for multiple interactions over a period of time using an <DocsLink path="class/InteractionCollector" />.
- Creating a permanent component handler in the <DocsLink path="class/Client?scrollTo=e-interactionCreate" /> event.

::: tip
This page is a follow-up to the [slash commands](/slash-commands/advanced-creation) section, and assumes you have created either [buttons](/message-components/buttons) or [select menus](/message-components/select-menus) as detailed in this guide. Please carefully read those pages first so that you can understand the methods used here.
:::

## Responding to component interactions

As with all other interactions message components interactions require a response within 3 seconds, else Discord will treat them as failed.

Like slash commands, all types of message component interactions support the `reply()`, `deferReply()`, `editReply()` and `followUp()` methods, with the option for these responses to be ephemeral. These function identically to how they do for slash commands, so refer to the page on [slash command response methods](/slash-commands/response-methods) for information on those.

Component interactions also support two additional methods of response, detailed below and demonstrated in examples later on the page.

### Updates

Responding to a component interaction via the `update()` method acknowledges the interaction by editing the message on which the component was attached. This method should be preferred to calling `editReply()` on the original interaction which sent the components. Like `editReply()`, `update()` cannot be used to change the ephemeral state of a message. 

Once `update()` has been called, future messages can be sent by calling `followUp()` or edits can be made by calling `editReply()` on the component interaction.

### Deferred updates

Responding to a component interaction via the `deferUpdate()` method acknowledges the interaction and resets the message state. This method can be used to suppress the need for further responses, however it's encouraged to provide meaningful feedback to users via an `update()` or ephemeral `reply()` at least.

Once `deferUpdate()` has been called, future messages can be sent by calling `followUp()` or edits can be made by calling `editReply()` on the component interaction.

## Awaiting components

If you followed our [buttons](/message-components/buttons) guide, the confirmation workflow for the `ban` command is a good example of a situation where your bot is expecting to receive a single response, from either the Confirm or Cancel button.

Begin by storing the <DocsLink path="class/InteractionResponse" /> as a variable, and calling `awaitMessageComponent` on this instance. This method returns a Promise that resolves when any interaction passes it's filter (if one is provided), or throws if none are received before the timeout. If this happens, remove the components and notify the user.

```js {1,6-11}
const response = await interaction.reply({
	content: `Are you sure you want to ban ${target.username} for reason: ${reason}?`,
	components: [row],
});

const filter = i => i.user.id === interaction.user.id;
try {
	const confirmation = await response.awaitMessageComponent({ filter, time: 60000 });
} catch (e) {
	await response.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
}
```

With the confirmation collected, check which button was clicked and perform the appropriate action.

```js {10-15}
const response = await interaction.reply({
	content: `Are you sure you want to ban ${target.username} for reason: ${reason}?`,
	components: [row],
});

const filter = i => i.user.id === interaction.user.id;
try {
	const confirmation = await response.awaitMessageComponent({ filter, time: 60000 });

	if (confirmation.customId === 'confirm') {
		await interaction.guild.members.ban(target);
		await i.update({ content: `${target.username} has been banned for reason: ${reason}`, components: [] });
	} else if (confirmation.customId === 'cancel') {
		await i.update({ content: 'Action cancelled', components: [] });
	}
} catch (e) {
	await response.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
}
```

## Component collectors

## The interactionCreate event