# Autocomplete

Autocomplete allows you to dynamically provide a selection of values to the user, based on their input. In this section we will cover how to add autocomplete support to your commands.

::: tip
This page is a follow-up to the [interactions (slash commands) page](/interactions/slash-commands.md). Please carefully read those first so that you can understand the methods used in this section.
:::

## Enabling autocomplete

To use autocomplete with your commands, you have to set the respective option when deploying commands:

```js {9}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Replies with Pong!')
	.addStringOption(option =>
		option.setName('autocomplete')
			.setDescription('Enter your choice')
			.setAutocomplete(true));
```

## Responding to autocomplete interactions

To handle an <DocsLink path="class/AutocompleteInteraction"/>, you can listen to the `interactionCreate` event and use the <DocsLink path="class/Interaction?scrollTo=isAutocomplete"/> method to make sure the interaction instance is an autocomplete interaction:

<!-- eslint-skip -->

```js {1,4}
const { InteractionType } = require('discord.js');

client.on('interactionCreate', interaction => {
	if (interaction.type !== InteractionType.ApplicationCommandAutocomplete) return;
});
```

The <DocsLink path="class/AutocompleteInteraction"/> class provides the <DocsLink path="class/AutocompleteInteraction?scrollTo=respond"/> method to send a response.

### Sending results

Using <DocsLink path="class/AutocompleteInteraction?scrollTo=respond" /> you can submit an array of <DocsLink path="typedef/ApplicationCommandOptionChoiceData" /> objects. Passing an empty array will show "No options match your search" for the user.

The <DocsLink path="class/CommandInteractionOptionResolver?scrollTo=getFocused" /> method returns the currently focused option's value. This value is used to filter the choices presented. To only display options starting with the focused value you can use the `Array#filter()` method. By using `Array#map()`, you can transform the array into an array of <DocsLink path="typedef/ApplicationCommandOptionChoiceData" /> objects.

```js {4-11}
client.on('interactionCreate', async interaction => {
	if (interaction.type === InteractionType.ApplicationCommandAutocomplete) return;

	if (interaction.commandName === 'ping') {
		const focusedValue = interaction.options.getFocused();
		const choices = ['faq', 'install', 'collection', 'promise', 'debug'];
		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	}
});
```

### Handling multiple autocomplete options

To distinguish between multiple options, you can pass `true` into <DocsLink path="class/CommandInteractionOptionResolver?scrollTo=getFocused"/>, which now returns the full focused object instead of just the value. This is used to get the name of the focused option below:

```js {5-16}
client.on('interactionCreate', async interaction => {
	if (interaction.type !== InteractionType.ApplicationCommandAutocomplete) return;

	if (interaction.commandName === 'ping') {
		const focusedOption = interaction.options.getFocused(true);
		let choices;

		if (focusedOption.name === 'name') {
			choices = ['faq', 'install', 'collection', 'promise', 'debug'];
		}

		if (focusedOption.name === 'theme') {
			choices = ['halloween', 'christmas', 'summer'];
		}

		const filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
		await interaction.respond([
			filtered.map(choice => ({ name: choice, value: choice })),
		]);
	}
});
```

## Notes

- You have to respond to the request within 3 seconds, as with other application command interactions.
- You cannot defer the response to an autocomplete interaction.
- After the user selects a value and sends the command, it will be received as a <DocsLink path="class/ChatInputCommandInteraction"/> with the chosen value.
