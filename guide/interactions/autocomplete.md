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
	.setName('guide')
	.setDescription('Search discordjs.guide!')
	.addStringOption(option =>
		option.setName('query')
			.setDescription('Phrase to search for')
			.setAutocomplete(true));
```

To use autocomplete, make sure you _don't_ add any choices to the command - we'll be providing those dynamically in the next step.

## Responding to autocomplete interactions

To handle an <DocsLink path="class/AutocompleteInteraction"/>, use the <DocsLink path="class/BaseInteraction?scrollTo=isAutocomplete"/> type guard to make sure the interaction instance is an autocomplete interaction:

<!-- eslint-skip -->

```js {1,4}
client.on('interactionCreate', interaction => {
	if (!interaction.isAutocomplete()) return;
});
```

The <DocsLink path="class/AutocompleteInteraction"/> class provides the <DocsLink path="class/AutocompleteInteraction?scrollTo=respond"/> method to send a response.

### Sending results

Using <DocsLink path="class/AutocompleteInteraction?scrollTo=respond" /> you can submit an array of <DocsLink path="typedef/ApplicationCommandOptionChoiceData" /> objects. Passing an empty array will show "No options match your search" for the user.

The <DocsLink path="class/CommandInteractionOptionResolver?scrollTo=getFocused" /> method returns the currently focused option's value. This value can be used to filter the choices presented. For example, to only display options starting with the focused value you can use the `Array#filter()` method, then using `Array#map()`, you can transform the array into an array of <DocsLink path="typedef/ApplicationCommandOptionChoiceData" /> objects.

```js {4-11}
client.on('interactionCreate', async interaction => {
	if (!interaction.isAutocomplete()) return;

	if (interaction.commandName === 'guide') {
		const focusedValue = interaction.options.getFocused();
		const choices = ['Popular Topics: Threads', 'Sharding: Getting started', 'Library: Voice Connections', 'Interactions: Replying to slash commands', 'Popular Topics: Embed preview'];
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
	if (!interaction.isAutocomplete()) return;

	if (interaction.commandName === 'guide') {
		const focusedOption = interaction.options.getFocused(true);
		let choices;

		if (focusedOption.name === 'query') {
			choices = ['Popular Topics: Threads', 'Sharding: Getting started', 'Library: Voice Connections', 'Interactions: Replying to slash commands', 'Popular Topics: Embed preview'];
		}

		if (focusedOption.name === 'version') {
			choices = ['v9', 'v11', 'v12', 'v13', 'v14'];
		}

		const filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	}
});
```

### Accessing other values

In addition to filtering based on the focused value, you may also wish to change the choices displayed based on the value of other arguments in the command. The following methods work the same in <DocsLink path="class/AutocompleteInteraction"/>:

```js
const string = interaction.options.getString('input');
const integer = interaction.options.getInteger('int');
const boolean = interaction.options.getBoolean('choice');
const number = interaction.options.getNumber('num');
```

However, the `.getUser()`, `.getMember()`, `.getRole()`, `.getChannel()`, `.getMentionable()` and `.getAttachment()` methods will not function the same, as Discord does not send their respective full objects until the slash command is completed. For these, you can get the Snowflake value using `interaction.options.get('option').value`:


## Notes

- You have to respond to the request within 3 seconds, as with other application command interactions.
- You cannot defer the response to an autocomplete interaction.
- After the user selects a value and sends the command, it will be received as a <DocsLink path="class/ChatInputCommandInteraction"/> with the chosen value.
- You can only respond with a maximum of 25 choices at a time.
