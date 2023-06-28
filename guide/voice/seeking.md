# Seek

Currently, there's no way to seek audio resources with raw discord.js such as:

```js
const resource = createAudioResource();

resource.seek(1000); // This will be error!
```

But some packages provide seek options with these solutions.

## Cheat sheet

Methods

1. Play audio
2. Create seeked resource
3. Play the seeked audio resource

Yo, this should be easy, right?

::: warning
Make sure you have installed 

prism-media
:::

### Creation

First, to seek resource, you have to create new function like this:

```js
//Require necessary package
const prism = require("prism-media");


//stream -> should be audio stream 
//seek -> should be int that within duration of the stream
function createFFmpegStream(stream, seek) {
	const seekPosition = String(seek);
	const transcoder = new prism.FFmpeg({
		args: [
			'-analyzeduration', '0',
			'-loglevel', '0',
			'-f', 's16le',
			'-ar', '48000',
			'-ac', '2',
			'-ss', seekPosition || '0',
			'-ab', '320',
		]
	});
	const s16le = stream.pipe(transcoder);
	const opus = s16le.pipe(new prism.opus.Encoder({ rate: 48000, channels: 2, frameSize: 960 }));
	return opus; //Return seeked stream
}
```
This function will return seeked stream. If you want to change audio quality, you have to edit this:
```js
'-ab', '320',
```
320 to something you want.
320 means 320Kbps.

### Real installation

```js
const { createAudioResource, createAudioPlayer } = require("@discordjs/voice");
const fs = require("fs");

const player = createAudioPlayer();
const normalAudioResource = createAudioResource("Your audio file path");

player.play(normalAudioResource);

const seekedAudioStream = createFFmpegStream(fs.createReadStream("Your audio file path"), 10); //Seek to 10s
const seekedAudioResource = createAudioResource(seekedAudioStream);

player.play(seekedAudioResource);
```

You can use other stream for createFFmpegStream() first argument.
