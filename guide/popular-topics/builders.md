# Builders

Discord.js provides a `builders` package which contains a variety of utilities you can use when writing your Discord bot.
To install the package run `npm install @discordjs/builders` in your terminal.

## Formatters

Formatters are a set of utility functions which format input strings into the given format.

### Basic Markdown

The Formatters provide functions to format strings into all the different Markdown styles supported by Discord.

```js
const { bold, italic, strikethrough, spoiler, quote, blockQuote, underscore } = require('@discordjs/builders');
const string = 'Hello!';

const boldString = bold(string);
const italicString = italic(string);
const strikethroughString = strikethrough(string);
const spoilerString = spoiler(string);
const quoteString = quote(string);
const blockquoteString = blockQuote(string);
const underscoreString = underscore(string);
```

### Links

There are also two methods to format hyperlinks. `hyperlink()` will format the URL into a masked markdown link and `hideLinkEmbed()` will wrap the URL in `<>`, preventing it from embedding.

```js {2,4-5}
const { hyperlink, hideLinkEmbed } = require('@discordjs/builders');
const url = 'https://discord.js.org/';

const link = hyperlink(url);
const hiddenembed = hideLinkEmbed(url);
```

### Codeblocks

You can use `inlineCode()` and `codeBlock()` to turn a string into an inline codeblock or a regular codeblock with or without syntax highlighting.

```js {2,4-6}
const { inlineCode, codeBlock } = require('@discordjs/builders');
const jsstring = 'const value = true;';

const inline = inlineCode(jsstring);
const codeblock = codeBlock(jsstring);
const highlighted = codeBlock('js', jsstring);
```

### Timestamps

With `time()` you can format UNIX timestamps and dates into a Discord timestring.

```js {2,4-5}
const { time } = require('@discordjs/builders');
const date = new Date();

const timeString = time(date);
const relative = time(date, 'R');
```

### Mentions

The Formatters also contain various methods to format Snowflakes into mentions.

```js {2,4-7}
const { userMention, membermention, channelMention, roleMention } = require('@discordjs/builders');
const id = '123456789012345678';

const user = userMention(id);
const nickname = memberMention(id);
const channel = channelMention(id);
const role = roleMention(id);
```

## Slash command builders

The slash command builders are a set of utility methods to quickly build slash commands without having to manually construct objects.

### Commands

First we'll build a simple slash command using the builder and save the raw data to a variable, which can then later be used to send the data to the Discord API.

```js
const { SlashCommandBuilder } = require('@discordjs/builders');

// Create a slash command builder
const command = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!');

// Get the raw data that can be sent to Discord
const rawData = command.toJSON();
```

### Options

This is a command with a user option.

```js {4-6}
const { SlashCommandBuilder } = require('@discordjs/builders');

const command = new SlashCommandBuilder()
	.setName('info')
	.setDescription('Get info about a user!')
	.addUserOption(option => option.setName('user').setDescription('The user'));

const rawData = command.toJSON();
```

### Subcommands

And this is a command containing two subcommands.

```js {6-14}
const { SlashCommandBuilder } = require('@discordjs/builders');

const command = new SlashCommandBuilder()
	.setName('info')
	.setDescription('Get info about a user or a server!')
	.addSubCommand(subCommand =>
		subCommand
			.setName('user')
			.setDescription('Info about a user')
			.addUserOption(option => option.setName('target').setDescription('The user')))
	.addSubCommand(subCommand =>
		subCommand
			.setName('server')
			.setDescription('Info about the server'));

const rawData = command.toJSON();
```
