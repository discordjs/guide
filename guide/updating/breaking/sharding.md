---
forceTheme: red
---

# Sharding

## Shard

The `death` and `spawn` events for a shard can also include a `Worker` in addition to the `ChildProcess` that was exited or spawned.

## Shard#args

`shard.args` is now a property of the shard and has been removed as a parameter from the constructor.

## Shard#respawn

`shard.respawn` now takes a second, optional parameter `spawnTimeout`, how long to wait in milliseconds until the shard's `Client` becomes ready.

## Shard#spawn

The parameters in v11 have been removed and replaced with a single, optional parameter, `spawnTimeout`.

## ShardClientUtil

In order to make use of workers introduced in Node v10.5.0, a new `mode` parameter is available in the constructor.

## ShardClientUtil#id

`shardClientUtil.id` has been removed and replaced with `shardClientUtil.ids`, which is an array of shard IDs of the current client.

## ShardClientUtil#singleton

`shardCLientUtil` now has a second parameter `mode` to specify whether it's a `process` or `worker`.

## ShardingManager

## ShardingManger#_spawn

The private method `shardingManager._spawn()` has been removed entirely.

## ShardingManager#createShard

The `id` parameter is now optional and defaults to `this.shards.size`.

## ShardingManager#launch

The `shardingManager.launch` event has been removed entirely and replaced with the `shardingManager.shardCreate` event.

## ShardingManager#message

The `shardingManager.message` event has been removed from this class and is now on the `Shard` class.

## ShardingManager#respawnAll

The `waitForReady` parameter has been renamed to `spawnTimeout`, and the `currentShardIndex` parameter has been removed entirely.

## ShardingManager#spawn

A third, optional parameter `spawnTimeout` has been added, specifying how long to wait in miliseconds to wait until the `Client` is ready; the default is `30000`.
