# Formatters

discord.js provides the <PackageLink name="formatters" /> package which contains a variety of utilities you can use when writing your Discord bot.

## Basic Markdown

These functions format strings into all the different Markdown styles supported by Discord.

```js
const { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote } = require('discord.js');
const string = 'Hello!';

const boldString = bold(string);
const italicString = italic(string);
const strikethroughString = strikethrough(string);
const underscoreString = underscore(string);
const spoilerString = spoiler(string);
const quoteString = quote(string);
const blockquoteString = blockQuote(string);
```

## Links

There are also two functions to format hyperlinks. `hyperlink()` will format the URL into a masked markdown link, and `hideLinkEmbed()` will wrap the URL in `<>`, preventing it from embedding.

```js
const { hyperlink, hideLinkEmbed } = require('discord.js');
const url = 'https://discord.js.org/';

const link = hyperlink('discord.js', url);
const hiddenEmbed = hideLinkEmbed(url);
```

## Code blocks

You can use `inlineCode()` and `codeBlock()` to turn a string into an inline code block or a regular code block with or without syntax highlighting.

```js
const { inlineCode, codeBlock } = require('discord.js');
const jsString = 'const value = true;';

const inline = inlineCode(jsString);
const codeblock = codeBlock(jsString);
const highlighted = codeBlock('js', jsString);
```

## Timestamps

With `time()`, you can format Unix timestamps and dates into a Discord time string.

```js
const { time } = require('discord.js');
const date = new Date();

const timeString = time(date);
const relative = time(date, 'R');
```

## Mentions

`userMention()`, `channelMention()`, and `roleMention()` all exist to format Snowflakes into mentions.

```js
const { channelMention, roleMention, userMention } = require('discord.js');
const id = '123456789012345678';

const channel = channelMention(id);
const role = roleMention(id);
const user = userMention(id);
```
