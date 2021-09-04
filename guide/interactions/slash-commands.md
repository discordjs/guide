# Slash Commands

::: warning
This page will **NOT** be using the command handler version of the `index.js` and `deploy-commands.js` files for the sake of simplicity during explanation. However, all the concepts and examples in this page are also applicable for the command handler version of the aformentioned files.
:::

## What are Slash Commands?

Discord provides developers with the option to create client-integrated Slash Commands.

Here is a quick 1 minute explanation video from Discord:

<iframe width="854" height="480" src="https://www.youtube.com/embed/4XxcpBxSCiU?fs=0&modestbranding=1&rel=0" frameborder="0"></iframe>

If you want a more technical explanation, you can read the [blog post by Discord](https://blog.discord.com/slash-commands-are-here-8db0a385d9e6).

You can also always refer to [Discord's official documentation](https://discord.com/developers/docs/interactions/application-commands).

In this page, we'll cover how to make them work using discord.js!

To make Slash Commands work, we need to do two things:

1. **Register the _structure_ of the Slash Command**: We will be creating a separate file called `deploy-commands.js` for registration. In this step, we are essentially telling Discord:
> "Show *these* commands to the user when they type `/` in the chat."

2. **Reply to the Slash Command**: In this step, we decide *what* and *how* to reply to the user who used our Slash Command. This is essentially the "bot" itself (the `index.js`).

::: warning
You only need to register the *structure* of your Slash Commands **ONCE**. We will see what we mean by "*structure*" in the next section.

Once your commands have been registered, they will "stay" in Discord. Anything you do in your local file after this point will **NOT** affect the commands that have been registered already. You can even delete your `deploy-commands.js` file and it won't affect the commands that have been registered already.

If you do any of the following in your **local files**:
- Add a new command
- Edit an existing command's structure (e.g. changing `setDescription('Replies with pong!')` to `setDescription('some random description')`, or adding an option such as `.addStringOption()`)
- Remove a command

then **you will need to register the "new set of commands"** to Discord.
:::

## Authorization

Before we start registering Slash Commands, make sure your bot has the `applications.commands` scope for the particular guild that you will be working with. Refer back to [Adding your bot to servers](../preparations/adding-your-bot-to-servers.md) if you haven't done so already.

## Registering Slash Commands

A Slash Command can be registered as either **guild command** or **global command**.

**Guild commands** are only available to the guild you specify when registering the command. Guild commands are NOT available in DMs.

**Global commands** are available for every guild that adds your bot. A user can also use a bot's global commands in DMs if that bot shares a mutual guild with the user.

Command names are UNIQUE per bot, within each scope (global and guild). That means:

- Your bot **cannot** have two global commands with the same name
- Your bot **cannot** have two guild commands with the same name on the same guild
- Your bot **can** have a global and guild command with the same name
- Multiple bots **can** have commands with the same names

A bot can have up to 100 global commands.

A bot can have up to 100 guild commands per guild.

- Slash Command `name` must be all lowercase matching `^[\w-]{1,32}$`. (Max. character count is **32**)
- Maximum character count allowed in `description` is **100**.

You can test if your command's `name` abides by this regex, by using [https://regexr.com/63lqq](https://regexr.com/63lqq).

::: tip
**Guild commands** are available only within the guild specified on registration. Guild commands update **instantly**. We recommend you use guild commands for quick testing, and global commands when they are ready for public use.

**Global commands** are available on all your bot's guilds. Global commands are cached for **1 hour**. That means that new global commands will **fan out slowly across all guilds**, and will be guaranteed to be updated in an hour.
:::

### Guild commands

As we mentioned earlier, we only have to register the structure of our Slash Commands **once**. As such, **we strongly recommend creating a separate `deploy-commands.js` file** in your project directory. This file will be used to register, edit, and delete Slash Commands for your bot application.

```:no-line-numbers {4}
discord-bot/
├── node_modules
├── config.json
├── deploy-commands.js // <-- Create a new file named deploy-commands.js
├── index.js
├── package-lock.json
└── package.json
```

To register Slash Commands to Discord, we make an HTTP PUT request to a specific endpoint. Thankfully, discord.js has developed separate modules to help us do this more easily. You'll need to install [`@discordjs/builders`](https://github.com/discordjs/builders), [`@discordjs/rest`](https://github.com/discordjs/discord.js-modules/blob/main/packages/rest/), and [`discord-api-types`](https://github.com/discordjs/discord-api-types/).

```sh:no-line-numbers
npm install @discordjs/builders @discordjs/rest discord-api-types
```

- The `@discordjs/builders` module is used for building the structure of a Slash Command
- The `@discordjs/rest` module is used for making HTTP PUT request
- The `discord-api-types` module gives us the endpoint (route) for registering Slash Commands

Let's suppose we want to register these 3 Slash Commands for our bot: `/ping`, `/server`, and `/user`.

![](../creating-your-bot/images/commandpicker.png)

Here's what your `deploy-commands.js` will look like:

:::: code-group
::: code-group-item deploy-commands.js
```js{4,6-11,17-21}
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

// Define an array with 3 Slash Commands structure
const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		// Register the array of Slash Commands with res.put()
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();
```
:::
::: code-group-item config.json
```json
{
	"clientId": "123456789012345678",
	"guildId": "876543210987654321",
	"token": "your-token-goes-here"
}
:::
::::

Focus on these variables:

- `clientId`: Your client's id
- `guildId`: Your development server's id
- `commands`: An array of commands to register. 

**The [`SlashCommandBuilder()`](/popular-topics/builders.md#Slash-command-builders) is used to build the structure for your commands**. As you can see from the script above, the structure of the `/ping` command has a name `ping` and a description `Replies with pong!`. The structure can include other things such as subcommand, options, choices, permission, etc. We will learn about these other parts of the structure in a later section of this page.

Then, we make an HTTP PUT request with `rest.put()`, to the endpoint (route) `Routes.applicationGuildCommands()`, and we provide the array of commands in the body of the PUT request `{ body: commands }`.

::: tip
In order to get your client and guild ids, open Discord and go to your settings. On the "Advanced" page, turn on "Developer Mode". This will enable a "Copy ID" button in the context menu when you right-click on a server icon, a user's profile, etc.
:::

Once you fill in those variables, run:
```sh:no-line-numbers
node deploy-commands.js
``` 
in your project directory to register the structure of your Slash Commands to your specified guild.

Congratulations! 🎉

You've successfully registered your Slash Commands. Go ahead and type `/` in your guild and you should be able to see your Slash Commands already:

![](../creating-your-bot/images/commandpicker.png)

### Global commands

Our `deploy-commands.js` file already registers our Slash Commands as **Guild commands**. If you want to register the commands as **Global commands**, simply change the route to:

:::: code-group
::: code-group-item deploy-commands.js
```js :no-line-numbers {2}
		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);
```
:::
::::

::: warning
Remember what we saw earlier about command names:

- Your bot **can** have a global and guild command with **the same name**

If you register the a Slash Command as Guild command **and** as Global command, you will see "duplicates" commands in your guild. One will be the guild command and the other will be the global command.
:::

::: warning
Because global commands can take up to 1 hour to reflect new changes, Discord has implemented them to have inherent read-repair functionality. That means that if you make an update to a global command, and a user tries to use that command before it has updated for them, Discord will do an internal version check and reject the command, and trigger a reload for that command.

When the command is rejected, the user will see an "**Invalid interaction application command**" error message.
:::

## Editing or deleting Slash Commands

As we saw in [What are Slash Commands?](#what-are-slash-commands) section:

::: warning
Once your commands have been registered, they will "stay" in Discord. Anything you do in your local file after this point will **NOT** affect the commands that have been registered already. You can even delete your `deploy-commands.js` file and it won't affect the commands that have been registered already.

If you do any of the following in your **local files**:
- Add a new command
- Edit an existing command's structure (e.g. changing `setDescription('Replies with pong!')` to `setDescription('some random description')`, or adding an option such as `.addStringOption()`)
- Remove a command

then **you will need to register the "new" set of commands** to Discord.
:::

With this in mind, it's really straightforward how to edit or delete Slash Commands.

### Edit

To edit a Slash Command, simply change the structure of an existing Slash Command, and run the deploymnent script again to register the "new set of commands".

Example: Let's edit the `ping` command by changing the `description` of it.

Before:
```js:no-line-numbers {2}
const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
].map(command => command.toJSON());
```

After:
```js:no-line-numbers {2}
const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!!!!!!!!!!!!!!!!!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
].map(command => command.toJSON());
```

Finally, run:
```sh:no-line-numbers
node deploy-commands.js
```

### Delete

To delete a Slash Command, simply exclude it from the array that gets passed to `rest.put()`, and run the deploymnent script again to register the "new set of commands".

Example: Let's delete the `user` command. To do so, we simply exclude it from the `commands` array.

Before:
```js:no-line-numbers {4}
const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
].map(command => command.toJSON());
```

After:
```js:no-line-numbers
const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
].map(command => command.toJSON());
```

Finally, run:
```sh:no-line-numbers
node deploy-commands.js
```

---

Naturally, if you want to delete all commands, you provide an empty array to `rest.put()`.
```js:no-line-numbers {3}
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: [] },
		);
```

## Replying to Slash Commands

Once you've registered your Slash Commands, users can now use your Slash Commands! Our next step is to make our bot reply to those Slash Commands. Let's go back to the `index.js` file. Your `index.js` file should look like this:

:::: code-group
::: code-group-item index.js
```js {13-23}
// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (interaction.commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	} else if (interaction.commandName === 'user') {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	}
});

// Login to Discord with your client's token
client.login(token);
```
:::
::::

A Slash Command is just one type of interaction. Therefore, we should first check if the interaction is a Slash Command by calling `.isCommand()`. Next, we check the name of the command by accessing the `.commandName` property. Finally, we reply to the interaction by calling `.reply()`.

::: danger
You MUST reply to the interaction within **3 seconds** of receiving it.
:::

Let's start the bot:
```sh:no-line-numbers
node index.js
```
and then use the `/ping` command in your guild. You should see something like this:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
</DiscordMessages>

Congratulations! 🎉

You now have 3 working Slash Commands. Go ahead and try out `/server` and `/user` as well. 

Your `/server` should look like this:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">server</DiscordInteraction>
		</template>
		Server name: Discord.js Guide
		<br />
		Total members: 2
	</DiscordMessage>
</DiscordMessages>

And your `/user` should look like this:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">user</DiscordInteraction>
		</template>
		Your tag: User#0001
		<br />
		Your id: 123456789012345678
	</DiscordMessage>
</DiscordMessages>

::: tip
We've only looked at `.reply()` to reply to the incoming `interaction`. There are other ways to reply to an interaction, which we will see in a later section called [Replying (continued)](#replying-continued).
:::

## Options

Slash Commands can have `options`. Think of these options as arguments to a function.

::: warning
Maximum number of option allowed in a single command is **25**.
:::

Let's suppose we want to add an option to our `/ping` command. We'll give it a name of `option-name` and a description of `some description`. It will look like this in Discord:

![](./images/option.png)

You can specify the option in the structure of your command as shown below:

```js:no-line-numbers {4-6}
new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with pong!')
  .addStringOption(option => 
    option.setName('option-name')
      .setDescription('some description'))
```

After registering the commad again, users can now use your `/ping` command with the `option-name` option. If a user used our `/ping` command like this:

![](./images/option-value.png)

Then we can grab the value `hello this is some string input` from the `option-name` option in our reply like this:

```js:no-line-numbers {1-2}
const userInput = interaction.options.getString('option-name');
console.log(userInput); // expected output: "hello this is some string input"
await interaction.reply('Pong!');
```

### Required options

Options can also be required. When an option is required, Discord will prevent the user from using the command if they don't provide any input for that option:

![](./images/option-required.png)

Let's make our `option-name` option as required. To do so, simply add `.setRequired(true)` in the option structure like so:

```js:no-line-numbers {7}
new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with pong!')
  .addStringOption(option => 
    option.setName('option-name')
      .setDescription('some description')
      .setRequired(true))
```

::: warning
Required options must be listed **before** optional options in the command structure.
:::

### Types of option

As we saw earlier, we added an option with the `addStringOption()` method from the `SlashCommandBuilder()` builder. This will give our `/ping` command an option of type `STRING`, meaning our bot is expecting a `STRING` value from the interaction. There are other types of options as well, and the builder has a method for each of these types, namely:

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

Likewise, the [`CommandInteractionOptionResolver`](https://discord.js.org/#/docs/main/stable/class/CommandInteractionOptionResolver) object that we receive from the `interactionCreate` event has a method for each of these types, namely:

Method | Returns
--- | ---
`.getString()` | [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
`.getInteger()` | [`Number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
`.getBoolean()` | [`Boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)
`.getUser()` | [`User`](https://discord.js.org/#/docs/main/stable/class/User)
`.getChannel()` | [`GuildChannel`](https://discord.js.org/#/docs/main/stable/class/GuildChannel)
`.getRole()` | [`Role`](https://discord.js.org/#/docs/main/stable/class/Role)
`.getMentionable()` | [`User`](https://discord.js.org/#/docs/main/stable/class/User) or [`GuildMember`](https://discord.js.org/#/docs/main/stable/class/GuildMember) or [`Role`](https://discord.js.org/#/docs/main/stable/class/Role)
`.getNumber()` | [`Number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
`.getMember()` | [`GuildMember`](https://discord.js.org/#/docs/main/stable/class/GuildMember)

Example:
```js:no-line-numbers
const userInput = interaction.options.getString('option-name');
```

### Predefined Choices

It is also possible to set predefined choices for an option of type `STRING` or `INTEGER`.

![](./images/choices.png)

To specify these predefined values, use the `addChoice()` method inside the corresponding option, like so:

```js:no-line-numbers {8-10}
new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with pong!')
  .addStringOption(option => 
    option.setName('option-name')
      .setDescription('some description')
      .setRequired(true)
      .addChoice('name1', 'value1')
      .addChoice('name2', 'value2')
      .addChoice('name2', 'value3'))
```

If a user used our `/ping` command and selected the `name2` choice in the `option-name` option, like so:

![](./images/choices-selected.png)

then the value that our bot receives is the string `"value2"`.

```js {2}
const userInput = interaction.options.getString('option-name');
console.log(userInput); // expected output: "value2"
await interaction.reply('Pong!');
```

As you can see, the first parameter of `.addChoice()` is the name of the choice that will be displayed in Discord, while the second parameter is the value of that choice that your bot will receive.

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

And there you have it. You've built the structure of a command that contains subcommand groups, subcommands, and required options. The only thing left to do is to register our new shiny `permissions` command.

This is what it will look like if we tried to use `/permissions user get`:

![](./images/subcommand-option.png)

You can easily check the name of a subcommand group or subcommand when you receive an interaction, like so:

```js:no-line-numbers
const subcommandgroup = interaction.options.getSubcommandGroup();
const subcommand = interaction.options.getSubcommand();

console.log(subcommandgroup); // expected output: "user"
console.log(subcommand); // expected output: "get"
```

## Replying (continued)

Here's a flowchart to help you understand visually *which* methods are you allowed to use at any given time. Feel free to refer back to this flowchart as you read the rest of this section.

![](./images/flowchart.png)

### Defer

As we saw in the [Replying to Slash Commands](#replying-to-slash-commands) section:

::: danger
You MUST reply to the interaction within **3 seconds** of receiving it.
:::

But what if our command takes more than 3 seconds to process before it can reply? To solve this, we can defer the interaction with `.deferReply()` within 3 seconds of receiving it. This is how it will look when you defer an interaction:

```js:no-line-numbers
await interaction.deferReply();
```

![](./images/deferreply.png)

Now that the interaction has been deferred, we can proceed with whatever task we need to do that might take a long time to finish. As long as the task finishes before the 15 minutes window, we can edit the deferral to let the user know that the bot is done completing the task.

```js:no-line-numbers
await interaction.deferReply();
// do some task that takes a long time to finish
await interaction.editReply('i am done!');
```

::: tip
Technically speaking, you could call `.reply()` right away with a message like `"Processing. Please wait..."` and treat that as a deferral. It's up to you to choose between using `.reply()` or `.deferReply()` within the first 3 seconds of receiving the interaction.

The only technical difference between `.reply()` and `.deferReply()` is that, if you don't call `.editReply()` or `.followUp()` after `.deferReply()`, then Discord will display the message `<Bot name> is thinking...` for the entire 15 minutes window and then turn into an "**Interaction failed**" error message once the 15 minutes window has expired.
:::

### Edit

#### Edit a reply

After sending an initial reply or defer (which must be done within **3 seconds** of receiving the interaction), you will have a **15 minutes** window to edit the reply or send followup messages however many times you want. We will look at followup messages in the next section.

To edit the original reply, we simply call `.editReply()` **after** calling `.reply()`.

```js:no-line-numbers
await interaction.reply('Pong!');
```

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
			>ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
</DiscordMessages>

```js:no-line-numbers {2}
await interaction.reply('Pong!');
await interaction.editReply('Pong edited');
```

<DiscordMessages>
	<DiscordMessage profile="bot" :edited="true">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
			>ping</DiscordInteraction>
		</template>
		Pong edited
	</DiscordMessage>
</DiscordMessages>


#### Edit a deferReply

You can also call `.editReply()` **after** calling `.deferReply()`.

```js:no-line-numbers
await interaction.deferReply();
```

![](./images/deferreply.png)

```js:no-line-numbers {2}
await interaction.deferReply();
await interaction.editReply('the task has been completed');
```

![](./images/deferreply-edited.png)

### Followup

#### Followup a reply

We can send additional messages after the initial reply. Just like edits, followups also have a **15 minutes** window.

You can call `.followUp()` **after** calling `.reply()`.

```js:no-line-numbers
await interaction.reply('pong');
await interaction.followUp('pong again');
```

![](./images/followup.png)

#### Followup a deferReply

You can also call `.followUp()` **after** calling `.deferReply()`. However, a followup to a deferral does **NOT** behave the same way as a followup to a reply. **The first followup will edit the deferral instead**. Additional messages will start from **the second followup**.

```js:no-line-numbers
await interaction.deferReply()
await interaction.followUp('this is the first followup')
await interaction.followUp('this is the second followup')
```

![](./images/deferreply-followup.png)

### Ephemeral state

You may not always want everyone who has access to the channel to see a slash command's response. Thankfully, Discord implemented a way to hide messages from everyone but the executor of the slash command. This type of message is called *ephemeral* and can be set by using `ephemeral: true`.

#### Ephemeral reply

```js:no-line-numbers
await interaction.reply({ content: 'Pong!', ephemeral: true });
```

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

#### Ephemeral defer

```js:no-line-numbers
await interaction.deferReply({ ephemeral: true });
```

![](./images/deferreply-ephemeral.png)

#### Ephemeral edit

You **cannot** change the ephemeral state of a message that has been already sent. That means that if you do this:

```js:no-line-numbers
await interaction.reply({ content: 'pong', ephemeral: false });
await interaction.editReply({ content: 'pong edited', ephemeral: true });
```

The reply will **not** change from non-ephemeral to ephemeral, even though we called `.editReply()` with `ephemeral: true`.

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
        :ephemeral="false"
			>ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
</DiscordMessages>
<br />
<DiscordMessages>
	<DiscordMessage profile="bot" :edited="true">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
			>ping</DiscordInteraction>
		</template>
		Pong edited
	</DiscordMessage>
</DiscordMessages>

---

The same applies to `.deferReply()` into `.editReply()`. 

The following **will stay non-ephemeral**.

```js:no-line-numbers
await interaction.deferReply({ ephemeral: false });
await interaction.editReply({ content: 'pong edited', ephemeral: true });
```

And the following **will stay ephemeral**.

```js:no-line-numbers
await interaction.deferReply({ ephemeral: true })
await interaction.editReply({ content: 'pong edited', ephemeral: false })
```

#### Ephemeral followup

The ephemeral state of followups are independent of the initial reply. This is because the followup is a separate message.

```js:no-line-numbers
await interaction.reply({ content: 'pong', ephemeral: false })
await interaction.followUp({ content: 'first followup', ephemeral: true })
await interaction.followUp({ content: 'second followup', ephemeral: true })
```

![](./images/followup-ephemeral.png)

As we saw in the previous section about [followup a deferReply](#followup-a-deferreply), the first followup to a deferral will replace the deferral instead of sending a new message. As a result, this will also affect the ephemeral state of the first followup:

```js:no-line-numbers
await interaction.deferReply({ ephemeral: true })
await interaction.followUp({ content: 'first followup', ephemeral: false })
await interaction.followUp({ content: 'second followup', ephemeral: false })
```

![](./images/followup-defer-ephemeral.png)

### Fetching the reply after sending it

::: danger
You **cannot** fetch an ephemeral message.
:::

You might need the `Message` object of the reply for various reasons, such as adding reactions. You can use the [`CommandInteraction#fetchReply()`](https://discord.js.org/#/docs/main/stable/class/CommandInteraction?scrollTo=fetchReply) method to fetch the `Message` instance of the reply:

```js:no-line-numbers
await interaction.reply('Pong!');
const message = await interaction.fetchReply();

await message.react('🤔');
```

Another reason you might need the `Message` object of the reply, is to await message components (such as `Buttons`):

```js:no-line-numbers
await interaction.reply({ content: 'Pong!', components: [actionRow] });
const message = await interaction.fetchReply();

const filter = i => i.customId === 'someId' && i.user.id === interaction.user.id;
await message.awaitMessageComponent({ filter });
```

Refer to the [Buttons](./buttons.md) page for more information about how to build one.

Another way to fetch the reply is to provide a `fetchReply:true` to the `.reply()` method.

```js:no-line-numbers
const message = await interaction.reply({ content: 'Pong!', fetchReply: true });
```

### Deleting the reply after sending it

::: danger
You **cannot** delete an ephemeral message.
:::

You can also delete the reply after sending the reply.

```js:no-line-numbers
await interaction.reply('Pong!');
await interaction.deleteReply();
```

## Permissions

Need to keep some of your commands safe from prying eyes, or only available to the right people? Slash Commands support permission overwrites! For both guild and global commands, you can enable or disable a specific **user** or **role** in a guild from using a command.

::: tip
For now, if you don't have permission to use a command, they'll show up in the command picker as disabled and unusable. They will **not** be hidden.
:::

As you might have noticed now, we were able to use all of our Slash Commands right after registering them. This is because the `default_permission` of a Slash Command is set to `true` by default if you don't specify it **during registration**.

You can set the `default_permission` of your Slash Command to `false` if you want them to be disabled for everyone (literally). Setting `default_permission` to `false` will disallow *anyone* in a guild from using the command—even Administrators and guild owners—unless a specific overwrite is configured. **It will also disable the command (if it's a global one) from being usable in DMs**.

We can set the `default_permission` of a Slash Command with the `setDefaultPermission()` method of the `SlashCommandBuilder()` builder that we have been using so far. For example, if we want to do that for the `ping` command:

```js:no-line-numbers
new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with pong!')
  .setDefaultPermission(false) // defaults to "true" if not specified
```

Then, we simply register the command again:
```sh:no-line-numbers
node deploy-commands.js
```

As we mentioned earlier, a Slash Command can either have `default_permission` set to `true`, which will *enable the command for everyone*, OR it can have it set to `false`, which will *disable it for everyone*. As a result, there are two different approaches for controlling the permission of a Slash Command:

- Blacklist
- Whitelist

The **blacklist** approach ENABLES the commnd for everyone (i.e. `setDefaultPermission(true)`), and then manually DISABLE the command for a specific **user** or a specific **role** in a specific guild.

The **whitelist** approach does the opposite. It DISABLES the command for everyone (i.e. `setDefaultPermission(false)`), and then manually ENABLE the command for a specific **user** or a specific **role** in a specific guild.

The process of "manually enabling/disabling the command for a specific user/role" is called **permission overwrite**.

::: warning
You can only add up to **10 permission overwrites** for a command.

**Permission overwrites are guild-specific**. In other words, you need to specify the guild that you want to do the permission overwrite in, **even if the command is a Global command**. That means that, for a given Global command, it's possible to enable it for a user in one guild, but disable it for the same user in another guild.
:::

Let's try the whitelist approach for the `ping` command. First we set the `default_permission` to `false` by using the `setDefaultPermission()` method:
```js:no-line-numbers {4}
new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with pong!')
  .setDefaultPermission(false)
```

Next, we run the deployment script again to register our newly edited `ping` command:
```sh:no-line-numbers
node deploy-commands.js
```

Go ahead and try using the `/ping` command in your guild. You should see it grayed out and disabled like this:

![](./images/disabled-command.png)

Next, let's whitelist a specific role. We need 3 IDs for a permission overwrite:

- Guild ID
- Command ID
- User/role ID

So far, we already have the Guild ID, so:

- Command ID ✅
- Guild ID
- User/role ID

With these 3 IDs, we make another HTTP PUT request but to a different endpoint (route). As you might've guessed, that means we need to go back to our `deploy-commands.js` file to add a few more lines:

:::: code-group
::: code-group-item deploy-commands.js
```js {7,16,23,25-36,38-41,43}
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!').setDefaultPermission(false),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		const response = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully registered application commands.');

    const pingCommand = response.find(cmd => cmd.name === 'ping');

    const fullPermissions = [
      {
        id: pingCommand.id,
        permissions: [
          {
            id: '1234567890',
            type: 1,
            permission: true,
          }
        ]
      }
    ];

    await rest.put(
      Routes.guildApplicationCommandsPermissions(clientId, guildId),
      { body: fullPermissions },
    );

    console.log('Successfully applied permission overwrite.');
	} catch (error) {
		console.error(error);
	}
})();
```
:::
::::

::: warning
Again, we already mentioned at the very top of this page that we are not using the command handler version of the `index.js` and `deploy-commands.js` files for the sake of simplicity during explanation. However, all the concepts and examples in this page are also applicable for the command handler version of the aformentioned files.
:::

As you can see in line 16, calling `rest.put()` to this specific endpoint `Routes.applicationGuildCommands()` will return a response. We store that response in the variable `response`. This response will be an array of all the registered commands.

Then, in line 23, we retrieve the `ping` command from that array with [`Array.find()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find). Once we retrieve the `ping` command, we can access its ID from the `id` property.

- Guild ID ✅
- Command ID ✅
- User/role ID

Next, in line 25 to 33, we define an array of JSON objects with a very specific shape. This JSON object needs to have a property called `id` and `permissions`. The `id` should be the command ID (line 27) and the `permissions` should be an array of [Application Command Permissions Structure](https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object-application-command-permissions-structure) objects (line 28-34). This `Application Command Permissions Structure` object needs to have three properties: `id`, `type`, and `permission`. The `id` will be the user id or role id that we want to whitelist (line 30). The `type` specifies what type of `id` it is (line 31). Type `1` means `ROLE` id, and type `2` means `USER` id. Finally, the `permission` specifies if we want to allow or disallow this `id` to use the command (line 32). If `permission` is `true` then it means allow, if it is `false` then it means disallow. Since our `ping` command is already registered with `setDefaultPermission(false)`, it wouldn't make much sense to also have a permission overwrite to disallow specific users or roles. On top of that, we are trying to enable this command for a specific role (i.e. whitelist the role), hence we should set `permission: true`.

- Guild ID ✅
- Command ID ✅
- User/role ID ✅

Finally, we make the HTTP PUT request in line 38. However, we use a different endpoint (route) this time: `Routes.guildApplicationCommandsPermissions()` (line 39), and we pass our array in the body of the PUT request (line 40).

Congratulations! 🎉

Go ahead and assign yourself that role in your guild. You should be able to use the `ping` command now. If you remove that role from yourself, you will see the `ping` command as disabled again.

::: warning
As you've probably noticed, we can only adjust the permissions of a command at the top-level. This means that we do not have the granularity of adjusting permissions for subcommand groups and/or subcommands.

Let's use the `/permissions` command from [Subcommands and Subcommand groups](#subcommands-and-subcommand-groups) as example. It's NOT possible to enable `/permissions user get` for a user, while also disabling `/permissions user edit` for that same user.
:::

### Alternative

You can also make permission overwrite with the bot itself.

```js:no-line-numbers {5}
const pingCommand = client.guilds.cache.get(guildId).commands.cache.find(cmd => cmd.name === 'ping');

const permissions: [
  {
    id: '1234567890',
    type: 'ROLE',
    permission: true,
  }
];

await pingCommand.permissions.set({ permissions });
```

All 3 IDs are satisfied here as well:

- Guild ID ✅
- Command ID ✅
- User/role ID ✅

The Guild ID is specified in `guildId`.

The Command ID is built into the `pingCommand` variable, because it's an instance of [ApplicationCommand](https://discord.js.org/#/docs/main/stable/class/ApplicationCommand).

The user/role ID is specified in the highlighted line.