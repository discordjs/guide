# Builders

discord.js provides the [`@discordjs/builders`](https://github.com/discordjs/builders) package which contains a variety of utilities you can use when writing your Discord bot.
To install the package, run `npm install @discordjs/builders` in your terminal.

## Formatters

Formatters are a set of utility functions that format input strings into the given format.

### Basic Markdown

The Formatters provide functions to format strings into all the different Markdown styles supported by Discord.

```js
const { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote } = require('@discordjs/builders');
const string = 'Hello!';

const boldString = bold(string);
const italicString = italic(string);
const strikethroughString = strikethrough(string);
const underscoreString = underscore(string);
const spoilerString = spoiler(string);
const quoteString = quote(string);
const blockquoteString = blockQuote(string);
```

### Links

There are also two methods to format hyperlinks. `hyperlink()` will format the URL into a masked markdown link, and `hideLinkEmbed()` will wrap the URL in `<>`, preventing it from embedding.

```js
const { hyperlink, hideLinkEmbed } = require('@discordjs/builders');
const url = 'https://discord.js.org/';

const link = hyperlink(url);
const hiddenEmbed = hideLinkEmbed(url);
```

### Code blocks

You can use `inlineCode()` and `codeBlock()` to turn a string into an inline code block or a regular code block with or without syntax highlighting.

```js
const { inlineCode, codeBlock } = require('@discordjs/builders');
const jsString = 'const value = true;';

const inline = inlineCode(jsString);
const codeblock = codeBlock(jsString);
const highlighted = codeBlock('js', jsString);
```

### Timestamps

With `time()`, you can format UNIX timestamps and dates into a Discord time string.

```js
const { time } = require('@discordjs/builders');
const date = new Date();

const timeString = time(date);
const relative = time(date, 'R');
```

### Mentions

The Formatters also contain various methods to format Snowflakes into mentions.

```js
const { userMention, memberMention, channelMention, roleMention } = require('@discordjs/builders');
const id = '123456789012345678';

const user = userMention(id);
const nickname = memberMention(id);
const channel = channelMention(id);
const role = roleMention(id);
```

## Slash command builders

The slash command builder is a utility class to build slash commands without having to manually construct objects.

### Commands

Here's a simple slash command using the builder. You can collect your commands data and use it to register slash commands.

```js
const { SlashCommandBuilder } = require('@discordjs/builders');

const command = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!');

// Raw data that can be used to register a slash command
const rawData = command.toJSON();
```

### Options

This is a command with a user option.

```js {4}
const command = new SlashCommandBuilder()
	.setName('info')
	.setDescription('Get info about a user!')
	.addUserOption(option => option.setName('user').setDescription('The user'));
```

### Subcommands

This is a command containing two subcommands.

```js {4-12}
const command = new SlashCommandBuilder()
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
