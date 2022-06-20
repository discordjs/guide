# Voice Receive

Once you have established a [voice connection](./voice-connections.md), you can start receiving audio from users in the channel.

::: warning
If you are saving audio from users, make sure it abides by Discord's guidelines for saving end user data.
Your bot may be disabled if you save data without the user's consent.
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
const { EndBehaviorType } = require("@discordjs/voice");

connection.receiver.subscribe(userId, {
	end: {
		behavior: EndBehaviorType.AfterSilence,
		duration: 5000, // Ends 5000 ms after receiving silence or no audio packets. If the user begins talking again, the timer will be renewed.
	},
});

connection.receiver.subscribe(userId, {
	end: {
		behavior: EndBehaviorType.AfterInactivity,
		duration: 5000, // Ends 5000 ms after receiving no audio packets.
	},
});

connection.receiver.subscribe(userId, {
    end: {
        behavior: EndBehaviorType.Manual // Does not end until you end it manually
    },
});
```

## Using an Opus stream

You now have an Opus stream of a user speaking, but what does that even mean?
[Opus](https://www.opus-codec.org/) refers to how audio data is encoded, and all packets from Discord are sent encoded in Opus.
To save this in a sensical format, we have to decode the stream and re-encode it to an encoded format we like.

We can use `prism-media` to both decode our audio streams:

```js
const prism = require('prism-media');
const fs = require('fs');

const transcoder = new prism.opus.Decoder({
	rate: 48000,
	channels: 2,
	frameSize: 960,
});

const file = fs.createWriteStream('./saved-audio.pcm');

opusStream.pipe(transcoder).pipe(file);
```

And encode to a different codec:

```js
const prism = require('prism-media');
const fs = require('fs');

const oggStream = new prism.opus.OggLogicalBitstream({
	opusHead: new prism.opus.OpusHead({
		channelCount: 2,
		sampleRate: 48000,
	}),
	pageSizeControl: {
		maxPackets: 10,
	},
});

const outFile = fs.createWriteStream('./saved-audio.ogg');

opusStream.pipe(oggStream).pipe(outFile);
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

const resource = createAudioResource(opusStream, { inputType: SteamType.Opus });
audioPlayer.play(resource);
```

## Dynamically receiving audio

Subscribing to one user each time is a hassle, but you can subscribe when the receiver detects that a user is speaking dynamically:

```js
connection.receiver.speaking.on('start', userId => {
	const opusStream = connection.receiver.subscribe(userId, {
		subscribeOptions,
	});

	console.log(`User has started speaking!`);
});
```

::: warning
Be careful when handling this! Each time the user stops and start speaking that will begin another stream, this will not be prevented by having a high `duration` option in subscription options.
You should try to check if you are already subscribed to a user so that you don't begin recording twice and increasing memory usage
:::

It's worth noting that using `VoiceReceiver.speaking` also can return a map of the users currently speaking:

```js
if (connection.receiver.speaking.users.has(userId)) {
	// Do stuff
}
```
