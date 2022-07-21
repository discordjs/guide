# Modals

With modals you can create pop-up forms that allow users to provide you with formatted inputs through submissions. We'll cover how to create, show, and receive modal forms using discord.js!

::: tip
This page is a follow-up to the [interactions (slash commands) page](/interactions/slash-commands.md). Please carefully read that section first, so that you can understand the methods used in this section.
:::

## Building and responding with modals

Unlike message components, modals aren't strictly components themselves. They're a callback structure used to respond to interactions.

::: tip
You can have a maximum of five `ActionRowBuilder`s per modal builder, and one `TextInputBuilder` within an `ActionRowBuilder`. Currently, you cannot use `SelectMenuBuilder`s or `ButtonBuilder`s in modal action rows builders.
:::

To create a modal you construct a new `ModalBuilder`. You can then use the setters to add the custom id and title.

```js {1,7-13}
const { ModalBuilder } = require('discord.js');

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		const modal = new ModalBuilder()
			.setCustomId('myModal')
			.setTitle('My Modal');

		// TODO: Add components to modal...

		await interaction.showModal(modal);
	}
});
```
::: tip
The custom id is a developer-defined string of up to 100 characters.
:::

As you can see, you construct the modal and assign it a custom id and a title. After you added some user input elements, you will send it as a response to the interaction via `#showModal`.

You are still missing one of these steps - adding inputs. Adding inputs is similar to adding components to messages.

::: warning
If you're using typescript you'll need to specify the type of components your action row holds. This can be done by specifying the generic parameter in `ActionRowBuilder`.

```diff
- new ActionRowBuilder()
+ new ActionRowBuilder<ModalActionRowComponentBuilder>()
```
:::

```js {1,12-34}
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		// Create the modal
		const modal = new ModalBuilder()
			.setCustomId('myModal')
			.setTitle('My Modal');

		// Add components to modal

		// Create the text input components
		const favoriteColorInput = new TextInputBuilder()
			.setCustomId('favoriteColorInput')
		    // The label is the prompt the user sees for this input
			.setLabel("What's your favorite color?")
		    // Short means only a single line of text
			.setStyle(TextInputStyle.Short);

		const hobbiesInput = new TextInputBuilder()
			.setCustomId('hobbiesInput')
			.setLabel("What's some of your favorite hobbies?")
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph);

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
		const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow);

		// Show the modal to the user
		await interaction.showModal(modal);
	}
});
```

Restart your bot and invoke the `/ping` command again. You should see a popup form resembling the image below:

<img width=450 src="./images/modal-example.png">

## Receiving modal submissions

Modals are received via an interaction. You can check if a given interaction is a modal by checking if the <DocsLink path="class/BaseInteraction?scrollTo=type"/> is `ModalSubmit`. 

```js {1,4}
const { InteractionType } = require('discord.js');

client.on('interactionCreate', interaction => {
	if (interaction.type !== InteractionType.ModalSubmit) return;
	console.log(interaction);
});
```

## Responding to modal submissions

The `ModalSubmitInteraction` class provides the same methods as the `CommandInteraction` class. These methods behave equally:

- `reply()`
- `editReply()`
- `update()`
- `deferReply()`
- `deferUpdate()`
- `fetchReply()`
- `deleteReply()`
- `followUp()`

```js{1,3-5}
client.on('interactionCreate', async interaction => {
	if (interaction.type !== InteractionType.ModalSubmit) return;
	if (interaction.customId === 'myModal') {
		await interaction.reply({ content: 'Your submission was recieved successfully!' });
	}
});
```

::: tip
If you're using typescript, you can use the <DocsLink path="class/ModalSubmitInteraction?scrollTo=isFromMessage"/> typeguard, to check whether the received interaction was from a `MessageComponentInteraction` to avoid errors.
:::

## Extracting data from modal submissions

You'll most likely need to read the data sent by the user in the modal. You can do this by accessing the `#fields` instance field on the interaction. From there you can call `#getTextInputValue` with the custom id of the text input to get the value.

```js{5-7}
client.on('interactionCreate', interaction => {
	if (interaction.type !== InteractionType.ModalSubmit) return;

	// Get the data entered by the user
	const favoriteColor = interaction.fields.getTextInputValue('favoriteColorInput');
	const hobbies = interaction.fields.getTextInputValue('hobbiesInput');
	console.log({ favoriteColor, hobbies });
});
```
