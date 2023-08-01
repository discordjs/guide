# Seek

discord.js does not have a built-in method for seeking audio resources. However external libraries such as `prism-media` can be used to tackle this issue.

```js
const { createAudioResource } = require('@discordjs/voice');

const resource = createAudioResource();

resource.seek(1000); // This will be an error!
```

But some packages provide seek options with these solutions.

## Cheat sheet

Methods

1. Play audio
2. Create seeked resource
3. Play the seeked audio resource

Yo, this should be easy, right?

### Creation

First, to seek resource, you have to create new function like this:

```js
// Require necessary package
const prism = require('prism-media');


// stream -> should be audio stream
// seek -> should be int that within duration of the stream
function createFFmpegStream(stream, seek) {
	let seekPosition = '0';
	if (seek) seekPosition = String(seek);
	const transcoder = new prism.FFmpeg({
		args: [
			'-analyzeduration', '0',
			'-loglevel', '0',
			'-f', 's16le',
			'-ar', '48000',
			'-ac', '2',
			'-ss', seekPosition,
			'-ab', '320',
		],
	});
	const s16le = stream.pipe(transcoder);
	const opus = s16le.pipe(new prism.opus.Encoder({ rate: 48000, channels: 2, frameSize: 960 }));
	return opus; // Return seeked stream
}
```
This function will return seeked stream. If you want to change audio quality, you have to edit this:
```
'-ab', '320',
```
320 to something you want.
320 means 320Kbps.

### Complete Code

```js
const { createAudioResource, createAudioPlayer } = require('@discordjs/voice');
const fs = require('fs');

const player = createAudioPlayer();
const normalAudioResource = createAudioResource('Your audio file path');

player.play(normalAudioResource);

const seekedAudioStream = createFFmpegStream(fs.createReadStream('Your audio file path'), 10); // Seek to 10s
const seekedAudioResource = createAudioResource(seekedAudioStream);

player.play(seekedAudioResource);
```

The first argument of the `createFFmpegStream` method would be your stream.
