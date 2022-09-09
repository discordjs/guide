# Advanced command creation

The examples we've looked at so far have all been fairly simple commands, such as `ping`, `server`, and `user` which all have standard static responses. However, there's much more we can do with the full suite of slash command tools!

## Adding options

Application commands can have additional `options`. Think of these options as arguments to a function, and as a way for the user to provide the additional information the command requires. Options require at minimum a name and description.

You can specify them as shown in the `echo` command below, which prompt the user to enter a String for the `input` option. You'll see more about how to receive and use these options in the [Replying to slash commands](#replying-to-slash-commands) section further on.

```js {6-8}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back'));
```

## Option types

By specifying the `type` of an `ApplicationCommandOption` by using the corresponding method you are able to restrict what the user can provide as input, and for some options, leverage the automatic parsing of options by Discord. 

The example above uses `addStringOption`, the simplest form of standard text input with no additional validatation. By leveraging additional option types, we could change the bahviour of this command in many ways, such as to a specific channel:

```js {9-11}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back'))
	.addChannelOption(option =>
		option.setName('channel')
			.setDescription('The channel to echo into'));
```

Or giving the user the option to embed the message:

```js {9-11}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back'))
	.addBooleanOption(option =>
		option.setName('embed')
			.setDescription('Whether or not the echo should be embedded'));
```

Listed below are all the types of options you can add and a little information about how they will behave:

::: tip
Refer to the Discord API documentation for detailed explanations on the [`SUB_COMMAND` and `SUB_COMMAND_GROUP` option types](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups).
:::

* `addSubcommand()` adds a `Subcommand`, allowing a single command to have branching options.
* `addSubcommandGroup()` adds a `SubcommandGroup`, an additional level of branching for subcommands.
* `addStringOption()` sets the option to require a `String` (text) input.
* `addIntegerOption()` sets the option to require an `Integer` (whole number) value.
* `addNumberOptinon()` set the option to require a `Number` (decimal, also known as a floating point) value.
* `addBooleanOption()` sets the option to require a `Boolean` (true/false) value.
* `addUserOption()` sets the option to require a `User` or `Snowflake` (user id) as the value.
	* The Discord interface will display a user selection list above the chat input.
	* Your bot will receive the full `User` object, and `GuildMember` if the command is executed in a guild.
* `addChannelOption()` sets the option to require a `Channel` or `Snowflake` (channel id) as the value.
	* The Discord interface will display a channel selection list above the chat input.
	* Your bot will receive the full `GuildChannel` object.
	* This option type cannot be used in DMs.
* `addRoleOption()` sets the option to require a `Role` or `Snowflake` (role id) as the value.
	* The Discord interface will display a role selection menu above the chat input.
	* Your bot will receive the full `Role` object.
	* This option type cannot be used in DMs.
* `addMentionableOption()` sets the option to require a `User`, `Role` or `Snowflake` as the value.
	* The Discord interface will display a selection menu above the chat input.
	* Your bot will receive the full object `User` or `Role` object.
* `addAttachmentOption()` sets the option to require a file attachment, prompting the user to make an upload.

## Required options

With our option types defined, we can start looking at additional forms of validation to ensure the data your bot receives is both complete and accurate. The simplest one is making options required. This validation can be applied to options of any type.

Taking a look at our `echo` example again, we will use `setRequired(true)` to make the `input` option required to ensure users cannot execute the command without providing a string.

```js {9}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back')
			.setRequired(true));
```

## Choices

The `String`, `Number` & `Integer` option types can have `choices`. If you would prefer users select from  predetermined values rather than free text entry, `choices` can help you enforce this. This is particularly useful when dealing with external datasets, APIs and similar where specific input formats are required.

::: warning
If you specify `choices` for an option, they'll be the **only** valid values users can pick!
:::

Specify choice by using the `addChoices()` method from the slash command builder. Choices require both a `name` to be displayed to the user for selection, and a `value` that your bot will receive when that choice is selected, almost as if the user had typed it into the string option manually.

The `gif` command example below allows users to select from predetermined categories of gif to send:

```js {10-14}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('gif')
	.setDescription('Sends a random gif!')
	.addStringOption(option =>
		option.setName('category')
			.setDescription('The gif category')
			.setRequired(true)
			.addChoices(
				{ name: 'Funny', value: 'gif_funny' },
				{ name: 'Meme', value: 'gif_meme' },
				{ name: 'Movie', value: 'gif_movie' },
			));
```

If you have too many choices to display (the maximum is 25), you may prefer to provide dynamic choices based on what the user has typed so far. This can be achieved using [autocomplete](/interactions/autocomplete).

## Further validation

Even without predetermined choices, additional restrictions can still be applied on free inputs.

* For `String` options, `setMaxLength()` and `setMinLength()` to enforce length limitations.
* For `Integer` and `Number` options, `setMaxValue()` and `setMinValue()` to enforce value limitations.
* For `Channel` options, `addChannelTypes()` to restrict selection to specific channel types, e.g. `ChannelType.GuildText`.

We'll use these to enhance our expanded `echo` command with the necessary validation to ensure it won't (or at least shouldn't) break when used:

```js {9-10, 14-15}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back')
			// Ensure the text will fit in an embed description, if the user chooses that option
			.setMaxLength(2000))
	.addChannelOption(option =>
		option.setName('channel')
			.setDescription('The channel to echo into')
			// Ensure the user can only select a TextChannel for output
			.addChannelTypes(ChannelTypes.GuildText))
	.addBooleanOption(option =>
		option.setName('embed')
			.setDescription('Whether or not the echo should be embedded'));
```

## Subcommands

Subcommands are available with the `.addSubcommand()` method. This allows you to branch a single command to require different options depending on the subcommand chosen.

For this example, we've merged the simple `user` and `server` commands into a single `info` command with two subcommands. Additionally, the `user` subcommand has a `User` type option for targetting other users, while the `server` subcommand has no need for this, and would just show info for the current guild.

```js {6-14}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('info')
	.setDescription('Get info about a user or a server!')
	.addSubcommand(subcommand =>
		subcommand
			.setName('user')
			.setDescription('Info about a user')
			.addUserOption(option => option.setName('target').setDescription('The user')))
	.addSubcommand(subcommand =>
		subcommand
			.setName('server')
			.setDescription('Info about the server'));
```

## Localizations

The names and descriptions of slash commands can be localized to the user's selected language. You can find the list of accepted locales on the [discord API documentation](https://discord.com/developers/docs/reference#locales).

Setting localisations with `setNameLocations()` and `setDescriptionLocalisations()` takes the format of an object, mapping location codes (e.g. `pl` and `de`) to their localised strings.

<!-- eslint-skip -->
```js {5-8,10-12,18-25}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('dog')
	.setNameLocalizations({
		pl: 'pies',
		de: 'hund',
	})
	.setDescription('Get a cute picture of a dog!')
	.setDescriptionLocalizations({
		pl: 'Słodkie zdjęcie pieska!',
		de: 'Poste ein niedliches Hundebild!',
	})
	.addStringOption(option =>
		option
			.setName('breed')
			.setDescription('Breed of dog')
			.setNameLocalizations({
				pl: 'rasa',
				de: 'rasse',
			})
			.setDescriptionLocalizations({
				pl: 'Rasa psa',
				de: 'Hunderasse',
			}),
	);
```

That's a lot of different features! If you'd like to learn more about the different ways you can reply to slash commands, checkout out [Replying to slash commands](/slash-commands/replying). Or for more information on handling the different types of options covered on this page, refer to [Parsing options](/slash-commands/parsing-options)