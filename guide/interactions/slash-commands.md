# Slash commands

## Registering slash commands

Discord provides developers with the option to create client-integrated slash commands. In this section, we'll cover how to register these commands using discord.js!

::: tip
This page assumes you use the same file structure as our [command handling](/guide/creating-your-bot/command-handling.md) section. The scripts provided are made to function with that setup.

If you already have slash commands set up for your application and want to learn how to respond to them, refer to [the following section](#replying-to-slash-commands).
:::

### Guild commands

Guild application commands are only available in the guild they were created in, if your application has the `applications.commands` scope authorized.

In this section, we'll be using a script that is usable in conjunction with the slash command handler from the [command handling](/guide/creating-your-bot/command-handling.md) section.

First off, install the [`@discordjs/rest`](https://github.com/discordjs/discord.js/tree/main/packages/rest) and [`discord-api-types`](https://github.com/discordjs/discord-api-types/) by running the following command in your terminal:

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npm install @discordjs/rest discord-api-types
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn add @discordjs/rest discord-api-types
```
:::
::: code-group-item pnpm
```sh:no-line-numbers
pnpm add @discordjs/rest discord-api-types
```
:::
::::

<!-- eslint-skip -->

```js
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('./config.json');
const fs = require('node:fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Place your client and guild ids here
const clientId = '123456789012345678';
const guildId = '876543210987654321';

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
```

Running this script will register all your commands to the guild of which the id was passed in above.

### Global commands

Global application commands will be available in all the guilds your application has the `applications.commands` scope authorized, as well as in DMs.

To deploy global commands, you can use the same script from the [guild commands](#guild-commands) section and adjust the route in the script to `.applicationCommands(clientId)`.

<!-- eslint-skip -->

```js {2}
await rest.put(
	Routes.applicationCommands(clientId),
	{ body: commands },
);
```

### Options

Application commands can have `options`. Think of these options as arguments to a function. You can specify them as shown below:

```js {6-9}
const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back')
			.setRequired(true));
```

Notice how `.setRequired(true)` is specified within the options builder. Setting this will prevent the user from sending the command without specifying a value for this option!

### Option types

As shown in the options example above, you can specify the `type` of an `ApplicationCommandOption`. Listed below are all the possible values you can pass as `ApplicationCommandOptionType`:

::: tip
The [slash command builder](/popular-topics/builders.md#slash-command-builders) has a method for each of these types respectively.
Refer to the Discord API documentation for detailed explanations on the [`SUB_COMMAND` and `SUB_COMMAND_GROUP` option types](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups).
:::

* `SUB_COMMAND` sets the option to be a subcommand
* `SUB_COMMAND_GROUP` sets the option to be a subcommand group
* `STRING` sets the option to require a string value
* `INTEGER` sets the option to require an integer value
* `BOOLEAN` sets the option to require a boolean value
* `USER` sets the option to require a user or snowflake as value
* `CHANNEL` sets the option to require a channel or snowflake as value
* `ROLE` sets the option to require a role or snowflake as value
* `MENTIONABLE` sets the option to require a user, role or snowflake as value
* `NUMBER` sets the option to require a decimal (also known as a floating point) value
* `ATTACHMENT` sets the option to require an attachment

### Choices

The `STRING` and `INTEGER` option types both can have `choices`. `choices` are a set of predetermined values users can pick from when selecting the option that contains them.

::: warning
If you specify `choices` for an option, they'll be the **only** valid values users can pick!
:::

Specify them by using the `addChoices()` method from the slash command builder:

```js {10-12}
const { SlashCommandBuilder } = require('@discordjs/builders');

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

### Subcommands

Subcommands are available with the `.addSubcommand()` method:

```js {6-14}
const { SlashCommandBuilder } = require('@discordjs/builders');

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

However, not every interaction is a slash command (e.g. `MessageComponent`s). Make sure to only receive slash commands by making use of the `CommandInteraction#isCommand()` method:

```js {2}
client.on('interactionCreate', interaction => {
	if (!interaction.isCommand()) return;
	console.log(interaction);
});
```

### Responding to a command

There are multiple ways of responding to a slash command, each of these are covered in the following segments.
The most common way of sending a response is by using the `CommandInteraction#reply()` method:

::: warning
Initially an interaction token is only valid for three seconds, so that's the timeframe in which you are able to use the `CommandInteraction#reply()` method. Responses that require more time ("Deferred Responses") are explained later in this page.
:::

```js {1,4-6}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

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

You may not always want everyone who has access to the channel to see a slash command's response. Thankfully, Discord implemented a way to hide messages from everyone but the executor of the slash command. This type of message is called `ephemeral` and can be set by using `ephemeral: true` in the `InteractionReplyOptions`, as follows:

```js {5}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

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

### Editing responses

After you've sent an initial response, you may want to edit that response for various reasons. This can be achieved with the `CommandInteraction#editReply()` method:

::: warning
After the initial response, an interaction token is valid for 15 minutes, so this is the timeframe in which you can edit the response and send follow-up messages.
:::

```js {1,8-9}
const wait = require('node:timers/promises').setTimeout;

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
		await wait(2000);
		await interaction.editReply('Pong again!');
	}
});
```

### Deferred responses

As previously mentioned, you have three seconds to respond to an interaction before its token becomes invalid. But what if you have a command that performs a task which takes longer than three seconds before being able to reply?

In this case, you can make use of the `CommandInteraction#deferReply()` method, which triggers the `<application> is thinking...` message and also acts as initial response. This allows you 15 minutes to complete your tasks before responding.
<!--- here either display the is thinking message via vue-discord-message or place a screenshot -->

```js {7-9}
const wait = require('node:timers/promises').setTimeout;

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.deferReply();
		await wait(4000);
		await interaction.editReply('Pong!');
	}
});
```

If you have a command that performs longer tasks, be sure to call `deferReply()` as early as possible.

You can also pass an `ephemeral` flag to the `InteractionDeferOptions`:

<!-- eslint-skip -->

```js
await interaction.deferReply({ ephemeral: true });
```

### Follow-ups

Replying to slash commands is great and all, but what if you want to send multiple responses instead of just one? Follow-up messages got you covered, you can use `CommandInteraction#followUp()` to send multiple responses:

::: warning
After the initial response, an interaction token is valid for 15 minutes, so this is the timeframe in which you can edit the response and send follow-up messages.
:::

```js {6}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

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
const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Replies with Pong!')
	.addStringOption(option => option.setName('input').setDescription('Enter a string'))
	.addIntegerOption(option => option.setName('int').setDescription('Enter an integer'))
	.addBooleanOption(option => option.setName('choice').setDescription('Select a boolean'))
	.addUserOption(option => option.setName('target').setDescription('Select a user'))
	.addChannelOption(option => option.setName('destination').setDescription('Select a channel'))
	.addRoleOption(option => option.setName('muted').setDescription('Select a role'))
	.addMentionableOption(option => option.setName('mentionable').setDescription('Mention something'))
	.addNumberOption(option => option.setName('num').setDescription('Enter a number'))
	.addAttachmentOption(option => option.setName('attachment').setDescription('Attach something'));
```

You can `get()` these options from the `CommandInteractionOptionResolver` as shown below:

```js
const string = interaction.options.getString('input');
const integer = interaction.options.getInteger('int');
const boolean = interaction.options.getBoolean('choice');
const user = interaction.options.getUser('target');
const member = interaction.options.getMember('target');
const channel = interaction.options.getChannel('destination');
const role = interaction.options.getRole('muted');
const mentionable = interaction.options.getMentionable('mentionable');
const number = interaction.options.getNumber('num');
const attachment = interaction.options.getAttachment('attachment');

console.log(string, integer, boolean, user, member, channel, role, mentionable, number, attachment);
```

::: tip
If you want the Snowflake of a structure instead, grab the option via `get()` and access the Snowflake via the `value` property. Note that you should use `const { value: name } = ...` here to [destructure and rename](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) the value obtained from the <DocsLink path="typedef/CommandInteractionOption" /> structure to avoid identifier name conflicts.
:::

#### Subcommands

If you have a command that contains subcommands, you can parse them in a very similar way as to the above examples. The following snippet details the logic needed to parse the subcommands and respond accordingly using the `CommandInteractionOptionResolver#getSubcommand()` method:

```js {5-15}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

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

### Fetching and deleting responses

::: danger
You _cannot_ delete an ephemeral message.
:::

In addition to replying to a slash command, you may also want to delete the initial reply. You can use `CommandInteraction#deleteReply()` for this:

<!-- eslint-skip -->

```js {2}
await interaction.reply('Pong!');
await interaction.deleteReply();
```

Lastly, you may require the `Message` object of a reply for various reasons, such as adding reactions. You can use the `CommandInteraction#fetchReply()` method to fetch the `Message` instance of an initial response:

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

You can use the `setDMPermission` method to control if a global command can be used in DMs. By default, all global commands can be used in DMs.

```js {6}
const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('boop')
	.setDescription('Replies with beep!')
	.setDMPermission(false);
```

### Member permissions

You can use the `setDefaultMemberPermissions` method to set the default permissions required by a member in order to run the command, setting it to `0` will prohibit anyone in a guild from using the command unless a specific overwrite is configured or the user has admin permissions.

::: tip
If you want to learn more about the `|` bitwise OR operator you can check the [Wikipedia](https://en.wikipedia.org/wiki/Bitwise_operation#OR) and [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_OR) articles on the topic.
:::

```js {9}
const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord-api-types/v10');

const data = new SlashCommandBuilder()
	.setName('ban')
	.setDescription('Ban a member!')
	.addUserOption(option =>
		option.setName('target').setDescription('The member to ban'))
	.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers);
```

And that's all you need to know on slash command permissions!
