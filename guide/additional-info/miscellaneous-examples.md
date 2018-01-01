# Miscellaneous examples

<p class="tip">For more, even shorter code examples, check out [the common questions page](/creating-your-bot/common-questions)!</p>

### Play music from YouTube

Here's a short example of a command that connects to a voice channel, plays a song, and exits when it's done. You'll need to install the `ytdl-code` package in order to run this.

```
npm install --save ytdl-core
```

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

### Catching UnhandledPromiseRejectionWarnings

If you've ever seen something labled as `UnhandledPromiseRejectionWarnings` in your console, the reason of occurrence can be vague sometimes. In addition to that, not handling promise rejections is currently deprecated and will eventually be removed. Once that happens, any unhandled promise rejections will close your app with a non-zero exit code.

You can use a single line of code to prevent that, though. This will also display the line number of where the error occured.

```js
process.on('unhandledRejection', error => console.error(`Uncaught Promise Error:\n${error.stack}`));
```

### Sending an embed

#### RichEmbed builder

```js
// somewhere at the top of your file
const Discord = require('discord.js');

// somewhere inside a command, an event, etc.
const exampleEmbed = new Discord.RichEmbed()
	.setColor('#0099ff')
	.setTitle('Some title')
	.setURL('https://discord.js.org/')
	.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
	.setDescription('Some description here')
	.setThumbnail('https://i.imgur.com/wSTFkRM.png')
	.addField('Regular field title', 'Some value here')
	.addBlankField()
	.addField('Inline field title', 'Some value here', true)
	.addField('Inline field title', 'Some value here', true)
	.addField('Inline field title', 'Some value here', true)
	.setImage('https://i.imgur.com/wSTFkRM.png')
	.setTimestamp()
	.setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

message.channel.send({ embed: exampleEmbed });
```

##### RichEmbed builder notes

* If you're on discord.js v11.2 or above, you can simply do `message.channel.send(exampleEmbed)`.
* For `.setColor()`, it accepts a base 10 integer, HEX color as a string, or an array of RGB values.
* There are also specific strings you can use with `.setColor()`, e.g. `DARK_RED` or `RANDOM`. A list of them can be found [here](https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable).
* `.addBlankField()` is just shorthand for `.addField('\u200b', '\u200b')`. If you want to make it inline as well, pass in `true` as the first argument.
* If you're on the master branch/v12, you'll need to use `Discord.MessageEmbed()`, not `Discord.RichEmbed()`.

#### Embed object

```js
message.channel.send({
	embed: {
		color: 0x0099ff,
		title: 'Some title',
		url: 'https://discord.js.org',
		author: {
			name: 'Some name',
			icon_url: 'https://i.imgur.com/wSTFkRM.png',
			url: 'https://discord.js.org',
		},
		description: 'Some description here',
		thumbnail: {
			url: 'https://i.imgur.com/wSTFkRM.png',
		},
		fields: [
			{
				name: 'Regular field title',
				value: 'Some value here',
			},
			{
				name: '\u200b',
				value: '\u200b',
			},
			{
				name: 'Inline field title',
				value: 'Some value here',
				inline: true,
			},
			{
				name: 'Inline field title',
				value: 'Some value here',
				inline: true,
			},
			{
				name: 'Inline field title',
				value: 'Some value here',
				inline: true,
			},
		],
		image: {
			url: 'https://i.imgur.com/wSTFkRM.png',
		},
		timestamp: new Date(),
		footer: {
			text: 'Some footer text here',
			icon_url: 'https://i.imgur.com/wSTFkRM.png',
		},
	},
});
```

##### Embed object notes

* The `color` field **must** be a base 10 integer. If you have a hex color (e.g. `#0099ff`), you can replace the `#` with `0x` and use that (as a number).

#### General embed notes

* You can have a maximum of 25 fields.
* You can have a maximum of 6,000 characters (combined amount between all areas).
* There are set limits for each embed area. Refer to (this Discord API docs page](https://discordapp.com/developers/docs/resources/channel#embed-limits) to view them.
* You need at least two consecutive fields set to `inline` in order for them to display correctly.
* If you have a thumbnail set, a maximum of 2 fields will be displayed inlined, as opposed to the default 3.
* If you use the `.setTimestamp()` or `timestamp` field, the timestamp will automatically adjust the timezone depending on the user's device.

#### Embed preview

Here's what the embed from code above would look like:

![Embed preview](/assets/img/ooaOAeu.png)

<p class="tip">If you want to instantly preview what your embed will look like, check out [this site](https://leovoel.github.io/embed-visualizer/)!</p>
