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
npm install --save node-opus
```

If you get an error that says 'FFMPEG not found', this can be resolved by installing ffmpeg.

On Debian / Ubuntu:

```
sudo apt-get install ffmpeg
```

On Windows:

```
npm install ffmpeg-binaries --save
```

Additionally, there have been reports that playing audio in this way from the Ubuntu subsystem offered by Windows 10 does not work.

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

client.on('message', message => {
	const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|\\${prefix})\\s*`);
	if (!prefixRegex.test(message.content)) return;

	const [, matchedPrefix] = message.content.match(prefixRegex);
	const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
	const command = args.shift();

	if (command === 'ping') {
		message.channel.send('Pong!');
	} else if (command === 'prefix') {
		message.reply(`you can either ping me or use \`${prefix}\` as my prefix.`);
	}
});

client.login('your-token-goes-here');
```

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
	y: '🇾', z: '🇿', 0: '0⃣', 1: '1⃣',
	2: '2⃣', 3: '3⃣', 4: '4⃣', 5: '5⃣',
	6: '6⃣', 7: '7⃣', 8: '8⃣', 9: '9⃣',
	10: '🔟', '#': '#⃣', '*': '*⃣',
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

## Customizable Prefix
You can use this if some bot in your server has the same prefix.

::: tip
This one using the package named, `quick.db`. Quick.db is an open-sourced package meant to provide an easy way for beginners, and people of all levels to access & manage a database. All data is stored persistently, and comes with various extra features.
:::

To run this, you need to install the package first.
```npm install quick.db```

```js
// index.js (main file)

  var prefix = '!!'; // Your bot prefix.
  let fetched = await db.fetch(`prefix_${message.guild.id}`);
  if (fetched === null) prefix = '!!'; // If the server doesn't change your bot prefix before, turn this to your default prefix.
  else prefix = fetched; // If the server has changed your bot prefix before, turn this to the custom prefixes.
  
 // prefix.js (command file)
 
const Discord = require('discord.js') // Discord.js (11.4.2)
const db = require('quick.db') // Quick.db (7.0.0-b19)

exports.run = async (bot, message, args) => {

  let prefixes = args.join(' ')

  if (!message.member.hasPermission('MANAGE_GUILD')) { 
  	return message.channel.send(`You don't have a **Manage Server** permissions.`) 
  } // If the user doesn't have the required permissions.
  
  if (!preFIX) return message.channel.send(`Please supply the prefix/symbols.`) // If the user doesn't put any arguments/prefixes.

  db.set(`prefix_${message.guild.id}`, preFIX)
	message.channel.send(`${cute} Server Prefix has been changed to **\`${preFIX}\`**`); // Successful Message
}```
