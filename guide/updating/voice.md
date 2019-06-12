---
forceTheme: red
---

# New Voice system

## General changes

:::warning
Codeblocks will be used to display the old methods vs the newer ones—the red being what's been removed and the green being its replacement. Some bits may have more than one way of being handled. Regular JavaScript syntax codeblocks will be used to display the additions. 
:::

v12 has a new voice system that improves stability but also comes with some changes to playing audio:

```diff
# Applies to VoiceConnection and VoiceBroadcast
- connection.playFile('file.mp3')
+ connection.play('file.mp3')

- connection.playStream(stream)
+ connection.play(stream)

- connection.playArbitraryInput(input)
+ connection.play(input)

- connection.playBroadcast(broadcast)
+ connection.play(broadcast)

- connection.playOpusStream(stream)
+ connection.play(stream, { type: 'opus' })

- connection.playConvertedStream(stream)
+ connection.play(stream, { type: 'converted' })
```

You can now also play Ogg Opus files or WebM Opus files directly without the need for FFmpeg in v12:

```js
connection.play(fs.createReadStream('file.ogg'), { type: 'ogg/opus' });
connection.play(fs.createReadStream('file.webm'), { type: 'webm/opus' });
```

It is also possible to define initial values for `plp`, `fec` and `bitrate` when playing a stream. Minus bitrate, these are new configurable options in v12 that can help when playing audio on unstable network connections.

```diff
- connection.playStream(stream).setBitrate(96)
+ connection.play(stream, { bitrate: 96 })
```

If you don't want to alter the volume of a stream while you're playing it, you can disable volume to improve performance. This cannot be reverted during playback.

```js
connection.play(stream, { volume: false });
```

The internal voice system in v12 now uses streams where possible, and as such StreamDispatcher itself is now a WritableStream. It also comes with new changes:

```diff
- dispatcher.end()
+ dispatcher.destroy()

- dispatcher.on('end', handler)
+ dispatcher.on('finish', handler)
```

You can manually control how many audio packets should be queued before playing audio for more consistent playback using the `highWaterMark` option (defaults to 12)
```js
connection.play(stream, { highWaterMark: 512 });
```

If you're frequently pausing/resuming an audio stream, you can enable playing silence packets while paused to prevent audio glitches on the Discord client
```js
// Passing true plays silence
dispatcher.pause(true);
```

## Broadcasts

#### Broadcasts

Broadcasts themselves now contain a `BroadcastDispatcher` that shares a similar interface to the `StreamDispatcher` and can be used to control the playback of an audio stream.

```diff
- client.createVoiceBroadcast()
+ client.voice.createBroadcast()

- broadcast.dispatchers
+ broadcast.subscribers
```
