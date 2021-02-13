# Audio Player

Audio players can be used to play audio across voice connections. A single audio player can play the same audio over multiple voice connections.

## Cheat sheet

### Creation

Creating an audio player is simple:

```ts
import { createAudioPlayer } from '@discordjs/voice';

const player = createAudioPlayer();
```

You can also customise the behaviors of an audio player. For example, the default behavior is to pause when there are no active subscribers for an audio player. This behavior can be configured to either pause, stop, or just continue playing through the stream:

```ts
import { createAudioPlayer, NoSubscriberBehaviour } from '@discordjs/voice';

const player = createAudioPlayer({
	behaviours: {
		noSubscriber: NoSubscriberBehaviour.Pause,
	},
});
```

### Deletion

If you no longer require an audio player, you can `stop()` it and then remove references to it so that it gets garbage collected.

```ts
connection.stop();
// Make sure that you don't hold any references to the
// connection to ensure it gets removed from memory
```

### Playing audio

You can create [audio resources](./audio-resources) and then play them on an audio player.

```ts
const resource = createAudioResource('/home/user/track.mp3');
player.play(resource);

// Play "track.mp3" across two voice connections
connection1.subscribe(player);
connection2.subscribe(player);
```

::: warning
**Audio players can play one audio resource at most.** If you try to play another audio resource while one is already playing on the same player, the existing one is destroyed and replaced with the new one.
:::

### Pausing/unpausing

You can call the `pause()` and `unpause()` methods. While the audio player is paused, no audio will be played. When it is resumed, it will continue where it left off.

```ts
connection.pause();

// Unpause after 5 seconds
setTimeout(() => connection.unpause(), 5_000);
```

## Life cycle

Voice connections have their own life cycle, with 5 distinct states. You can follow the methods discussed in the [life cycles](./life-cycles) section to subscribe to changes to voice connections.

- **Idle** - this is the initial state of an audio player. The audio player will be in this state when there is no audio resource for it to play.

- **Bufferring** - this is the state an audio player will be in while it is waiting for an audio resource to become playable. The audio player may transition either the Playing state (success) or the Idle state (failure) from this state.

- **Playing** - this is the state a voice connection enters when it is actively playing an audio resource. When the audio resource comes to an end, the audio player will transition to the Idle state.

- **AutoPaused** - this is the state a voice connection will enter when the player has paused itself because there are no active voice connections to play to. This is only possible with the `noSubscriber` behavior set to `Pause`. It will automatically transition back to `Playing` once at least one connection becomes available again.

- **Paused** - this is the state a voice connection enters when it is paused by the user.

```ts
import { VoiceConnectionStatus } from '@discordjs/voice';

connection.on(VoiceConnectionStatus.Playing, () => {
	console.log('The audio player has started playing!');
});
```

## Handling errors

When an audio player is given an audio resource to play, it will propagate errors from the audio resource for you to handle.

In the error handler, you can choose to either play a new audio resource or stop playback. If you take no action, the audio player will stop itself and revert to the Idle state.

Two different examples of how you may handle errors are shown below.

### Taking action within the error handler

In this example, the audio player will only move on to playing the next audio resource if an error has occurred. If playback ends gracefully, nothing will happen.

```ts
player.play(getNextResource());

player.on('error', error => {
	console.error(error);
	player.play(getNextResource());
});
```

### Taking action within the Idle state

In this example, the error event is used only for logging purposes. The audio player will naturally transition into the Idle state, and then another resource is played. This has the advantage of working with streams that come to an end gracefully, and those that are interrupted by errors.

```ts
player.play(getNextResource());

player.on('error', error => {
	console.error(error);
});

player.on(AudioPlayerStatus.Idle, () => {
	player.play(getNextResource());
});
```
