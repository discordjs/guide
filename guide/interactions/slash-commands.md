# Slash commands

## Registering slash commands

Discord provides developers with the option to create client-integrated slash commands. In this section, we'll cover how to register these commands using discord.js!

In comparison to the old method of having bots respond to messages starting with a specific prefix, slash commands provide a huge number of benefits, including:

- Integration with the Discord client interface
- Automatic command detection and parsing of the associated options/arguments
- Typed argument inputs for command options, e.g. "String", "User", or "Role"
- Validated or dynamic choices for command options
- In-channel private responses (ephemeral messages)
- Pop-up form-style inputs for capturing additional information

...and many more that you'll find during your own development!

::: tip
This page assumes you use the same file structure as our [command handling](/creating-your-bot/command-handling.md) section. The scripts provided are made to function with that setup.

If you already have slash commands set up for your application and want to learn how to respond to them, refer to [the following section](#replying-to-slash-commands).
:::

### Guild commands

Slash commands can be registered in two ways; in one specific guild, or for every guild the bot is in. We're going to look at single-guild registration first, as this is a good way to develop and test your commands before a global deployment.

Your application will need the `applications.commands` scope authorized in a guild for either its global or guild slash commands to appear, and to register them in a specific guild wihtout error.

In this section, we'll be using a script to deploy our commands that is usable in conjunction with the slash command handler from the [command handling](/creating-your-bot/command-handling.md) section.

This script uses the REST module, included with discord.js, to make the necessary API calls without wasting time setting up a full Client. As there is a daily limit on command creations, we don't want to be making unnecessary deployments such as on every restart. This script is intended to be run separately, only when you need to make changes to your slash command **definitions** - you're free to modify parts such as the execute function as much as you like without redeployment. 

<!-- eslint-skip -->

```js
const { REST, Routes } = require('discord.js');
const { token } = require('./config.json');
const fs = require('node:fs');

const commands = [];
// Grab all the command files from the commands directory
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Place your client and guild ids here
const clientId = '123456789012345678';
const guildId = '876543210987654321';

// Grab the SlashCommandBuilder#toJSON() output of each command for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Prepare the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
```

### Global commands

Global application commands will be available in all the guilds your application has the `applications.commands` scope authorized, as well as in DMs by default.

To deploy global commands, you can use the same script from the [guild commands](#guild-commands) section and adjust the route in the script to `.applicationCommands(clientId)`

<!-- eslint-skip -->

```js {2}
await rest.put(
	Routes.applicationGuildCommands(clientId, guildId),
	Routes.applicationCommands(clientId),
	{ body: commands },
);
```

## Advanced command creation

The examples we've looked at so far have all been fairly simple commands, such as `ping`, `server`, and `user` which all have standard static responses. However, there's much more we can do with the full suite of slash command tools!

### Options

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

### Option types

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

### Required options

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

### Choices

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

### Further validation

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

### Subcommands

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

### Localizations

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

## Replying to slash commands

Discord provides developers the option to create client-integrated slash commands. In this section, we'll cover how to respond to these commands using discord.js!

::: tip
You need at least one slash command registered on your application to continue with the instructions on this page. If you haven't done that yet, refer to [the previous section](#registering-slash-commands).
:::

### Receiving interactions

Every slash command is an `interaction`, so to respond to a command, you need to set up an event listener that will execute code when your application receives an interaction:

```js
client.on('interactionCreate', interaction => {
	console.log(interaction);
});
```

However, not every interaction is a slash command (e.g. `MessageComponent`s). Make sure to only receive slash commands by making use of the `BaseInteraction#isChatInputCommand()` method:

```js {2}
client.on('interactionCreate', interaction => {
	if (!interaction.isChatInputCommand()) return;
	console.log(interaction);
});
```

### Responding to a command

There are multiple ways of responding to a slash command, each of these are covered in the following segments. Using an interaction response method confirms to Discord that your bot successfully received the interaction, and has responded to the user. Failing to do so will cause Discord to show that the command failed, even if your bot is performing other actions as a result.

The most common way of sending a response is by using the `BaseInteraction#reply()` method:

::: warning
Initially an interaction token is only valid for three seconds, so that's the timeframe in which you are able to use the `BaseInteraction#reply()` method. Responses that require more time ("Deferred Responses") are explained later in this page.
:::

```js {1,4-6}
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
	}
});
```

Restart your bot and then send the command to a channel your bot has access to. If all goes well, you should see something like this:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
</DiscordMessages>

You've successfully sent a response to a slash command! This is only the beginning, there's more to look out for so let's move on to further ways of replying to a command!


### Ephemeral responses

You may not always want everyone who has access to the channel to see a slash command's response. Previously, you would have had to DM the user to achieve this, potentially encountering the high rate limits associated with DM messages. 

Thankfully, Discord implemented a way to hide messages from everyone but the executor of the slash command. This type of message is called `ephemeral` and can be set by using `ephemeral: true` in the `InteractionReplyOptions`, as follows:

```js {5}
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply({ content: 'Pong!', ephemeral: true });
	}
});
```

Now when you run your command again, you should see something like this:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
				:ephemeral="true"
			>ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
</DiscordMessages>

Ephemeral responses are *only* available for interactions; another great reason to switch across to the new and improved features.
### Editing responses

After you've sent an initial response, you may want to edit that response for various reasons. This can be achieved with the `BaseInteraction#editReply()` method:

::: warning
After the initial response, an interaction token is valid for 15 minutes, so this is the timeframe in which you can edit the response and send follow-up messages.
:::

```js {1,8-9}
const wait = require('node:timers/promises').setTimeout;

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
		await wait(2000);
		await interaction.editReply('Pong again!');
	}
});
```

### Deferred responses

As previously mentioned, you have three seconds to respond to an interaction before its token becomes invalid. But what if you have a command that performs a task which takes longer than three seconds before being able to reply?

In this case, you can make use of the `BaseInteraction#deferReply()` method, which triggers the `<application> is thinking...` message. This also acts as the initial response, to confirm to Discord that the interaction was received successfully. This allows you 15 minutes to complete your tasks before responding.
<!--- here either display the is thinking message via vue-discord-message or place a screenshot -->

```js {7-9}
const wait = require('node:timers/promises').setTimeout;

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.deferReply();
		await wait(4000);
		await interaction.editReply('Pong!');
	}
});
```

If you have a command that performs longer tasks, be sure to call `deferReply()` as early as possible.

Note that if you want your response to be ephemeral, you must pass an `ephemeral` flag to the `InteractionDeferOptions` here:

<!-- eslint-skip -->

```js
await interaction.deferReply({ ephemeral: true });
```

It is not possible to edit a reply to be ephemeral later.
### Follow-ups

Replying to slash commands is great and all, but what if you want to send multiple responses instead of just one? Follow-up messages have got you covered, you can use `BaseInteraction#followUp()` to send multiple responses:

::: warning
After the initial response, an interaction token is valid for 15 minutes, so this is the timeframe in which you can edit the response and send follow-up messages.
:::

```js {6}
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
		await interaction.followUp('Pong again!');
	}
});
```

If you run this code you should end up having something that looks like this:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="bot">Pong!</DiscordInteraction>
		</template>
		Pong again!
	</DiscordMessage>
</DiscordMessages>

You can also pass an `ephemeral` flag to the `InteractionReplyOptions`:

<!-- eslint-skip -->

```js
await interaction.followUp({ content: 'Pong again!', ephemeral: true });
```

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="bot" :ephemeral="true">Pong!</DiscordInteraction>
		</template>
		Pong again!
	</DiscordMessage>
</DiscordMessages>

That's all, now you know everything there is to know on how to reply to slash commands! 

::: tip
Interaction responses can use masked links (e.g. `[text](http://site.com)`) and global emojis in the message content.
:::

### Parsing options

#### Command options

In this section, we'll cover how to access the values of a command's options. Let's assume you have a command that contains the following options:

```js {6-14}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('questionnaire')
	.setDescription('Asks you a series of questions!')
	.addStringOption(option => option.setName('input').setDescription('Your name?'))
	.addBooleanOption(option => option.setName('bool').setDescription('True or False?'))
	.addUserOption(option => option.setName('target').setDescription('Closest friend?'))
	.addChannelOption(option => option.setName('destination').setDescription('Favourite channel?'))
	.addRoleOption(option => option.setName('role').setDescription('Least favourite role?'))
	.addIntegerOption(option => option.setName('int').setDescription('Sides to a square?'))
	.addNumberOption(option => option.setName('num').setDescription('Value of Pi?'))
	.addMentionableOption(option => option.setName('mentionable').setDescription('Mention something!'))
	.addAttachmentOption(option => option.setName('attachment').setDescription('Best meme?'));
```

You can `get()` these options from the `CommandInteractionOptionResolver` as shown below:

```js
const string = interaction.options.getString('input');
const boolean = interaction.options.getBoolean('bool');
const user = interaction.options.getUser('target');
const member = interaction.options.getMember('target');
const channel = interaction.options.getChannel('destination');
const role = interaction.options.getRole('role');
const integer = interaction.options.getInteger('int');
const number = interaction.options.getNumber('num');
const mentionable = interaction.options.getMentionable('mentionable');
const attachment = interaction.options.getAttachment('attachment');

console.log({ string, boolean, user, member, channel, role, integer, number, mentionable, attachment });
```

::: tip
If you want the Snowflake of a structure instead, grab the option via `get()` and access the Snowflake via the `value` property. Note that you should use `const { value: name } = ...` here to [destructure and rename](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) the value obtained from the <DocsLink path="typedef/CommandInteractionOption" /> structure to avoid identifier name conflicts.
:::

#### Subcommands

If you have a command that contains subcommands, you can parse them in a very similar way as to the above examples. The following snippet details the logic needed to parse the subcommands and respond accordingly using the `CommandInteractionOptionResolver#getSubcommand()` method:

```js {5-15}
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'info') {
		if (interaction.options.getSubcommand() === 'user') {
			const user = interaction.options.getUser('target');

			if (user) {
				await interaction.reply(`Username: ${user.username}\nID: ${user.id}`);
			} else {
				await interaction.reply(`Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`);
			}
		} else if (interaction.options.getSubcommand() === 'server') {
			await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
		}
	}
});
```

### Localized responses

You can get the locale of the user with `BaseInteraction#locale`:

```js
client.on('interactionCreate', interaction => {
	const locales = {
		pl: 'Witaj Świecie!',
		de: 'Hallo Welt!',
	};
	interaction.reply(locales[interaction.locale] ?? 'Hello World (default is english)');
});
```

### Fetching and deleting responses

::: danger
You _cannot_ delete an ephemeral message.
:::

In addition to replying to a slash command, you may also want to delete the initial reply. You can use `ChatInputCommandInteraction#deleteReply()` for this:

<!-- eslint-skip -->

```js {2}
await interaction.reply('Pong!');
await interaction.deleteReply();
```

Lastly, you may require the `Message` object of a reply for various reasons, such as adding reactions. You can use the `ChatInputCommandInteraction#fetchReply()` method to fetch the `Message` instance of an initial response:

<!-- eslint-skip -->

```js
await interaction.reply('Pong!');
const message = await interaction.fetchReply();
console.log(message);
```

## Slash command permissions

Slash commands have their own permissions system, which allows you to set the required permissions in order to use a command.

::: tip
The slash command permissions for guilds are only defaults and can be altered by guild administrators.
:::

### DM permission

You can use the `ApplicationCommand#setDMPermission()` method to control if a global command can be used in DMs. By default, all global commands can be used in DMs.

```js {6}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('boop')
	.setDescription('Replies with beep!')
	.setDMPermission(false);
```

### Member permissions

You can use the `ApplicationCommand#setDefaultMemberPermissions()` method to set the default permissions required for a member to run the command. Setting it to `0` will prohibit anyone in a guild from using the command unless a specific overwrite is configured or the user has admin permissions.

::: tip
If you want to learn more about the `|` bitwise OR operator you can check the [Wikipedia](https://en.wikipedia.org/wiki/Bitwise_operation#OR) and [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_OR) articles on the topic.
:::

```js {9}
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('ban')
	.setDescription('Select a member and ban them (but not really).')
	.addUserOption(option =>
		option.setName('target').setDescription('The member to ban'))
	.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers);
```

And that's all you need to know on slash command permissions!
