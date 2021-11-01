# Autocomplete

Discord now provides you with the option to add autocomplete to your slash commands. In this section we'll cover how to both add autocomplete support to your command and also how to respond to it.

::: tip
This page is a follow-up to the [interactions (slash commands) pages](/interactions/registering-slash-commands.md). Please carefully read those first so that you can understand the methods used in this section.
:::

::: warning
Make sure that you're on version 13.3.0 or above before trying this.
:::

## Preparing commands

To use autocomplete with your command options, you have to tell discord to enable it.
How to do this is dependent on how you create your slash commands.

### Slashcommand Builder

The slash command builder does not yet support using autocomplete.

### Custom System

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

To receive a `AutocompleteInteraction`, attach an event listener to your client and use the `Interaction#isAutocomplete()` type guard to make sure you only receive autocomplete interactions:

```js {2}
client.on('interactionCreate', interaction => {
	if (!interaction.isAutocomplete()) return;
	console.log(interaction);
});
```

## Responding

The `AutocompleteInteraction` class only provides a single method to respond with. This being `AutocompleteInteraction#respond()`

### Respond with search
Using `AutocompleteInteraction#respond()` you submit an array of ApplicationCommandOptionChoice objects. Passing an empty array will show "No options match your search" in discord.

`CommandInteractionOptionResolver#getFocused()` return the currently focused option's value. This value is used to filter the choices presented.

To only display options starting with the focused value you use `.filter()`

Using `.map()`, you  turn that array into the array of ApplicationCommandOptionChoice objects.

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

To distinguish between multiple options you pass `true` into `CommandInteractionOptionResolver#getFocused()` which now returns the full focused object instead of just the value. This is used to get the name of the focused option.

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