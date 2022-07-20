# Voice Receive

Once you have established a [voice connection](./voice-connections.md), you can start receiving audio from users in the channel.

::: warning
If you are saving audio from users, make sure it abides by Discord's guidelines for saving end user data.
Your bot may be disabled if you save data without the user's consent, and it may be illegal in some areas.
:::

## Subscribing to users

To receive an Opus stream of a user speaking, you must first subscribe to the connection's audio receiver:

```js
const opusStream = connection.receiver.subscribe(userId);
```

The voice connection will now send any voice packets received from a user with `userId` to the `opusStream`

### EndBehavior

Depending on your use-case, you can choose to end when the stream stops receiving audio differently:

```js
const { EndBehaviorType } = require('@discordjs/voice');

connection.receiver.subscribe(userId, {
	end: {
		behavior: EndBehaviorType.AfterSilence, /* Ends in 'duration' ms after receiving no silence or audio packets
		behavior: EndBehaviorType.AfterInactivity, Ends in 'duration' ms after receiving no audio packets
		behavior: EndBehaviorType.Manual, Ends manually and 'duration' is not accepted */
		duration: 5000,
	},
});
```

## Using an Opus stream

You now have an Opus stream of a user speaking, but what does that even mean?
[Opus](https://www.opus-codec.org/) refers to how audio data is encoded, and all packets from Discord are sent encoded in Opus.
To save this in a sensical format, we have to decode the stream and re-encode it to an encoded format we like.

We can use `prism-media` to decode our audio streams to pcm:

```js
const prism = require('prism-media');
const fs = require('fs');

const transcoder = new prism.opus.Decoder({
	rate: 48_000,
	channels: 2,
	frameSize: 960,
});

const file = fs.createWriteStream('./saved-audio.pcm');

opusStream.pipe(transcoder).pipe(file);
```

:::tip
`prism-media` relies on having an [Opus encoding library](./README.md#extra-dependencies) installed.
:::

## Sending an Opus stream

Since Discord both sends and receives Opus encoded audio, sending is easy:

```js
const {
	createAudioPlayer,
	createAudioResource,
	EndBehaviorType,
	StreamType,
} = require('@discordjs/voice');

const opusStream = connection.receiver.subscribe(userId, {
	end: {
		behavior: EndBehaviorType.AfterSilence,
		duration: 500,
	},
});

const audioPlayer = createAudioPlayer();
connection.subscribe(audioPlayer);

const resource = createAudioResource(opusStream, { inputType: StreamType.Opus });
audioPlayer.play(resource);
```

## Dynamically receiving audio

Subscribing to one user each time is a hassle, but you can subscribe when the receiver detects that a user is speaking dynamically:

```js
connection.receiver.speaking.on('start', userId => {
	const opusStream = connection.receiver.subscribe(userId, {
		subscribeOptions,
	});

	console.log('User has started speaking!');
});
```

::: warning
Be careful when handling this! Each time the user stops and start speaking that will begin another stream, this will not be prevented by having a high `duration` option in subscription options.
You should try to check if you are already subscribed to a user so that you don't begin recording twice and increasing memory usage
:::

# Advanced Usage

`prism-media` also exports `ffmpeg` if users would like to decode or encode their audio in an advanced way.
All of the flags usable by ffmpeg are usable by this object. Here are some use-cases and examples for using ffmpeg.

::: tip
`prism-media` automatically assumes that you are going to pipe an input if you do not explicitly provide an input flag (`-i`)
::: 

## Seeking Time in an Audio Resource

Pipe audio from a file into an ffmpeg transcoder with the seek argument in order to have it begin at a specified time.

```js
const { createReadStream } = require('node:fs');
const { createAudioResource } = require('@discordjs/voice');
const prism = require('prism-media');

const input = createReadStream('./audio.mp3');
const transcoder = new prism.FFmpeg({
	args: [
		// Required for the Discord standard for audio packets
		'-ar', '48000',
		'-ac', '2',
		'-f', 's16le',
		// The audio begin at 25 seconds
		'-ss', '00:00:25',
	],
});

const opusStream = input.pipe(transcoder).pipe(new prism.opus.Encoder({ rate: 48_000, channels: 2, frameSize: 960 }));

const resource = createAudioResource(opusStream, { inputType: StreamType.Opus });
```

## PCM to Ogg & Ogg to PCM

```js
const prism = require('prism-media');
const fs = require('node:fs');

fs.createReadStream('./audio.pcm')
	.pipe(new prism.opus.Encoder())
	.pipe(fs.createWriteStream('./audio.ogg'));

fs.createReadStream('./audio.ogg')
	.pipe(new prism.opus.OggDemuxer())
	.pipe(new prism.opus.Decoder())
	.pipe(fs.createWriteStream('./audio.pcm'));
```
If you're looking to do something different with ffmpeg, try beginning at the [ffmpeg documentation](https://ffmpeg.org/ffmpeg.html).