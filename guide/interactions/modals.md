# Modals

With modal interactions you can create pop-out forms that allow users to provide you with formatted input. We'll cover how to create, send and receive modals using discord.js!

::: tip
This page is a follow-up to the [interactions (slash commands) page](/interactions/slash-commands.md). Please carefully read those first so that you can understand the methods used in this section.
:::

# Building and Responding with Modals

Unlike message components, modals aren't strictly components themselves. They're a callback structure used to respond to interactions.

::: tip
You can have a maximum of five `ActionRow`s per modal, and one `TextInputComponent` within an `ActionRow`. Currently, you cannot use `SelectMenuComponent`s or `ButtonComponent`s in modal action rows.
:::

To create a modal you construct a new `Modal`. You can then use the setters to add the title.

```js {1,7-13}
const { Modal } = require('discord.js');

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		const modal = new Modal()
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

As you can see, we construct the modal and assign it a custom id and a title. Once our modal is constructed, we send it as a response to the interaction via `#showModal`.

We're still missing one step - adding inputs. Adding inputs is similar to adding components to messages.

```js {1,12-34}
const { ActionRow, Modal, TextInputComponent, TextInputStyle } = require('discord.js');

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		// Create our modal
		const modal = new Modal()
			.setCustomId('myModal')
			.setTitle('My Modal');

		// Add components to modal

		// Let's create our text inputs
		const favoriteColorInput = new TextInputComponent()
			.setCustomId('favoriteColorInput')
		    // The label is the prompt the user sees for this input
			.setLabel("What's your favorite color?")
		    // Short means only a single line of text
			.setStyle(TextInputStyle.Short);

		const hobbiesInput = new TextInputComponent()
			.setCustomId('hobbiesInput')
			.setLabel("What's your favorites hobbies?")
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph);

		// An action row only holds one text input,
		// so we need one action row per text input.
		const firstActionRow = new ActionRow().addComponents(favoriteColorInput);
		const secondActionRow = new ActionRow().addComponents(hobbiesInput);

		// Now we need to add our inputs into the modal
		modal.addComponents(firstActionRow, secondActionRow);

		// Show our modal
		await interaction.showModal(modal);
	}
});
```

Restart your bot and invoke the `/ping` command again. You should see a popup form resembling the image below:

TODO: Add modal image

# Receiving Modal Submissions

Modals are received via an interaction. You can check if a given interaction is a modal by invoking the `#isModalSubmit()` method:

```js {2}
client.on('interactionCreate', interaction => {
	if (!interaction.isModalSubmit()) return;
	console.log(interaction);
});
```

## Extracting Data from Modal Submissions

You'll most likely need to read the data sent by the user in the modal. You can do this by accessing the `#fields` instance field on the interaction. From there you can call `#getTextInputValue` with the custom id of the text input to get the value.

```js{4-8}
client.on('interactionCreate', interaction => {
	if (!interaction.isModalSubmit()) return;

	// Get data entered by user
	const favoriteColor = interaction.fields.getTextInputValue('favoriteColorInput');
	const hobbies = interaction.fields.getTextInputValue('hobbiesInput');

	console.log({ favoriteColor, hobbies });
});
```

