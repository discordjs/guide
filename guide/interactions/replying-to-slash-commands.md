# Replying to slash commands

::: tip
This page is a follow-up to [Registering slash commands](./registering-slash-commands.md) and assumes you have the slash commands that are explained in that page already registered.
:::

Here's a flowchart to help you understand visually *which* methods are you allowed to use at any given time. Feel free to refer back to this flowchart as you read the rest of this page.

![](./images/flowchart.png)

## Receiving interactions

A slash command is just one type of [interaction](https://discord.com/developers/docs/interactions/application-commands#Slash-commands). Therefore, you can make your bot listen to the [`interactionCreate`](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-interactionCreate) event to receive incoming interactions.

:::: code-group
::: code-group-item index.js
```js {10-12}
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	console.log(interaction);
});

client.login(token);
```
:::
::::

You can go ahead and start your bot

```sh:no-line-numbers
node index.js
```

and use one of your registered slash commands. You should see something in your terminal similar to this:

```:no-line-numbers
CommandInteraction {
  type: 'APPLICATION_COMMAND',
  id: '123',
  applicationId: '123',
  channelId: '123',
  guildId: '123',
  user: User { ... },
  member: GuildMember { ... },
  version: 1,
  commandId: '123',
  commandName: 'ping',
  deferred: false,
  options: CommandInteractionOptionResolver {
    _group: null,
    _subcommand: null,
    _hoistedOptions: []
  },
  replied: false,
  ephemeral: null,
  webhook: InteractionWebhook { id: '123' }
}
```

If you did, then your bot is receiving incoming interactions properly!

## Reply

::: warning
You must reply or defer the interaction within **three seconds** of receiving it.
:::

Replying to an interaction is really simple. We can just call the `.reply()` method.

:::: code-group
::: code-group-item index.js
```js {11-21}
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	} else if (commandName === 'user') {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	}
});

client.login(token);
```
:::
::::

::: tip
The `index.js` file we have here doesn't have a command handler (for the sake of simplicity during explanation), but the concepts and examples that are explained in this page are also applicable to the command handler version.
:::

A slash command is just one type of interaction. Therefore, you should first check if the interaction is a slash command by calling `interaction.isCommand()` (line 11).

Next, you should check the name of the command by accessing the `commandName` property (line 13). Once you have the name of the command, you can use some `if`/`else if` statements to reply accordingly. 

Finally, you reply to the interaction by calling `interaction.reply()`.

Let's start the bot:
```sh:no-line-numbers
node index.js
```
and then use the `/ping` command in your guild. Your bot should've replied and you should see something like this in your Discord:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
</DiscordMessages>

## Defer

As we mentioned earlier:

::: warning
You must reply or defer the interaction within **three seconds** of receiving it.
:::

But what if your command takes more than three seconds to process before it can reply? To solve this, you can defer the interaction with `.deferReply()` within three seconds of receiving it.

```js:no-line-numbers
await interaction.deferReply();
```

This is how it will look when you defer an interaction:

![](./images/deferreply.png)

Now that the interaction has been deferred, you can proceed with whatever task you need to do that might take a long time to finish. As long as the task finishes within 15 minutes, you can edit the deferral to let the user know that the bot is done completing the task. (We will look at `.editReply()` in the next section)

```js:no-line-numbers {3}
await interaction.deferReply();
// do some task that takes a long time to finish
await interaction.editReply('The task has been completed!');
```

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		The task has been completed!
	</DiscordMessage>
</DiscordMessages>

::: tip
Technically speaking, you could call `.reply()` right away with a message like `"Processing. Please wait..."` and treat that as a deferral. It's up to you to choose between using `.reply()` or `.deferReply()` within the first three seconds of receiving the interaction.

The only technical difference between `.reply()` and `.deferReply()` is that `.deferReply()` will display a `<Bot name> is thinking...` message for 15 minutes and then turn into an "**Interaction failed**" error message once the 15 minutes window has expired. To avoid this error message, you should call `.editReply()` or `.followUp()` at least once within that 15 minutes window.
:::

## Edit

### Edit a reply

After sending an initial reply or defer (which must be done within **three seconds** of receiving the interaction), you will have a **15 minutes** window to edit the reply or send followup messages however many times you want. We will look at followup messages in the next section.

To edit the original reply, you simply call `.editReply()` **after** calling `.reply()`.

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


### Edit a deferReply

You can also call `.editReply()` **after** calling `.deferReply()`.

```js:no-line-numbers
await interaction.deferReply();
```

![](./images/deferreply.png)

```js:no-line-numbers {2}
await interaction.deferReply();
await interaction.editReply('The task has been completed!');
```

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		The task has been completed!
	</DiscordMessage>
</DiscordMessages>

## Followup

### Followup a reply

You can send additional messages after the initial reply. Just like edits, followups also have a **15 minutes** window.

You can call `.followUp()` **after** calling `.reply()`.

```js:no-line-numbers
await interaction.reply('pong');
await interaction.followUp('pong again');
```

![](./images/followup.png)

### Followup a deferReply

You can also call `.followUp()` **after** calling `.deferReply()`. However, a followup to a deferral does **not** behave the same way as a followup to a reply. **The first followup will edit the deferral instead**. Additional messages will start from **the second followup**.

```js:no-line-numbers
await interaction.deferReply()
await interaction.followUp('this is the first followup')
await interaction.followUp('this is the second followup')
```

![](./images/deferreply-followup.png)

## Ephemeral state

You may not always want everyone who has access to the channel to see a slash command's response. Thankfully, Discord implemented a way to hide messages from everyone but the executor of the slash command. This type of message is called *ephemeral* and can be set by using `ephemeral: true`.

### Ephemeral reply

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

### Ephemeral defer

```js:no-line-numbers
await interaction.deferReply({ ephemeral: true });
```

![](./images/deferreply-ephemeral.png)

### Ephemeral edit

You **cannot** change the ephemeral state of a message that has been already sent. That means that if you do this:

```js:no-line-numbers
await interaction.reply({ content: 'pong', ephemeral: false });
await interaction.editReply({ content: 'pong edited', ephemeral: true });
```

The reply will **not** change from non-ephemeral to ephemeral, even though you called `.editReply()` with `ephemeral: true`.

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

### Ephemeral followup

The ephemeral state of followups are independent of the initial reply. This is because the followup is a separate message.

```js:no-line-numbers
await interaction.reply({ content: 'pong', ephemeral: false })
await interaction.followUp({ content: 'first followup', ephemeral: true })
await interaction.followUp({ content: 'second followup', ephemeral: true })
```

![](./images/followup-ephemeral.png)

As you saw in the previous section about [followup a deferReply](#followup-a-deferreply), the first followup to a deferral will replace the deferral instead of sending a new message. As a result, this will also affect the ephemeral state of the first followup:

```js:no-line-numbers
await interaction.deferReply({ ephemeral: true })
await interaction.followUp({ content: 'first followup', ephemeral: false })
await interaction.followUp({ content: 'second followup', ephemeral: false })
```

![](./images/followup-defer-ephemeral.png)

## Fetching the reply after sending it

::: danger
Unless you're using discord.js 13.2.0 or higher, you **cannot** fetch an ephemeral message.
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
await message.awaitMessageComponent({ filter, componentType: 'BUTTON' });
```

Refer to the [Buttons](./buttons.md) page for more information about how to build one.

Another way to fetch the reply is to provide a `fetchReply: true` to the `.reply()` method.

```js:no-line-numbers
const message = await interaction.reply({ content: 'Pong!', fetchReply: true });
```

## Deleting the reply after sending it

::: danger
You **cannot** delete an ephemeral message.
:::

You can also delete the reply after sending it.

```js:no-line-numbers
await interaction.reply('Pong!');
await interaction.deleteReply();
```

## Options

In this section, we'll cover how to access the values of a command's options.

Let's take the `/ping` command from [Registering slash commands](./registering-slash-commands.md) as example. If a user used your `/ping` command like this:

![](./images/option-value.png)

Then you can retrieve the value "`hello this is some string input`" from the `option-name` option as shown below:

```js:no-line-numbers {1-2}
const userInput = interaction.options.getString('option-name');
console.log(userInput); // expected output: "hello this is some string input"
```

We can access a command's options with the `.options` property, which is an instance of [`CommandInteractionOptionResolver`](https://discord.js.org/#/docs/main/stable/class/CommandInteractionOptionResolver). 

Then, we call `.getString('option-name')` to retrieve the value that the user provided to the `option-name` option.

### Types of options

The [`CommandInteractionOptionResolver`](https://discord.js.org/#/docs/main/stable/class/CommandInteractionOptionResolver) object has a method for each type of options, namely:

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

### Predefined choices

Let's suppose you have a `ping` command with the following structure:

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

The first parameter of `.addChoice()` is the name of the choice that will be displayed in Discord, while the second parameter is the value of that choice that your bot will receive.

If a user used your `/ping` command and selected the `name2` choice in the `option-name` option, as shown below:

![](./images/choices-selected.png)

then the value that your bot receives is the string `"value2"`.

```js {2}
const userInput = interaction.options.getString('option-name');
console.log(userInput); // expected output: "value2"
```

## Subcommands and Subcommand Groups

You can easily check the name of a subcommand group or subcommand with the `.getSubcommandGroup()` and `.getSubcommand()` methods respectively.

If a user used a slash command with the following subcommand group and subcommand:

![](./images/subcommand-option.png)

Then you can check for the command's subcommand group and subcommand as shown below:

```js:no-line-numbers
const subcommandgroup = interaction.options.getSubcommandGroup();
const subcommand = interaction.options.getSubcommand();

console.log(subcommandgroup); // expected output: "user"
console.log(subcommand); // expected output: "get"
```
