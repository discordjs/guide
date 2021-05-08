# The Basics

<branch version="11.x">

The discord.js voice system allows your bot to join voice channels and play audio. This guide will teach you how to make simple music bots and give you tips to optimize performance!

This voice guide targets discord.js v12, which features an improved audio system. Much of the example code in the voice guide is unsuitable for v11 and below–to access this content, please update discord.js to v12! 

</branch>
<branch version="12.x">

Now that you have your dependencies installed, you can start using voice!

## Joining voice channels

Joining a voice channel is easy; here's a common example:

```js
client.on('message', async message => {
	// Join the same voice channel of the author of the message
	if (message.member.voice.channel) {
		const connection = await message.member.voice.channel.join();
	}
});
```

If you try to join a channel the bot is already in, nothing will happen, so you don't need to run this method repeatedly.

::: tip
In the above example, a `VoiceState` is accessed through `member.voice`. Voice states include information about the channel the member is connected to (if any), if the member is speaking and whether they're deafened or muted. Consult  <docs-link path="class/VoiceState">the documentation</docs-link> for a full description of what voice states can do!
:::

## Playing audio

Playing audio is also simple. A `StreamDispatcher` is created for you to control and monitor the playback of your audio over the voice channel.

A VoiceConnection can only ever have at most one dispatcher. Attempting to play another stream while audio is already playing will destroy the existing stream, and the new audio will begin to play shortly after.

```js
// Create a dispatcher
const dispatcher = connection.play('audio.mp3');

dispatcher.on('start', () => {
	console.log('audio.mp3 is now playing!');
});

dispatcher.on('finish', () => {
	console.log('audio.mp3 has finished playing!');
});

// Always remember to handle errors appropriately!
dispatcher.on('error', console.error);
```

To end the stream yourself, you can run:

```js
dispatcher.destroy();
```

You can also create the dispatcher with options. The following example will play a stream at 50% volume from the start.

```js
connection.play('audio.mp3', { volume: 0.5 });
```

### Which audio sources can I use?

#### FFmpeg

In the example shown above, you can play a file from its path. This is an example of using FFmpeg to play a file. You can also pass a `ReadableStream` (or path) of most media files, e.g., mp3, mkv, mp4, and the file will play. You can even play from URLs!

```js
const fs = require('fs');

// From a path
connection.play('audio.mp3');
// From a ReadableStream
connection.play(fs.createReadStream('audio.mp3'));
// From a URL
connection.play('http://myserver.com/audio.aac');
```

You can consult the [FFmpeg Protocols](https://www.ffmpeg.org/ffmpeg-protocols.html#Protocols) documentation for a full list of resources you can play with FFmpeg.

#### WebM/Ogg Opus Files

WebM/Ogg Opus files already contain Opus audio; this means you do not require FFmpeg to convert the file. This is efficient and using these files where possible will improve the performance of your bot.

To play these files, you'll need to have a ReadableStream of the file and you'll need to specify the type of file when playing:

```js
const fs = require('fs');
// Play a WebM Opus stream
connection.play(fs.createReadStream('audio.webm'), { type: 'webm/opus' });
// Play an Ogg Opus stream
connection.play(fs.createReadStream('audio.ogg'), { type: 'ogg/opus' });
```

::: tip
You may be wondering why the source `type` is specified in this example if it wasn't in the FFmpeg one. discord.js will default to the `'unknown'` (i.e., "use FFmpeg") type when no type is provided.
:::

## Controlling the Stream Dispatcher

You can pause, resume, and alter the volume of a stream dispatcher in real-time.

```js
dispatcher.pause();
dispatcher.resume();
// Set the volume to 25%
dispatcher.setVolume(0.25);
```

::: tip
In cases where you'll be pausing/resuming a stream rapidly, you can use the _"play silence"_ mode to prevent audio glitches occurring in the Discord client. To opt-in to this mode, pass `true` to the pause method:
```js
// Play silent packets while paused
dispatcher.pause(true);
```
:::

## Leaving voice channels

Leaving a voice channel will destroy the current dispatcher (if there is one) and the voice connection.

```js
// Option 1
connection.disconnect();

// Option 2
voiceChannel.leave();
```

</branch>
