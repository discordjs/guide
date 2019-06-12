---
forceTheme: red
---

# MessageCollector

See the `Collector` section for most of the changes to `MessageCollector`, such as the new `dispose` method and event.  Changes to the `MessageCollector` constructor in particular are as follows:

## MessageCollector#channel

A `GroupDMChannel` is no longer able to be used for a collector, only `DMChannel` and `TextChannel`.

## MessageCollector#message

The `messageCollector.message` event has been removed in favor of the generic `collector.on` event.

## MessageCollectorOptions

## MessageCollectorOptions#max(Matches)

The `max` and `maxMatches` properties of the `MessageCollector` class have been renamed and repurposed.

```diff
- `max`: The The maximum amount of messages to process.
+ `maxProcessed`: The maximum amount of messages to process.

- `maxMatches`: The maximum amount of messages to collect.
+ `max`: The maximum amount of messages to collect.
```