# Receiving Audio

<branch version="11.x">

The Discord.js voice system allows your bot to join voice channels and play audio. This guide will teach you how to make simple music bots, and tips and tricks to optimize performance!

This voice guide is written for Discord.js v12, which features an improved audio system. Much of the example code in the voice guide is unsuitable for v11 and below - to access this content, please update Discord.js to v12! 

</branch>
<branch version="12.x">

::: warning
Discord does not officially support Discord bots receiving audio ([see here](https://github.com/discord/discord-api-docs/issues/808)), so there may be some breakages. However, Discord.js aims to reasonably support this feature.
:::

## Basic Usage

In addition to sending audio over voice connections, you can also receive audio (i.e. listen to other users and bots in a voice channel) using Discord.js.

The example below will listen to a user until they stop speaking, and all the audio received from that user is decoded from Opus to signed 16-bit little-endian (s16le) PCM and stored in a file called `user_audio`.

```js
const fs = require('fs');

// Create a ReadableStream of s16le PCM audio
const audio = connection.receiver.createStream(user, { mode: 'pcm' });

audio.pipe(fs.createWriteStream('user_audio'));
```

The `mode` option defaults to `'opus'` and can alternatively be specified as `'pcm'`. When `'opus'` is specified, Discord.js will not attempt to decode each received Opus packet. The stream created in this case will be a ReadableStream of Opus packets.

With `'pcm'` specified, Discord.js will attempt to decode each received Opus packet into PCM, giving you a stream of raw audio that can be processed by other applications.

Additionally, the `end` option can be specified. It defaults to `'silence'`, which ends the ReadableStream once the user stops talking. It can also be set to `'manual'`, which means the stream doesn't end until you end it yourself. Note that Discord.js will not interpolate silence into gaps in the audio (where the user has stopped speaking), this is something you will have to do yourself.

::: tip
To work with PCM audio, you could use software such as [Audacity.](https://www.audacityteam.org/) To import the audio into Audacity, open **File > Import > Raw Data...** and then select your audio file. You should select **Signed 16-bit PCM** as the encoding, a **Little-endian** byte order, **2 Channels (Stereo)** and a sample rate of **48000Hz**. 
:::

## Advanced Usage

You can do a number of things with this audio:

- Process the audio with a voice recognition system to provide another interface of interaction to your bot.
- An audio recording bot allowing users to store audio and play it back at a later date.
- A bot that relays audio from one voice connection to another.
	```js
	const audio = connectionA.receiver.createStream('User ID');
	connectionB.play(audio, { type: 'opus' });
	```

### What if I want to listen to a user indefinitely?

By default, Discord.js selects the `'silence'` mode when creating a receiver stream. This means that once a user stops speaking, the receiver stream ends and will not restart if they start speaking again.

You can select the `'manual'` mode to keep the stream alive indefinitely and end it yourself when you choose to. Note that Discord.js won't interpolate any silence into the stream at the times when the user is silent - i.e. the gaps in the user's speech aren't present in the receiver stream.

### What if I want to listen to multiple users?

You can create a stream for each user. You cannot, however, create a single stream that will interpolate audio from multiple users in a channel - this is currently out of the scope of Discord.js.

</branch>
