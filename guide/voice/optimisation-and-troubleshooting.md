# Optimization and Troubleshooting

<branch version="11.x">

The discord.js voice system allows your bot to join voice channels and play audio. This guide will teach you how to make simple music bots and give you tips to optimize performance!

This voice guide targets discord.js v12, which features an improved audio system. Much of the example code in the voice guide is unsuitable for v11 and below–to access this content, please update discord.js to v12! 

</branch>
<branch version="12.x">

## Preparing your bot for debugging

If you're experiencing issues, you can listen to debug information from the client and any voice connections you have. Below is a rudimentary example of a logger, although you can adapt it to suit your needs. Storing these logs will help when troubleshooting any issues you may have.

This information will be beneficial if you need to report any issues with voice to our issue tracker.

```js
client.on('debug', console.log);

channel.join().then(connection => {
	connection.on('debug', console.log);
});
```

## Stuttering/choppy streams

Low-quality streams are likely due to a poor network connection or your machine not having enough resources to play audio smoothly. The following can identify the cause:

1. Audio playback is only choppy on a specific network or machine.
2. There is a high rate of packet loss (you can identify this by joining a voice channel in Discord, clicking the signal indicator, selecting your bot, and viewing the rate of packet loss).

Besides allocating more resources to your bot and having a better network connection, there are also a few techniques you can use to try and improve performance to make playback smoother:

## Solutions

### Using Ogg/WebM Opus Streams

#### From local files

Using Ogg/WebM Opus streams can significantly improve performance as it means runtime does not require an FFmpeg transcoder. If you're playing audio from static files, you can easily convert your files to Ogg Opus–this means the transcoder is run only once for the entire file when converting it, not every single time the file plays.

You can run the following command to convert your audio files to Ogg Opus, provided you've [installed FFmpeg](/voice/#installing-dependencies):

```bash
$ ffmpeg -i input.mp3 -c:a libopus -b:a 96k output.ogg
```

You can specify a higher bitrate instead of `96k` if your Discord server has a higher cap (e.g., VIP servers), but 96k will be the highest for most users.

You can also replace `input.mp3` with any media file with an audio channel.

Once you've got your `output.ogg` audio file, you can play it like so:

```js
const fs = require('fs');

connection.play(fs.createReadStream('output.ogg'), { type: 'ogg/opus' });
```

And that's it! discord.js will not create an FFmpeg transcoder for your file and will instead demux the Opus audio from it, significantly improving performance.

#### From YouTube videos

Many voice bots have the ability to play audio from YouTube videos in voice channels. YouTube itself provides WebM/Ogg streams for newer videos, which you can demux for Opus audio instead of running them through an FFmpeg transcoder first.

To do this, you can use the [`ytdl-core-discord`](https://github.com/amishshah/ytdl-core-discord) module. It will play WebM/Ogg Opus streams directly where possible and will fallback to FFmpeg for incompatible videos–this should help you achieve the best performance when using YouTube streams.

```js
const ytdl = require('ytdl-core-discord');

async function play(connection, url) {
	connection.play(await ytdl(url), { type: 'opus' });
}
```

::: tip
You might be wondering why the type is `opus` and not `webm/opus` or `ogg/opus`. Discord.js allows you to play Opus streams **without a container** operating in object-mode (i.e., each item pushed to the stream is a distinct Opus packet). `ytdl-core-discord` provides this type of stream, and so you must specify `opus` as the type.
:::

### Using `highWaterMark`

Another way to improve performance is through altering the `highWaterMark` property. This property describes how many Opus audio packets should be available to the stream at any given time.

The default value for this property is `12` - this equates to 240 ms of audio ready to play at any given time. You can adjust the property like so:

```js
// Have 50 audio packets ready (1 second of playback)
connection.play('file.mp3', { highWaterMark: 50 });
```

You can try increasing this property to improve choppy playback, but increasing it too much will mean that playback will take longer to start, and any volume changes will not take effect immediately. 

### Disabling Inline Volume

If you're not going to change your stream's volume in real-time, you can disable the volume transformer discord.js creates for you. You'll need to do this before playing the stream:

```js
// Disable volume transformer
connection.play(audioStream, { volume: false });
```

Once you've done this, you will **not** be able to change the volume of your StreamDispatcher.

This will not significantly impact performance but can still help you improve your bot's efficiency nevertheless.

</branch>
