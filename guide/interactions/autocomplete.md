# Autocomplete

Slash command options provide the feature of autocomplete. In this section we'll cover how to both add autocomplete support to your command and also how to respond to it.

::: tip
This page is a follow-up to the [interactions (slash commands) pages](/interactions/registering-slash-commands.md). Please carefully read those first so that you can understand the methods used in this section.
:::

::: warning
Make sure that you're on discord.js version 13.3.0 or above before using autocomplete.
:::

## Preparing commands

To use autocomplete with your command options, you have to tell Discord to enable it.
How to do this is dependent on how you create your slash commands.

### Slash command builder

The slash command builder does not yet support using autocomplete.

### Custom system

For other custom systems or entering it raw, your resulting code should look something like this. To enable autocomplete, set it to true in the option.

```js {10}
const commandData = {
	name: 'autocomplete',
	description: 'test command to show how autocomplete should be setup',
	defaultPermission: true,
	options: [
		{
			name: 'name',
			description: 'Name of something',
			type: 'STRING',
			autocomplete: true,
		},
	],
};
```

## Receiving

To receive a AutocompleteInteraction, you can listen to the `interactionCreate` event and use the `Interaction#isAutocomplete()` method to make sure you only receive autocomplete interactions:

```js {2}
client.on('interactionCreate', interaction => {
	if (!interaction.isAutocomplete()) return;
	console.log(interaction);
});
```

## Responding

The AutocompleteInteraction class provides the `AutocompleteInteraction#respond()` method for responding to the interaction.

### Respond with search
Using `AutocompleteInteraction#respond()` you submit an array of ApplicationCommandOptionChoice objects. Passing an empty array will show "No options match your search" in Discord.

`CommandInteractionOptionResolver#getFocused()` return the currently focused option's value. This value is used to filter the choices presented.

To only display options starting with the focused value you can use the `Array#filter()` method

Using `Array#map()`, you can transform the array into an array of ApplicationCommandOptionChoice objects.

``` js {5,7,9-12}
client.on('interactionCreate', interaction => {
	if (!interaction.isAutocomplete()) return;

	if (interaction.commandName === 'autocomplete') {
		const focusedValue = interaction.options.getFocused();

		const choices = ['faq', 'install', 'collection', 'promise', 'debug'];

		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		).then(console.log).catch(console.error);
	}
});
```

### Respond with multiple options

To distinguish between multiple options you can pass `true` into `CommandInteractionOptionResolver#getFocused()` which now returns the full focused object instead of just the value. This is used to get the name of the focused option.

```js {5,7,9-11,13-15,17}
client.on('interactionCreate', interaction => {
	if (!interaction.isAutocomplete()) return;

	if (interaction.commandName === 'autocomplete') {
		const focusedOption = interaction.options.getFocused(true);

		let choices;

		if (focusedOption.name === 'name') {
			choices = ['faq', 'install', 'collection', 'promise', 'debug'];
		}

		if (focusedOption.name === 'theme') {
			choices = ['halloween', 'christmas', 'summer'];
		}

		const filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
		interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		).then(console.log).catch(console.error);
	}
});
```