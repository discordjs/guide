# Miscellaneous examples

::: tip
For more, even shorter code examples, check out [the common questions page](/popular-topics/common-questions.md)!
:::

## Play music from YouTube

Here's a short example of a command that connects to a voice channel, plays a song, and exits when it's done.

In order to run this, you'll need to have `ytdl-core` installed.

```
npm install --save ytdl-core
```

If you get an error that says 'OPUS_ENGINE_MISSING', you'll need to install one of the opus packages discord.js recommends.

```
npm install --save @discordjs/opus
```

If you get an error that says 'FFMPEG not found', this can be resolved by installing ffmpeg.

On Debian / Ubuntu:

```
sudo apt-get install ffmpeg
```

On Windows:

```
npm install ffmpeg-static --save
```

Additionally, there have been reports that playing audio in this way from the Ubuntu subsystem offered by Windows 10 does not work.

<branch version="11.x">

```js
const Discord = require('discord.js');
const ytdl = require('ytdl-core');

const client = new Discord.Client();

client.on('message', message => {
	if (message.content === '!play') {
		if (message.channel.type !== 'text') return;

		const { voiceChannel } = message.member;

		if (!voiceChannel) {
			return message.reply('please join a voice channel first!');
		}

		voiceChannel.join().then(connection => {
			const stream = ytdl('https://www.youtube.com/watch?v=D57Y1PruTlw', { filter: 'audioonly' });
			const dispatcher = connection.playStream(stream);

			dispatcher.on('end', () => voiceChannel.leave());
		});
	}
});

client.login('your-token-goes-here');
```

</branch>
<branch version="12.x">

```js
const Discord = require('discord.js');
const ytdl = require('ytdl-core');

const client = new Discord.Client();

client.on('message', message => {
	if (message.content === '!play') {
		if (message.channel.type !== 'text') return;

		const voiceChannel = message.member.voice.channel;

		if (!voiceChannel) {
			return message.reply('please join a voice channel first!');
		}

		voiceChannel.join().then(connection => {
			const stream = ytdl('https://www.youtube.com/watch?v=D57Y1PruTlw', { filter: 'audioonly' });
			const dispatcher = connection.play(stream);

			dispatcher.on('finish', () => voiceChannel.leave());
		});
	}
});

client.login('your-token-goes-here');
```

</branch>

## Catching UnhandledPromiseRejectionWarnings

If you've ever seen something labeled as `UnhandledPromiseRejectionWarnings` in your console, the reason of occurrence can be vague sometimes. In addition to that, not handling promise rejections is currently deprecated and will eventually be removed. Once that happens, any unhandled promise rejections will close your app with a non-zero exit code.

You can use a single line of code to prevent that, though. This will also display the line number of where the error occurred.

```js
process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));
```

## Mention prefix

When a user adds your bot to their server, they may not immediately know what the prefix is. This is why it's a good idea to allow your bot to be triggered by either a set prefix, or by pinging them. In addition, it's also a good idea to have a command that displays the available prefixes.

```js
const Discord = require('discord.js');

const client = new Discord.Client();
const prefix = '!';

const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

client.on('message', message => {
	const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
	if (!prefixRegex.test(message.content)) return;

	const [, matchedPrefix] = message.content.match(prefixRegex);
	const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'ping') {
		message.channel.send('Pong!');
	} else if (command === 'prefix') {
		message.reply(`you can either ping me or use \`${prefix}\` as my prefix.`);
	}
});

client.login('your-token-goes-here');
```

::: tip
The `escapeRegex` function is used to convert special characters into literal characters by escaping them, so that they don't terminate the pattern within the [Regular Expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)!
:::

::: tip
If you aren't familiar with the syntax used on the `const [, matchedPrefix] = ...` line, that's called "array destructuring". Feel free to read more about it in the [ES6 syntax](/additional-info/es6-syntax.md#array-destructuring) guide!
:::

## Emoji characters

If you've tried using [the usual method of retrieving unicode emojis](/popular-topics/reactions.md#unicode-emojis), you may have noticed that some characters don't provide the expected results. Here's a short snippet that'll help with that issue. You can toss this into a file of its own and use it anywhere you need!

```js
// emojiCharacters.js
module.exports = {
	a: '🇦', b: '🇧', c: '🇨', d: '🇩',
	e: '🇪', f: '🇫', g: '🇬', h: '🇭',
	i: '🇮', j: '🇯', k: '🇰', l: '🇱',
	m: '🇲', n: '🇳', o: '🇴', p: '🇵',
	q: '🇶', r: '🇷', s: '🇸', t: '🇹',
	u: '🇺', v: '🇻', w: '🇼', x: '🇽',
	y: '🇾', z: '🇿', 0: '0️⃣', 1: '1️⃣',
	2: '2️⃣', 3: '3️⃣', 4: '4️⃣', 5: '5️⃣',
	6: '6️⃣', 7: '7️⃣', 8: '8️⃣', 9: '9️⃣',
	10: '🔟', '#': '#️⃣', '*': '*️⃣',
	'!': '❗', '?': '❓',
};
```

<!-- eslint-skip -->

```js
// index.js
const emojiCharacters = require('./emojiCharacters');

console.log(emojiCharacters.a); // 🇦
console.log(emojiCharacters[10]); // 🔟
console.log(emojiCharacters['!']); // ❗
```

::: tip
On Windows, you may be able to use the `Win + .` keyboard shortcut to open up an emoji picker can be used for quick, easy access to all the unicode emojis available to you. Some of the emojis listed above may not be there, though (e.g the 0-9 emojis).
:::
