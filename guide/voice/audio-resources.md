---
forceTheme: purple
---

# Audio Resources

Audio resources contain audio that can be played by an audio player to voice connections.

## Cheat sheet

### Creation

There are many ways to create an audio resource. Below are some example scenarios:

```ts
const { createAudioResource, StreamType } = require('@discordjs/voice');
const { createReadStream } = require('fs');
const { join } = require('path');

// Basic, default options are:
// Input type is unknown, so will use FFmpeg to convert to Opus under-the-hood
// Inline volume is opt-in to improve performance
let resource = createAudioResource(join(__dirname, 'file.mp3'));

// Will use FFmpeg with volume control enabled
resource = createAudioResource(join(__dirname, 'file.mp3'), { inlineVolume: true });
resource.volume.setVolume(0.5);

// Will play .ogg or .webm Opus files without FFmpeg for better performance
// Remember, inline volume is still disabled
resource = createAudioResource(createReadStream(join(__dirname, 'file.ogg'), {
	inputType: StreamType.OggOpus
}));

// Will play with FFmpeg due to inline volume being enabled.
resource = createAudioResource(createReadStream(join(__dirname, 'file.webm'), {
	inputType: StreamType.WebmOpus,
	inlineVolume: true
}));

player.play(resource);
```

### Deletion

The underlying streams of an audio resource are destroyed and flushed once an audio player is done playing their audio. Make sure to remove any references you've created to the resource to prevent memory leaks.

## Handling errors

For most scenarios, you will create an audio resource for immediate use by an audio player. This means that the audio player will propagate errors from the resource for you, so you can attach `error` handlers to the player instead of the resource.

However, it is still recommended to attach `error` handlers to the resource's `playStream`. In the event that you create your stream a little earlier than it is actually played, errors could still arise.

:::warning
Altering the state of an audio player from an audio resource error handler is **not** recommended. Your state changes may be reverted by the audio player's underlying error handler. State changes should only come from an audio player's error handler.
:::

A good solution for handling errors from these resources is to simply apply a `noop` handler to them. As long as you are listening for errors from your audio player, this is acceptable. This makes the assumption that you do not care about errors emitted from resources that aren't being consumed by an audio player.

## Optimizations

To improve performance, you can consider the following methods. They reduce the computational demand required to play audio, and could help to reduce jitter in the audio stream.

### Not using inline volume

By default, inline volume is disabled for performance reasons. Enabling it will allow you to modify the volume of your stream in realtime. This comes at a performance cost, even if you aren't actually modifying the volume of your stream.

Make sure you consider whether it is worth enabling for your use case.

### Playing Opus streams

If you are repeatedly playing the same resource, you may consider converting it to Ogg opus or WebM opus. Alternatively, if you are fetching an external resource and are able to specify a format that you'd like to stream the resource in, you should consider specifying Ogg opus or WebM opus.

The reason for this is that you can remove FFmpeg from the process of streaming audio. FFmpeg is used to convert unknown inputs into Opus audio which can be streamed to Discord. If your audio is already in the Opus format, this removes one of the most computationally demanding parts of the audio pipeline from the streaming process, which would surely improve performance.

Both of the examples below will skip the FFmpeg component of the pipeline to improve performance.

```ts
const { createAudioResource, StreamType } = require('@discordjs/voice');
const { createReadStream } = require('fs');

let resource = createAudioResource(createReadStream('my_file.ogg'), {
	inputType: StreamType.OggOpus
});

resource = createAudioResource(createReadStream('my_file.webm'), {
	inputType: StreamType.WebmOpus
});
```

:::warning
This optimization is useful if you do not want to use inline volume. Enabling inline volume will disable the optimization.
:::
