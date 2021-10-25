# Registering slash commands

Discord provides developers with the option to create client-integrated slash commands. In this section, we'll cover how to register these commands using discord.js!

::: tip
This page assumes you use the same file structure as our [command handling](/creating-your-bot/command-handling.md) section. The scripts provided are made to function with that setup.

If you already have slash commands set up for your application and want to learn how to respond to them, refer to [the following page](/interactions/replying-to-slash-commands.md).
:::

A slash command can be registered as either **guild command** or **global command**.

**Guild commands** are only available to the guild you specify when registering the command. Guild commands are NOT available in DMs.

**Global commands** are available for every guild that adds your bot. A user can also use a bot's global commands in DMs if that bot shares a mutual guild with the user.

Command names are UNIQUE per bot, within each scope (global and guild). That means:

- Your bot **cannot** have two global commands with the same name
- Your bot **cannot** have two guild commands with the same name on the same guild
- Your bot **can** have a global and guild command with the same name
- Multiple bots **can** have commands with the same names

A bot can have up to 100 global commands.

A bot can have up to 100 guild commands per guild.

- A slash command's `name` must be all lowercase matching `^[\w-]{1,32}$`. (Max. character count is **32**)
- Maximum character count allowed in `description` is **100**.

You can test if your command's `name` abides by this regex, by using [https://regexr.com/63lqq](https://regexr.com/63lqq).

::: tip
**Guild commands** update **instantly**. We recommend you use guild commands for quick testing, and global commands when they are ready for public use.

**Global commands** are cached for **1 hour**. That means that new global commands will **fan out slowly across all guilds**, and will be guaranteed to be updated in an hour.
:::

## Guild commands

Guild application commands are only available in the guild they were created in, if your application has the `applications.commands` scope authorized.

In this section, we'll be using a script that is usable in conjunction with the slash command handler from the [command handling](/creating-your-bot/command-handling.md) section.

First off, install the [`@discordjs/rest`](https://github.com/discordjs/discord.js-modules/blob/main/packages/rest/) and [`discord-api-types`](https://github.com/discordjs/discord-api-types/) by running the following command in your terminal:

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
const fs = require('fs');

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

## Global commands

Global application commands will be available in all the guilds your application has the `applications.commands` scope authorized, as well as in DMs.

::: tip
Global commands are cached for one hour. New global commands will fan out slowly across all guilds and will only be guaranteed to be updated after an hour. Guild commands update instantly. As such, we recommend you use guild-based commands during development and publish them to global commands when they're ready for public use.
:::

::: warning
Because global commands can take up to 1 hour to reflect new changes, Discord has implemented them to have inherent read-repair functionality. That means that if you make an update to a global command, and a user tries to use that command before it has updated for them, Discord will do an internal version check and reject the command, and trigger a reload for that command.

When the command is rejected, the user will see an "**Invalid interaction application command**" error message.
:::


To deploy global commands, you can use the same script from the [guild commands](#guild-commands) section and adjust the route in the script to `.applicationCommands(clientId)`.

<!-- eslint-skip -->

```js {2}
await rest.put(
	Routes.applicationCommands(clientId),
	{ body: commands },
);
```

::: warning
Remember what we mentioned earlier about command's names:

- Your bot **can** have a global and guild command with **the same name**

If you register the a slash command as Guild command **and** as Global command, you will see "duplicates" commands in your guild. One will be the guild command and the other will be the global command.
:::

## Editing or deleting slash commands

Once your commands have been registered, they will "stay" in Discord. Anything you do in your local files after this point will **not** affect the structure of the commands that have been registered already. You can edit the structure of a slash command or delete an existing slash command by registering a "new set of commands".

With this in mind, it's really straightforward how to edit or delete slash commands.

### Edit

To edit a slash command, simply change the structure of an existing slash command, and run the deployment script again to register the "new set of commands".

Example: Let's edit the `ping` command by changing the `description` of it.

Before:
```js {6}
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
```

Before:
```js {6}
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!!!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
```

Finally, run the following command again to register the "new set of commands":
```sh:no-line-numbers
node deploy-commands.js
```

### Delete

To delete a slash command, simply exclude it from the array that gets passed to `rest.put()`, and run the deploymnent script again to register the "new set of commands".

#### Delete one command

Let's delete the `user` command as an example. You simply exclude it from the `commands` array in the deployment script. Since we are using the command handler to load all the command files that are inside the `commands` folder, this means we just need to delete the `user.js` file from the folder, or simply move it to another directory.

Finally, run the following command again to register the "new set of commands":
```sh:no-line-numbers
node deploy-commands.js
```

#### Delete all commands

If you want to delete all your slash commands, you provide an empty array in the body of `rest.put()` of your `deploy-commands.js` file.

This can be achieved by either deleting all the command files that are inside the `commands` folder, or you can simply hardcode an empty array in the deployment script, like so:

```js:no-line-numbers {3}
await rest.put(
  Routes.applicationGuildCommands(clientId, guildId),
  { body: [] },
);
```

Finally, run the command again to register the "new set of commands":
```sh:no-line-numbers
node deploy-commands.js
```

## Options

::: warning
Maximum number of option allowed in a single command is **25**.
:::

Application commands can have `options`. Think of these options as arguments to a function. You can specify them as shown below:

```js {6-8}
const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back'));
```

### Required options

::: warning
Required options must be listed **before** optional options in the command structure.
:::

Options can also be required. When an option is required, Discord will prevent the user from using the command if they don't provide any input for that option.

You can make an option as required by using the `.setRequired(true)` function from the options builder, as shown below:

```js {9}
const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back')
			.setRequired(true));
```

### Option types

As you saw earlier, we added an option with the `addStringOption()` method from the `SlashCommandBuilder()` builder. This will give your `/ping` command an option of type `STRING`, meaning your bot is expecting a `STRING` value from the option. There are other types of options as well, and the builder has a method for each of these types, namely:

Method | Type | Note
--- | --- | ---
`.addStringOption()` | `STRING` |
`.addIntegerOption()` | `INTEGER` | Any integer between -2^53 and 2^53
`.addBooleanOption()` | `BOOLEAN` |
`.addUserOption()` | `USER` |
`.addChannelOption()` | `CHANNEL` | Includes all channel types + categories
`.addRoleOption()` | `ROLE` |
`.addMentionableOption()` | `MENTIONABLE` | 	Includes users and roles
`.addNumberOption()` | `NUMBER` | 	Any double between -2^53 and 2^53

### Predefined Choices

The `STRING` and `INTEGER` option types both can have `choices`. `choices` are a set of predetermined values users can pick from when selecting the option that contains them.

::: warning
If you specify `choices` for an option, they'll be the **only** valid values users can pick!
:::

Specify them by using the `addChoice()` method from the slash command builder:

```js {10-12}
const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('gif')
	.setDescription('Sends a random gif!')
	.addStringOption(option =>
		option.setName('category')
			.setDescription('The gif category')
			.setRequired(true)
			.addChoice('Funny', 'gif_funny')
			.addChoice('Meme', 'gif_meme')
			.addChoice('Movie', 'gif_movie'));
```

The first parameter of `.addChoice()` is the name of the choice that will be displayed in Discord, while the second parameter is the value of the corresponding choice that your bot will receive.

::: warning
- Max choice count is **25**.
- Max character count of `name` of a choice is **100**.
- Max character count of `value` of a choice is **100** if it is a string.
- `value` can only be of type string, integer, double or boolean.
:::

## Subcommands and Subcommand Groups

For those developers looking to make more organized and complex groups of commands, look no further than subcommands and groups.

**Subcommands** organize your commands by **specifying actions within a command or group**.

**Subcommand Groups** organize your **subcommands** by **grouping subcommands by similar action or resource within a command**.

These are not enforced rules. You are free to use subcommands and groups however you'd like.

::: warning
Currently, subcommands and subcommand groups all appear at the top level in the command explorer. This may change in the future to include them as nested autocomplete options.
:::

::: danger
Using subcommands or subcommand groups will make your base command unusable. You can't send the base `/permissions` command as a valid command if you also have `/permissions add | remove` as subcommands or subcommand groups
:::

Discord supports nesting one level deep within a group, meaning your top level command can contain subcommand groups, and those groups can contain subcommands. **That is the only kind of nesting supported**. Here's some visual examples:

```:no-line-numbers
VALID

command
|
|__ subcommand
|
|__ subcommand

----

command
|
|__ subcommand-group
    |
    |__ subcommand
|
|__ subcommand-group
    |
    |__ subcommand


-------

INVALID


command
|
|__ subcommand-group
    |
    |__ subcommand-group
|
|__ subcommand-group
    |
    |__ subcommand-group

----

INVALID

command
|
|__ subcommand
    |
    |__ subcommand-group
|
|__ subcommand
    |
    |__ subcommand-group
```

**Example walkthrough**

Let's look at an example. Let's imagine you run a moderation bot. You want to make a `/permissions` command that can do the following:

- **Get** the guild permissions for a **user** or a **role**
- **Get** the permissions for a **user** or a **role** on a specific channel
- **Edit** the guild permissions for a **user** or a **role**
- **Edit** the permissions for a **user** or a **role** on a specific channel

We'll start by defining the top-level information for `/permissions`:

![](./images/subcommand-example.png)

```js:no-line-numbers
new SlashCommandBuilder()
  .setName('permissions')
  .setDescription('Get or edit permissions for a user or a role')
```

Now we have a command named `permissions`. We want this command to be able to affect **users** and **roles**. Rather than making two separate commands (for example, `permissions-users` and `permissions-role`), we can use subcommand groups. We want to use subcommand groups here because we are grouping subcommands (`get` and `edit`) on a similar resource: `user` or `role`.

```js:no-line-numbers {4-11}
new SlashCommandBuilder()
  .setName('permissions')
  .setDescription('Get or edit permissions for a user or a role')
  .addSubcommandGroup(subcommandgroup =>
    subcommandgroup
      .setName('user')
      .setDescription('Get or edit permissions for a user'))
  .addSubcommandGroup(subcommandgroup =>
    subcommandgroup
      .setName('role')
      .setDescription('Get or edit permissions for a role'))
```

If you registered the command again, you'll notice that a command like this **will NOT show up** in the command explorer. That's because groups are effectively "folders" for commands, and we've made two empty folders. So let's continue.

Now that we've effectively made `user` and `role` "folders", we want to be able to either `get` and `edit` permissions. Within the subcommand groups, we can make subcommands for `get` and `edit`:

![](./images/subcommand-example2.png)

```js:no-line-numbers {8-15,20-27}
new SlashCommandBuilder()
  .setName('permissions')
  .setDescription('Get or edit permissions for a user or a role')
  .addSubcommandGroup(subcommandgroup =>
    subcommandgroup
      .setName('user')
      .setDescription('Get or edit permissions for a user')
      .addSubcommand(subcommand =>
        subcommand =>
          .setName('get')
          .setDescription('Get permissions for a user'))
      .addSubcommand(subcommand =>
        subcommand =>
          .setName('edit')
          .setDescription('Edit permissions for a user'))
  .addSubcommandGroup(subcommandgroup =>
    subcommandgroup
      .setName('role')
      .setDescription('Get or edit permissions for a role')
      .addSubcommand(subcommand =>
        subcommand =>
          .setName('get')
          .setDescription('Get permissions for a role'))
      .addSubcommand(subcommand =>
        subcommand =>
          .setName('edit')
          .setDescription('Edit permissions for a role'))
```

Finally, let's add an option of type `USER` and `ROLE` for the corresponding subcommand.

```js:no-line-numbers {12-15,20-23,32-35,40-43}
new SlashCommandBuilder()
  .setName('permissions')
  .setDescription('Get or edit permissions for a user or a role')
  .addSubcommandGroup(subcommandgroup =>
    subcommandgroup
      .setName('user')
      .setDescription('Get or edit permissions for a user')
      .addSubcommand(subcommand =>
        subcommand =>
          .setName('get')
          .setDescription('Get permissions for a user'))
          .addUserOption(option =>
            option.setName('user')
              .setDescription('The user whose permission you want to get')
              .setRequired(true))
      .addSubcommand(subcommand =>
        subcommand =>
          .setName('edit')
          .setDescription('Edit permissions for a user')
          .addUserOption(option =>
            option.setName('user')
              .setDescription('The user whose permission you want to get')
              .setRequired(true)))
  .addSubcommandGroup(subcommandgroup =>
    subcommandgroup
      .setName('role')
      .setDescription('Get or edit permissions for a role')
      .addSubcommand(subcommand =>
        subcommand =>
          .setName('get')
          .setDescription('Get permissions for a role')
          .addRoleOption(option =>
            option.setName('role')
              .setDescription('The role whose permission you want to get')
              .setRequired(true)))
      .addSubcommand(subcommand =>
        subcommand =>
          .setName('edit')
          .setDescription('Edit permissions for a role')
          .addRoleOption(option =>
            option.setName('role')
              .setDescription('The role whose permission you want to get')
              .setRequired(true)))
```

And there you have it. You've built the structure of a command that contains subcommand groups, subcommands, and required options. The only thing left to do is to register your new shiny `permissions` command.

This is what it will look like if you tried to use `/permissions user get`:

![](./images/subcommand-option.png)
