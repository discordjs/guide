# Adding more commands

::: tip
This page is a follow-up and bases its code on [the previous page](/creating-your-bot/configuration-files.md) and assumes that you have read [the interactions section](/interactions/registering-slash-commands.md) and are familiar with its usage.
:::

A bot with nothing but a single command would be boring, and you probably have a bunch of command ideas floating around in your head already, right? Let's begin, then.

Here's what your interaction event should currently look like:

```js
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
	}
});
```

Before doing anything else, make a property to store the token. Instead of `const config = ...`, you can destructure the config file to extract the token variable.

```js {1,3}
const { token } = require('./config.json');
// ...
client.login(token);
```

From now on, if you change the token in your `config.json` file, it'll change in your bot file as well.

::: tip
If you aren't familiar with some of this syntax, it may be ES6 syntax. If it does confuse you, you should check out [this guide page](/additional-info/es6-syntax.md) before continuing.
:::

## Simple command structure

You already have an if statement that checks messages for a ping/pong command. Adding other command checks is just as easy; chain an `else if` to your existing condition. Instead of using `interaction.commandName` every time, you can destructure it as shown here.

```js {2-10}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'beep') {
		await interaction.reply('Boop!');
	}
});
```

## Displaying real data

Let's start displaying some real data. For now, we'll be displaying basic member/server info.

### Server info command

Make another if statement to check for commands using `server` as the command name. You get the interaction object and reply to the interaction just as before:

::: tip
Servers are referred to as "guilds" in the Discord API and discord.js library. Whenever you see someone say "guild", they mean server.
:::

```js {10-12}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'beep') {
		await interaction.reply('Boop!');
	} else if (commandName === 'server') {
		await interaction.reply(`This server's name is: ${interaction.guild.name}`);
	}
});
```

The code above would result in this:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">server</DiscordInteraction>
		</template>
		This server's name is: Discord Bot Guide
	</DiscordMessage>
</DiscordMessages>

If you want to expand upon that command and add some more info, here's an example of what you can do:

```js {10-12}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'beep') {
		await interaction.reply('Boop!');
	} else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	}
});
```

That would display both the server name _and_ the amount of members in it.

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">server</DiscordInteraction>
		</template>
		Server name: Discord Bot Guide<br>
		Total members: 3
	</DiscordMessage>
</DiscordMessages>

Of course, you can modify this to your liking. You may also want to display the date the server was created or the server's verification level. You would do those in the same manner–use `interaction.guild.createdAt` or `interaction.guild.verificationLevel`, respectively.

::: tip
Refer to the <DocsLink path="class/Guild" /> documentation for a list of all the properties you can access and all the methods you can call on a server!
:::

### User info command

Set up another if statement and use the command name `user-info`.

<!-- eslint-skip -->

```js {12-14}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'beep') {
		await interaction.reply('Boop!');
	} else if (commandName === 'server') {
		await interaction.reply(`This server's name is: ${interaction.guild.name}`);
	} else if (commandName === 'user-info') {
		await interaction.reply(`Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`);
	}
});
```

This will display the command author's **username** (not nickname, if they have one set), as well as their user ID.

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">user-info</DiscordInteraction>
		</template>
		Your username: User <br>
		Your ID: 123456789012345678
	</DiscordMessage>
</DiscordMessages>

::: tip
`interaction.user` refers to the user who sent the command. Check out the <DocsLink path="class/User" /> documentation page for a full list of all the properties and methods for the user object.
:::

And there you have it! As you can see, it's quite simple to add additional commands.

## The problem with `if`/`else if`

If you don't plan to make more than seven or eight commands for your bot, then using an if/else if chain is sufficient; it's presumably a small project at that point, so you shouldn't need to spend too much time on it. However, this isn't the case for most of us.

You probably want your bot to be feature-rich and easy to configure and develop, right? Using a giant if/else if chain won't let you achieve that; it will only hinder your development process. Next, we'll be diving right into something called a "command handler" - code that makes handling commands easier and much more efficient.

Before continuing, here's a small list of reasons why you shouldn't use if/else if chains for anything that's not a small project:

* Takes longer to find a piece of code you want.
* Easier to fall victim to [spaghetti code](https://en.wikipedia.org/wiki/Spaghetti_code).
* Difficult to maintain as it grows.
* Difficult to debug.
* Difficult to organize.
* General bad practice.

In short, it's just not a good idea. But that's why this guide exists! Go ahead and read the next few pages to prevent these issues before they happen, learning new things along the way.

## Resulting code

<ResultingCode />
