---
forceTheme: red
---

# DMChannel

## DMChannel#acknowledge

`dmChannel.acknowledge()` has been removed entirely, along with all other user account-only properties and methods.

## DMChannel#createCollector

`dmChannel.createCollector()` has been removed in favor of `dmChannel.createMessageCollector()`.

## DMChannel#fetch(Pinned)Message(s)

`dmChannel.fetchMessage(s)` has been transformed in the shape of a DataStore.  See the [TextChannel#fetch(Pinned)Message(s)](/additional-info/changes-inv-v12.md#channel) section for more information.

## DMChannel#search

`dmChannel.search()` has been removed entirely, along with all other user account-only properties and methods.

## DMChannel#send\*\*\*

Just like the `TextChannel#send***` methods, all the `.send***()` methods have been removed in favor of one general `.send()` method. Read through the [TextChannel#send\*\*\*](/additional-info/changes-in-v12.md#channelsend) section for more information.