---
forceTheme: red
---

# StreamDispatcher

`StreamDispatcher` now extends `WritableStream` from Node, you can see the docs [here](https://nodejs.org/api/stream.html#stream_class_stream_writable).

## StreamDispatcher#destroyed

`streamDispatcher.destroyed` has been removed entirely.

## StreamDispatcher#end

The `end` event and method are now extended from the `WritableStream` class in Node, instead of being custom functions.

## StreamDispatcher#passes

`streamDispatcher.passes` has been removed entirely.

## StreamDispatcher#pause

The `streamDispatcher.pause` method now takes an optional parameter `silence`, to specify whether to play silence while paused to prevent audio glitches.  Its value is a `boolean` and defaults to `false`.

```diff
- dispatcher.pause();
+ dispatcher.pause(true);
```

## StreamDispatcher#stream

The `streamDispatcher.stream` property has been removed entirely and has been replaced with the `streamDispatcher.broadcast` property, which is the broadcast controlling the stream, if any.

## StreamDispatcher#time

The `streamDispatcher.time` property has been renamed to `streamDispatcher.streamTime`.
