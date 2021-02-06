# Voice Connections

Voice connections represent a connection to a voice channel in a Guild. You can only connect to one voice channel in a Guild at a time. They can be created like so:

```ts
import { joinVoiceChannel } from '@discordjs/voice';

const connection = joinVoiceChannel(myVoiceChannel);
```

## Life Cycle

Voice connections have their own life cycle, with 5 distinct states:

- **Signalling** - this is the initial state of a voice connection. The connection will be in this state when it is requesting permission to join a voice channel.

- **Connecting** - this is the state a voice connection enters once it has permission to join a voice channel and is in the process of establishing a connection to it.

- **Ready** - this is the state a voice connection enters once it has successfully established a connection to the voice channel. It is ready to play audio in this state.

- **Disconnected** - this is the state a voice connection enters when the connection to a voice channel has been severed. This can occur even if the connection has not yet been established. You may choose to attempt to reconnect in this state.

- **Destroyed** - this is the state a voice connection enters when it has been manually been destroyed. This will prevent it from accidentally being reused, and it will be removed from an in-memory tracker of voice connections.

It's important that you listen to the state changes of a voice connection so that you can track where it is in the life cycle, and what action needs to be taken.

### Subscribing to specific state changes

The first method of tracking this information is by subscribing to specific states. Below is an example of how to subscribe to a voice connection entering the Ready state:

```ts
import { VoiceConnectionStatus } from '@discordjs/voice';

connection.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
	console.log('Connection is in the Ready state!');
});
```

You will notice that you're given access to both the previous and the new state of a voice connection in the event handler – this is to inform your decision-making on what action to take on certain state transitions.

### Subscribing to all state changes

The second method of tracking state changes is to subscribe to the `stateChange` event. This would be useful if you want to track many different state transitions.

```ts
import { VoiceConnectionStatus } from '@discordjs/voice';

connection.on('stateChange', (oldState, newState) => {
	if (newState.status === VoiceConnectionStatus.Ready) {
		console.log('Connection is in the Ready state!');
	}
});
```

:::tip
A common problem you may across is wanting to set a time limit for state transitions. For example, you may want to allow a voice connection 30 seconds to successfully join a voice channel and transition to the Ready state before giving up and destroying it.

Time limits can be useful to make sure you're not waiting indefinitely for transitions that may never occur.

Take a look at [our examples](https://github.com/discordjs/voice/tree/main/examples) to see how we've implemented this.
:::