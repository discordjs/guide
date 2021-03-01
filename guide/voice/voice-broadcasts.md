# Voice Broadcasts

<branch version="11.x">

The discord.js voice system allows your bot to join voice channels and play audio. This guide will teach you how to make simple music bots and give you tips to optimize performance!

This voice guide targets discord.js v12, which features an improved audio system. Much of the example code in the voice guide is unsuitable for v11 and below–to access this content, please update discord.js to v12! 

</branch>
<branch version="12.x">

## Example Usage

A voice broadcast can be thought of as a reusable StreamDispatcher–you can play an audio stream onto a broadcast, and then you can play the same broadcast across multiple voice connections. This is particularly useful for "radio bots" and performs much better than if you tried to play the same stream separately in each voice channel. It also ensures that all the voice connections are in sync when playing the audio.

```js
// Create an instance of a VoiceBroadcast
const broadcast = client.voice.createBroadcast();
// Play audio on the broadcast
const dispatcher = broadcast.play('audio.mp3');
// Play this broadcast across multiple connections (subscribe to the broadcast)
connection1.play(broadcast);
connection2.play(broadcast);
```

## Creating broadcasts

You can create as many broadcasts as you want via the voice sub-module:

```js
const broadcast = client.voice.createBroadcast();
const broadcast2 = client.voice.createBroadcast();
```

The broadcasts created above are independent; playing audio on one broadcast will not affect the other broadcast.

::: tip
You can access an array of broadcasts via `client.voice.broadcasts`–this might be useful if you're looking to stop/pause all active broadcasts.
:::

## Playing audio

Playing audio on a VoiceBroadcast is virtually the same as if you tried to play audio on a VoiceConnection (the only caveat being that you cannot play a VoiceBroadcast onto another VoiceBroadcast).

```js
const fs = require('fs');

const broadcast = client.voice.createBroadcast();

// From a path
broadcast.play('audio.mp3');
// From a ReadableStream
broadcast.play(fs.createReadStream('audio.mp3'));
// From a URL
broadcast.play('http://myserver.com/audio.aac');
```

The `.play()` method on a VoiceBroadcast returns a `BroadcastDispatcher` that can control the audio stream's playback like a regular `StreamDispatcher`.

Playing a broadcast on a voice connection (i.e., subscribing to the broadcast) is easy!

```js
// All 3 connections will play the same broadcast–they will play audio at the same time
connection1.play(broadcast);
connection2.play(broadcast);
connection3.play(broadcast);
```

## Key takeaways

There are some specific things to be aware of with broadcasts. This section will help you to understand them.

### VoiceBroadcast
- Can be created with `client.voice.createBroadcast()` when you're going to be playing the same audio across more than one `VoiceConnection`.
- Playing the same broadcast across multiple connections offers much better performance and synchronicity than playing the same resource across each connection individually–much of the intensive audio processes only once.
- `subscribe` and `unsubscribe` events emit here when VoiceConnections are subscribed and unsubscribed.
	```js
	broadcast.on('subscribe', dispatcher => {
		console.log(`Broadcast playing in ${dispatcher.player.voiceConnection.channel.name}`);
	});

	// Emits the subscribe event on the broadcast
	connection.play(broadcast);
	```
- You can use the `.play(resource)` method to play audio on the broadcast and across all subscribers.
- You can use the `.end()` method to destroy the broadcast, ending playback across all subscribers and unsubscribing them. This will also remove the broadcast from the `client.voice.broadcasts` array.
	```js
	// Destroy a broadcast
	broadcast.end();
	```

### BroadcastDispatcher
```js
const broadcastDispatcher = broadcast.play('music.mp3');
```
- Subscribers are `VoiceConnection`s that are currently playing the broadcast.
- A central controller for all subscribers–any changes to this dispatcher will affect all subscribers.
- Pausing/resuming this dispatcher will pause/resume playback across all subscribers.
- Altering the volume of this dispatcher will alter the volume across all subscribers.
- Destroying this dispatcher will stop playback across all subscribers, but they will remain subscribed to the broadcast as the broadcast itself has not been destroyed. To end the broadcast entirely and unsubscribe all subscribers, you should use `broadcast.end()`.

### StreamDispatcher
```js
const streamDispatcher = connection.play(broadcast);
```
- When playing broadcasts, StreamDispatchers are less flexible.
- You cannot alter the volume of a StreamDispatcher which is playing a broadcast.
- When audio finishes playing on the broadcast, the StreamDispatcher will remain alive and not emit a `finish` event–you should listen for that from the BroadcastDispatcher.
- You can still pause/resume StreamDispatchers as usual.
- To unsubscribe from a broadcast, you can use the `.destroy()` method.
	```js
	// Unsubscribe from broadcast
	streamDispatcher.destroy();
	```

</branch>