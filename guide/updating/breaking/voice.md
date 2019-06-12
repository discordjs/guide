---
forceTheme: red
---

# VoiceBroadcast

`VoiceBroadcast` now implements `PlayInterface` instead of `VolumeInterface`.

## VoiceBroadcast#currentTranscoder

This property has been removed entirely.

## VoiceBroadcast#destroy

This method has been removed entirely.

## VoiceBroadcast#dispatchers

This property has been renamed to `subscribers` and is no longer read-only.

```diff
- broadcast.dispatchers;
+ broadcast.subscribers;
```

## VoiceBroadcast#end

This event has been removed from the `VoiceBroadcast` class and is implemented from the `WritableStream` class from Node, which `BroadcastDispatcher` implements.

## VoiceBroadcast#error

This event has been removed from the `VoiceBroadcast` class to the `BroadcastDispatcher` class.

## VoiceBroadcast#pause

This method has been removed from the `VoiceBroadcast` class to the `BroadcastDispatcher` class.

## VoiceBroadcast#play\*\*\*

All `.play\*\*\*()` methods have been removed and transformed into a single `.play()` method.

## VoiceBroadcast#prism

This property has been removed entirely.

## VoiceBroadcast#resume

This method has been removed from the `VoiceBroadcast` class to the `BroadcastDispatcher` class.

## VoiceBroadcast#warn

This event has been removed entirely.

# VoiceConnection

The `VoiceConnection` class also implements the new `PlayInterface` class in addition to extending `EventEmitter` from Node.

## VoiceConnection#createReceiver
`voiceconnection.createReceiver()` has been removed, there is now a single receiver that be accessed from `voiceConnection.receiver`

## VoiceConnection#play\*\*\*\

All `connection.play\*\*\*()` methods have been removed in favor of one, flexible `.play()` method.

## VoiceConnection#prism

This property has been removed entirely.

## VoiceConnection#receivers

This property has been removed entirely.

## VoiceConnection#sendVoiceStateUpdate

This method has been removed entirely.

## VoiceConnection#set\*\*\*

Both `connection.setSessionID()` and `connection.setTokenAndEndpoint()` have been removed entirely.

# VoiceReceiver

## VoiceReceiver#create\*\*\*Stream

Both the `receiver.createOpusStream()` and `receiver.createPCMStream()` methods have been condensed into one method, `receiver.createStream()`, which also optionally accepts a `ReceiveStreamOptions` object for the stream.

```diff
- receiver.createOpusStream('123456789012345678');
- receiver.createPCMStream('123456789012345678');
+ receiver.createStream('123456789012345678', { mode: 'opus', end: 'silence' });
```

## VoiceReceiver#destroy

This method has been removed entirely, refer to `StreamDispatcher#destroy` for documentation.

## VoiceReceiver#destroyed

This property has been removed entirely.

## VoiceReceiver#opus

This event has been removed entirely.

## VoiceReceiver#pcm

This event has been removed entirely.

## VoiceReceiver#recreate

This method has been removed entirely.

## VoiceReceiver#voiceConnection

This property has been removed entirely.

## VoiceReceiver#warn

This event has been removed entirely, use the `receiver.debug` event instead.

# VoiceRegion

# VoiceRegion#sampleHostname

This property has been removed entirely.
