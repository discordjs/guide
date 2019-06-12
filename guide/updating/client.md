---
forceTheme: red
---

# Client

## Client#fetchUser

`client.fetchUser()` has been removed and transformed in the shape of a DataStore.

```diff
- client.fetchUser('123456789012345678');
+ client.users.fetch('123456789012345678');
```

## Client#broadcasts

`client.broadcasts` has been removed and is now in the `ClientVoiceManager` class.

```diff
- client.broadcasts;
+ client.voice.broadcasts;
```

## Client#browser

`client.browser` has been changed to be an internal constant and is no longer available publicly.

## Client#channels

`client.channels` has been changed from a Collection to a DataStore.

## Client#clientUserGuildSettingsUpdate

The `client.clientUserGuildSettingsUpdate` event has been removed entirely, along with all other user account-only properties and methods.

## Client#clientUserSettingsUpdate

The `client.clientUserSettingsUpdate` event has been removed entirely, along with all other user account-only properties and methods.

## Client#disconnect

The `client.disconnect` event has been removed in favor of the `client.shardDisconnected` event to make use of internal sharding.

```diff
- client.on('disconnect', event => {});
+ client.on('shardDisconnected', (event, shardID) => {});
```

## Client#emojis

`client.emojis` has been changed from a Collection to a DataStore.

## Client#guildMemberSpeaking

The `speaking` parameter has been changed from a `boolean` value to a read-only `Speaking` class.

## Client#guilds

`client.guilds` has been changed from a Collection to a DataStore.

## Client#ping

`client.ping` has been moved to the WebSocketManager under `client.ws.ping`

```diff
- client.ping
+ client.ws.ping
```

## Client#pings

`client.pings` has been moved to the `WebSocketShard` class to make use of internal sharding.  The `Client` class has a `Collection` of `WebSocketShard`s available via `client.ws.shards`; alternatively, the `WebSocketShard` can be found as a property of other structures, eg `guild.shard`.

```diff
- client.pings;
+ guild.shard.pings;
```

## Client#presences

`client.presences` has been removed to reduce extraneous getters.

## Client#reconnecting

The `client.reconnecting` event has been removed in favor of the `client.shardReconnecting` event to make use of internal sharding.

```diff
- client.on('reconnecting', () => console.log('Successfully reconnected.'));
+ client.on('shardReconnecting', id => console.log(`Shard with ID ${id} reconnected.`));
```

## Client#resume

The `client.resume` event has been removed in favor of the `client.shardResumed` event to make use of internal sharding.

```diff
- client.on('resume', replayed => console.log(`Resumed connection and replayed ${replayed} events.`));
+ client.on('shardResumed', (replayed, shardID) => console.log(`Shard ID ${shardID} resumed connection and replayed ${replayed} events.`));
```

## Client#status

The `client.status` property has been removed and is now in the `WebSocketManager` class.  In addition, it is no longer a getter.

```diff
- client.status;
+ client.ws.status;
```

## Client#syncGuilds

`client.syncGuilds()` has been removed entirely, along with all other user account-only properties and methods.

## Client#typingStop

The `client.typingStop` event has been removed entirely, as it was an event created by the library and not an actual Discord WebSocket event.

## Client#userNoteUpdate

The `client.userNoteUpdate` event has been removed entirely, along with all other user account-only properties and methods.

## Client#users

`client.users` has been changed from a Collection to a DataStore.

## Client#voiceConnections

`client.voiceConnections` has been removed and is now in the `ClientVoiceManager` class.  In addition, the `Collection` is no longer a getter.

```diff
- client.voiceConnections;
+ client.voice.connections;
```

## Client#voiceStateUpdate

The `client.voiceStateUpdate` event now returns `oldState` and `newState` representing the `VoiceState` of the member before and after the update, as opposed to the member itself.

```diff
- client.on('voiceStateUpdate', (oldMember, newMember) => console.log(oldMember));
+ client.on('voiceStateUpdate', (oldState, newState) => console.log(oldState));
```

## ClientOptions

There have been several changes made to the `ClientOptions` object located in `client#options`.

## ClientOptions#apiRequestMethod

`clientOptions.apiRequestMethod` has been made sequential and is used internally.

## ClientOptions#shardId

`clientOptions.shardId` has been changed to `clientOptions.shards` and now also accepts an array of numbers.

```diff
- options.shardId: 1
+ options.shards: [1, 2, 3]
```

## ClientOptions#shards

`clientOptions.shards` has been removed and is functionally equivalent to `clientOptions.totalShardCount` on v12.

## ClientOptions#sync

`clientOptions.sync` has been removed entirely, along with all other user account-only properties and methods.

## ClientUser

## ClientUser#acceptInvite

`clientUser.acceptInvite()` has been removed entirely, along with all other user account-only properties and methods.

## ClientUser#addFriend

`clientUser.addFriend()` has been removed entirely, along with all other user account-only properties and methods.

## ClientUser#avatarURL

`clientUser.avatarURL` is now a method, as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- clientUser.avatarURL;
+ clientUser.avatarURL();
+ clientUser.avatarURL({ format: 'png', size: 1024 });
```

## ClientUser#block

`clientUser.block()` has been removed entirely, along with all other user account-only properties and methods.

## ClientUser#blocked

`clientUser.blocked` has been removed entirely, along with all other user account-only properties and methods.

## ClientUser#createGuild

`clientUser.createGuild()` has been transformed in the shape of a DataStore.  In addition, the second and third parameters in `clientUser.createGuild()` have been changed/removed, leaving it with a total of two parameters. The `region` and `icon` parameters from v11 have been merged into an object as the second parameter.

```diff
- clientUser.createGuild('New server', 'us-east', './path/to/file.png');
+ clientUser.guilds.create('New server', { region: 'us-east', icon: './path/to/file.png' });
```

## ClientUser#displayAvatarURL

`clientUser.displayAvatarURL` is now a method, as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- clientUser.displayAvatarURL;
+ clientUser.displayAvatarURL();
+ clientUser.displayAvatarURL({ format: 'png', size: 1024 });
```

## ClientUser#email

`clientUser.email` has been removed entirely, along with all other user account-only properties and methods.

## ClientUser#fetchMentions

`clientUser.fetchMentions()` has been removed entirely, along with all other user account-only properties and methods.

## ClientUser#fetchProfile

`clientUser.fetchProfile()` has been removed entirely, along with all other user account-only properties and methods.

## ClientUser#friends

`clientUser.friends` has been removed entirely, along with all other user account-only properties and methods.

## ClientUser#guildSettings

`clientUser.guildSettings` has been removed entirely, along with all other user account-only properties and methods.

## ClientUser#mfaEnabled

`clientUser.mfaEnabled` has been removed entirely, along with all other user account-only properties and methods.

## ClientUser#mobile

`clientUser.mobile` has been removed entirely, along with all other user account-only properties and methods.

## ClientUser#note

`clientUser.note` has been removed entirely, along with all other user account-only properties and methods.

## ClientUser#notes

`clientUser.notes` has been removed entirely, along with all other user account-only properties and methods.

## ClientUser#premium

`clientUser.premium` has been removed entirely, along with all other user account-only properties and methods.

## ClientUser#removeFriend

`clientUser.removeFriend()` has been removed entirely, along with all other user account-only properties and methods.

## ClientUser#send\*\*\*

Just like the `TextChannel#send***` methods, all the `.send***()` methods have been removed in favor of one general `.send()` method. Read through the [TextChannel#send\*\*\*](/additional-info/changes-in-v12.md#channelsend) section for more information.

## ClientUser#setGame

`clientUser.setGame()` has been changed to `clientUser.setActivity()`. The second parameter is no longer for providing a streaming URL, but rather an object that allows you to provide the URL and activity type.

```diff
- clientUser.setGame('with my bot friends!');
+ clientUser.setActivity('with my bot friends!');

- clientUser.setGame('with my bot friends!', 'https://twitch.tv/your/stream/here');
+ clientUser.setActivity('with my bot friends!', { url: 'https://twitch.tv/your/stream/here', type: 'STREAMING' });
```

## ClientUser#setNote

`clientUser.setNote()` has been removed entirely, along with all other user account-only properties and methods.

## ClientUser#setPassword

`clientUser.setPassword()` has been removed entirely, along with all other user account-only properties and methods.

## ClientUser#settings

`clentUser.settings` has been removed entirely, along with all other user account-only properties and methods.

## ClientUser#unblock

`clientUser.unblock()` has been removed entirely, along with all other user account-only properties and methods.

## ClientUserChannelOverride

The `ClientUserChannelOverride` class has been removed entirely, along with all other user account-only properties and methods.

## ClientUserGuildSettings

The `ClientUserGuildSettings` class has been removed entirely, along with all other user account-only properties and methods.

## ClientUserSettings

The `ClientUserSettings` class has been removed entirely, along with all other user account-only properties and methods.

## ClientUserChannelOverride

The `ClientUserChannelOverride` class has been removed entirely.

## ClientUserGuildSettings

The `ClientUserGuildSettings` class has been removed entirely.
