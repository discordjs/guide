# Life cycles

Two of the main components that you'll interact with when using `@discordjs/voice` are:

- **VoiceConnection** – maintains a network connection to a Discord voice server
- **AudioPlayer** – plays audio resources across a voice connection

Both voice connections and audio players are _stateful_, and you are able to subscribe to changes in their state as they progress through their respective life cycles.

It's important to listen for state change events, as they will likely require you to take some action. For example, a voice connection entering the `Disconnected` state will probably require you to attempt to reconnect it.

Their individual life cycles with descriptions of their states are documented on their respective pages.

Listening to changes in the life cycles of voice connections and audio players can be done in two ways:

## Subscribing to individual events

```ts
import { VoiceConnectionStatus, AudioPlayerStatus } from '@discordjs/voice';

connection.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
	console.log('Connection is in the Ready state!');
});

player.on(AudioPlayerStatus.Playing, (oldState, newState) => {
	console.log('Audio player is in the Playing state!');
});
```

:::tip
One advantage of listening for transitions to individual states is that it becomes a lot easier to write sequential logic. This is made easy using our [state transition helper](https://github.com/discordjs/voice/blob/main/src/util/entersState.ts). An example is shown below.

```ts
import { AudioPlayerStatus, entersState } from '@discordjs/voice';

player.play(resource);
try {
	await entersState(player, AudioPlayerStatus.Playing, 5e3);
	// The player has entered the Playing state within 5 seconds
	console.log('Playback has started!');
} catch (error) {
	// The player has not entered the Playing state and either:
	// 1) The 'error' event has been emitted and should be handled.
	// 2) 5 seconds have passed
	console.error(error);
}
```
:::

## Subscribing to all state transitions

If you would prefer to keep a single event listener for all possible state transitions, then you can also listen to the `stateChange` event:

```ts
import { VoiceConnectionStatus, AudioPlayerStatus } from '@discordjs/voice';

connection.on('stateChange', (oldState, newState) => {
	console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
});

player.on('stateChange', (oldState, newState) => {
	console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
});
```
