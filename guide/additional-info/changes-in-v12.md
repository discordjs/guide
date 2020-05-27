# Updating from v11 to v12

After a long time in development, Discord.js v12 has been formally released, meaning it's time to update from v11 to get new features for your bots!  However, with those new features comes a lot of changes to the library that will break code written for v11.  This guide will serve as a handy reference for updating your code, covering the most commonly-used methods that have been changed, new topics such as partials and internal sharding, and will also include a comprehensive list of the method and property changes at the end.

:::tip
This guide has two versions! Make sure to select `v12 (stable)` in the drop down selection in the header bar to get code snippets and explanations for the new version across the guide.
:::

## Before You Start

v12 requires Node 12.x or higher to  use, so make sure you're up-to-date.  To check your Node version, use `node -v` in your terminal or command prompt, and if it's not high enough, update it!  There are many resources online to help you with this step based on your host system.

Once you got Node up-to-date you can install v12 by running `npm install discord.js` in your terminal or command prompt for text-only use, or `npm install discord.js @discordjs/opus` for voice support.

You can check your discord.js version with `npm list discord.js`. Should it still show v11.x uninstall (`npm uninstall discord.js`) and re-install discord.js and make sure the entry in your package.json does not prevent a major version update. Please refer to the [npm documentation](https://docs.npmjs.com/files/package.json#dependencies) for this.

## Commonly Used Methods That Changed

* All section headers are named in the following convention: `Class#methodOrProperty`.
* The use of parenthesis designates optional inclusion. For example, `Channel#fetch(Pinned)Message(s)` means that this section will include changes for `Channel#fetchPinnedMessages`, `Channel#fetchMessages`, and `Channel#fetchMessage`.
* The use of asterisks designates a wildcard. For example, `Channel#send***` means that this section will include changes for `Channel#sendMessage`, `Channel#sendFile`, `Channel#sendEmbed`, and so forth.

### Managers/ Cache

v12 introduces the concept of managers, you will no longer be able to directly use collection methods such as `Collection#get` on data structures like `Client#users`. You will now have to directly ask for cache on a manager before trying to use collection methods. Any method that is called directly on a manager will call the API, such as `GuildMemberManager#fetch` and `MessageManager#delete`. 

```diff
- client.users.get('123456789012345678');
+ client.users.cache.get('123456789012345678');

- channel.messages.get('123456789012345678');
+ channel.messages.cache.get('123456789012345678');

- guild.members.get('123456789012345678');
+ guild.members.cache.get('123456789012345678');
```

### Collection

#### Collection#exists

`collection.exists()` was removed entirely, `collection.some()` should be used to check if an element exists in the collection that satisfies the provided value.

```diff
- client.users.exists('username', 'Bob');
+ client.users.cache.some(user => user.username === 'Bob');
```

#### Collection#filterArray

`collection.filterArray()` was removed entirely, as it was just a helper method for `collection.filter().array()` and most of the time converting a collection to an array is an unnecessary step.

#### Collection#find

`collection.find('property', value)` has been removed entirely, and `collection.find()` only accepts a function in v12.

```diff
- client.users.find('username', 'Bob');
+ client.users.cache.find(user => user.username === 'Bob');
```

#### Collection#findAll

`collection.findAll()` was removed entirely as it just duplicated `collection.filterArray()`'s results.

### Fetch

Some methods that retrieve uncached data have been changed, transformed in the shape of a Manager.

```diff
- client.fetchUser('123456789012345678');
+ client.users.fetch('123456789012345678');

- guild.fetchMember('123456789012345678');
+ guild.members.fetch('123456789012345678');

- guild.fetchMembers();
+ guild.members.fetch();

- textChannel.fetchMessage('123456789012345678');
+ textChannel.messages.fetch('123456789012345678');

- textChannel.fetchMessages({ limit: 10 });
+ textChannel.messages.fetch({ limit: 10 });

- textChannel.fetchPinnedMessages();
+ textChannel.messages.fetchPinned();
```

### Send

All the `.send***()` methods have been removed in favor of one general `.send()` method.

```diff
- channel.sendMessage('Hey!');
+ channel.send('Hey!');

- channel.sendEmbed(embedVariable);
+ channel.send(embedVariable);
+ channel.send({ embed: embedVariable });
```

`channel.send(embedVariable)` will only work if that variable is an instance of the `MessageEmbed` class; object literals won't give you the expected result unless your embed data is inside an `embed` key.

```diff
- channel.sendCode('js', 'const version = 11;');
+ channel.send('const version = 12;', { code: 'js' });

- channel.sendFile('./file.png');
- channel.sendFiles(['./file-one.png', './file-two.png']);
+ channel.send({
+	files: [{
+		attachment: 'entire/path/to/file.jpg',
+		name: 'file.jpg'
+	}]
+ });
+ channel.send({
+	files: ['https://cdn.discordapp.com/icons/222078108977594368/6e1019b3179d71046e463a75915e7244.png?size=2048']
+ });
```

### Roles

The `GuildMember.roles` Collection has been changed to a Manager in v12, so a lot of the associated methods for interacting with a member's roles have changed as well.  They're no longer on the GuildMember object itself, but instead now on the `GuildMemberRoleManager`. The Manager holds API methods and cache for the roles, in the form of `GuildMemberRoleManager#cache` which is a plain Collection.

```diff
- guildMember.addRole('123456789012345678');
- guildMember.addRoles(['123456789012345678', '098765432109876543']);
+ guildMember.roles.add('123456789012345678');
+ guildMember.roles.add(['123456789012345678', '098765432109876543']);

- guildMember.removeRole('123456789012345678');
- guildMember.removeRoles(['123456789012345678', '098765432109876543']);
+ guildMember.roles.remove('123456789012345678');
+ guildMember.roles.remove(['123456789012345678', '098765432109876543']);

- guildMember.setRoles(['123456789012345678', '098765432109876543']);
+ guildMember.roles.set(['123456789012345678', '098765432109876543']);

- guildMember.roles.get('123456789012345678');
+ guildMember.roles.cache.get('123456789012345678');
```

In addition, the GuildMember properties related to roles have also been moved to the `GuildMemberRoleManager`.

```diff
- guildMember.colorRole;
+ guildMember.roles.color;

- guildMember.highestRole;
+ guildMember.roles.highest;

- guildMember.hoistRole;
+ guildMember.roles.hoist;
```

### Ban and Unban

The method to ban members and users have been moved to the `GuildMemberManager`.

```diff
- guild.ban('123456789012345678');
+ guild.members.ban('123456789012345678');

- guild.unban('123456789012345678');
+ guild.members.unban('123456789012345678');
```

### Image URLs

Some image-related properties like `user.avatarURL` are now a method in v12, so that you can apply some options to them, eg. to affect their display size. 

```diff
- user.avatarURL;
+ user.avatarURL();

- user.displayAvatarURL;
+ user.displayAvatarURL();

- guild.iconURL;
+ guild.iconURL();

- guild.splashURL;
+ guild.splashURL();
```

## Dynamic File type

Version 12 now allows you to dynamically set the file type for images. If the `dynamic` option is provided you will receive a `.gif` URL if the image is animated, otherwise it will fall back to the specified `format` or its default `.webp` if none is provided.

```js
user.avatarURL({ format: 'png', dynamic: true, size: 1024 });
```

### RichEmbed Constructor

The RichEmbed constructor has been removed and now the `MessageEmbed` constructor is used. It is largely the same to use, the only differences being the removal of `richEmbed.attachFile` (`messageEmbed.attachFiles` accepts a single file as a parameter as well) and `richEmbed.addBlankField` and the addition of `messageEmbed.addFields`.

### String Concatenation

v12 has changed how string concatenation works with stringifying objects.  The `valueOf` any data structure will return its id, which affects how it behaves in strings, eg. using an object for a mention.  In v11, you used to be able to use `channel.send(userObject + ' has joined!')` and it would automatically stringify the object and it would become the mention (`@user has joined!`), but in v12, it will now send a message that says `123456789012345678 has joined` instead.  Using template literals (\`\`) will still return the mention, however.

```diff
- channel.send(userObject + ' has joined!')
+ channel.send(`${userObject} has joined!`)
```

### User Account-Only Methods

All user account-only methods have been removed, as they are no longer publicly accessible from the API.

### Voice

v12 has a new voice system that improves stability but also comes with some changes to playing audio:

```diff
# Applies to VoiceConnection and VoiceBroadcast
- connection.playFile('file.mp3')
+ connection.play('file.mp3')

- connection.playStream(stream)
+ connection.play(stream)

- connection.playArbitraryInput(input)
+ connection.play(input)

- connection.playBroadcast(broadcast)
+ connection.play(broadcast)

- connection.playOpusStream(stream)
+ connection.play(stream, { type: 'opus' })

- connection.playConvertedStream(stream)
+ connection.play(stream, { type: 'converted' })
```

You can now also play Ogg Opus files or WebM Opus files directly without the need for FFmpeg in v12:

```js
connection.play(fs.createReadStream('file.ogg'), { type: 'ogg/opus' });
connection.play(fs.createReadStream('file.webm'), { type: 'webm/opus' });
```

It is also possible to define initial values for `plp`, `fec` and `bitrate` when playing a stream. Minus bitrate, these are new configurable options in v12 that can help when playing audio on unstable network connections.

```diff
- connection.playStream(stream).setBitrate(96)
+ connection.play(stream, { bitrate: 96 })
```

If you don't want to alter the volume of a stream while you're playing it, you can disable volume to improve performance. This cannot be reverted during playback.

```js
connection.play(stream, { volume: false });
```

The internal voice system in v12 now uses streams where possible, and as such StreamDispatcher itself is now a WritableStream. It also comes with new changes:

```diff
- dispatcher.end()
+ dispatcher.destroy()

- dispatcher.on('end', handler)
+ dispatcher.on('finish', handler)
```

You can manually control how many audio packets should be queued before playing audio for more consistent playback using the `highWaterMark` option (defaults to 12)
```js
connection.play(stream, { highWaterMark: 512 });
```

If you're frequently pausing/resuming an audio stream, you can enable playing silence packets while paused to prevent audio glitches on the Discord client
```js
// Passing true plays silence
dispatcher.pause(true);
```

#### Broadcasts

Broadcasts themselves now contain a `BroadcastDispatcher` that shares a similar interface to the `StreamDispatcher` and can be used to control the playback of an audio stream.

```diff
- client.createVoiceBroadcast()
+ client.voice.createBroadcast()

- broadcast.dispatchers
+ broadcast.subscribers
```

---

## Breaking Changes and Deletions

The section headers for breaking changes will be named after the v11 classes/methods/properties and will be in alphabetical order, so that you can easily find what you're looking for. The section headers for additions will be named after the v12 classes/methods/properties, to reflect their current syntax appropriately.

"Difference" code blocks will be used to display the old methods vs the newer ones—the red being what's been removed and the green being its replacement. Some bits may have more than one version of being handled. Regular JavaScript syntax code blocks will be used to display the additions. 

::: danger
While this list has been carefully crafted, it may be incomplete! If you notice pieces of missing or inaccurate data, we encourage you to [submit a pull request](https://github.com/discordjs/guide/compare)!
:::

* Activity [(additions)](/additional-info/changes-in-v12.md#activity)
* ActivityFlags [(additions)](/additional-info/changes-in-v12.md#activityflags)
* APIMessage [(additions)](/additional-info/changes-in-v12.md#apimessage)
* Base [(additions)](/additional-info/changes-in-v12.md#base)
* BaseClient [(additions)](/additional-info/changes-in-v12.md#baseclient)
* BitField [(additions)](/additional-info/changes-in-v12.md#bitfield)
* BroadcastDispatcher [(additions)](/additional-info/changes-in-v12.md#broadcastdispatcher)
* Channel (changed send/fetch to TextChannel) [(additions)](/additional-info/changes-in-v12.md#channel)
* ClientApplication [(additions)](/additional-info/changes-in-v12.md#clientapplication)
* Client [(changes)](/additional-info/changes-in-v12.md#client) [(additions)](/additional-info/changes-in-v12.md#client-2)
* ClientOptions [(changes)](/additional-info/changes-in-v12.md#clientoptions) [(additions)](/additional-info/changes-in-v12.md#clientoptions-2)
* ClientUser [(changes)](/additional-info/changes-in-v12.md#clientuser)
* Collection [(changes)](/additional-info/changes-in-v12.md#collection)
* Collector [(changes)](/additional-info/changes-in-v12.md#collector) [(additions)](/additional-info/changes-in-v12.md#collector-2)
* CollectorOptions [(additions)](/additional-info/changes-in-v12.md#collectoroptions)
* DMChannel [(changes)](/additional-info/changes-in-v12.md#dmchannel) [(additions)](/additional-info/changes-in-v12.md#dmchannel-2)
* Emoji [(changes)](/additional-info/changes-in-v12.md#emoji)
* EvaluatedPermissions [(changes)](/additional-info/changes-in-v12.md#evaluatedpermissions)
* Game [(changes)](/additional-info/changes-in-v12.md#game)
* GroupDMChannel [(changes)](/additional-info/changes-in-v12.md#groupdmchannel)
* Guild [(changes)](/additional-info/changes-in-v12.md#guild) [(additions)](/additional-info/changes-in-v12.md#guild-2)
* GuildChannel [(changes)](/additional-info/changes-in-v12.md#guildchannel) [(additions)](/additional-info/changes-in-v12.md#guildchannel-2)
* GuildMember [(changes)](/additional-info/changes-in-v12.md#guildmember)
* HTTPError [(additions)](/additional-info/changes-in-v12.md#httperror)
* Invite [(changes)](/additional-info/changes-in-v12.md#invite)
* Message [(changes)](/additional-info/changes-in-v12.md#message) [(additions)](/additional-info/changes-in-v12.md#message-2)
* MessageAttachment [(changes)](/additional-info/changes-in-v12.md#messageattachment) [(additions)](/additional-info/changes-in-v12.md#messageattachment-2)
* MessageCollectorOptions [(changes)](/additional-info/changes-in-v12.md#messagecollectoroptions)
* MessageEmbed [(changes)](/additional-info/changes-in-v12.md#messageembed) [(additions)](/additional-info/changes-in-v12.md#messageembed-2)
* MessageMentions [(changes)](/additional-info/changes-in-v12.md#messagementions)
* MessageReaction [(changes)](/additional-info/changes-in-v12.md#messagereaction)
* OAuth2Application [(changes)](/additional-info/changes-in-v12.md#oauth2application)
* PartialGuild [(changes)](/additional-info/changes-in-v12.md#partialguild-channel)
* PartialGuildChannel [(changes)](/additional-info/changes-in-v12.md#partialguild-channel)
* Permissions [(changes)](/additional-info/changes-in-v12.md#permissions) [(additions)](/additional-info/changes-in-v12.md#permissions-2)
* Presence [(changes)](/additional-info/changes-in-v12.md#presence) [(additions)](/additional-info/changes-in-v12.md#presence-2)
* ReactionCollector [(additions)](/additional-info/changes-in-v12.md#reactioncollector)
* ReactionEmoji [(changes)](/additional-info/changes-in-v12.md#)
* RichEmbed [(changes)](/additional-info/changes-in-v12.md#richembed)
* RichPresenceAssets [(changes)](/additional-info/changes-in-v12.md#richpresenceassets)
* Role [(changes)](/additional-info/changes-in-v12.md#role)
* Shard [(changes)](/additional-info/changes-in-v12.md#shard)
* ShardClientUtil [(changes)](/additional-info/changes-in-v12.md#shardclientutil)
* ShardingManager [(changes)](/additional-info/changes-in-v12.md#shardingmanager)
* StreamDispatcher [(changes)](/additional-info/changes-in-v12.md#streamdispatcher)
* TextChannel [(changes)](/additional-info/changes-in-v12.md#textchannel) [(additions)](/additional-info/changes-in-v12.md#textchannel-2)
* User [(changes)](/additional-info/changes-in-v12.md#user) [(additions)](/additional-info/changes-in-v12.md#user-2)
* Util [(changes)](/additional-info/changes-in-v12.md#util)
* VoiceBroadcast [(changes)](/additional-info/changes-in-v12.md#voicebroadcast) [(additions)](/additional-info/changes-in-v12.md#voicebroadcast-2)
* VoiceChannel [(additions)](/additional-info/changes-in-v12.md#voicechannel)
* VoiceConnection [(changes)](/additional-info/changes-in-v12.md#voiceconnection)
* VoiceReceiver [(changes)](/additional-info/changes-in-v12.md#voicereceiver) [(additions)](/additional-info/changes-in-v12.md#voicereceiver-2)
* VoiceRegion [(changes)](/additional-info/changes-in-v12.md#voiceregion)
* VoiceState [(additions)](/additional-info/changes-in-v12.md#voicestate)
* VolumeInterface [(changes)](/additional-info/changes-in-v12.md#volumeinterface)
* Webhook [(changes)](/additional-info/changes-in-v12.md#webhook) [(additions)](/additional-info/changes-in-v12.md#webhook-2)
* WebhookClient [(changes)](/additional-info/changes-in-v12.md#webhookclient)
* WebSocketManager [(additions)](/additional-info/changes-in-v12.md#websocketmanager)
* WebsocketOptions [(additions)](/additional-info/changes-in-v12.md#websocketoptions)
* WebSocketShard [(additions)](/additional-info/changes-in-v12.md#websocketshard)

### Dependencies

#### Snekfetch

Please note that `snekfetch` has been removed as a dependency, and has been replaced by `node-fetch`.  `snekfetch` has been deprecated by its developer and is no longer maintained.

### Attachment

The `Attachment` class has been removed in favor of the `MessageAttachment` class.

### Client

#### Client#fetchUser

`client.fetchUser()` has been removed and transformed in the shape of a Manager.

```diff
- client.fetchUser('123456789012345678');
+ client.users.fetch('123456789012345678');
```

#### Client#broadcasts

`client.broadcasts` has been removed and is now in the `ClientVoiceManager` class.

```diff
- client.broadcasts;
+ client.voice.broadcasts;
```

#### Client#browser

`client.browser` has been changed to be an internal constant and is no longer available publicly.

#### Client#channels

`client.channels` has been changed from a Collection to a Manager.

#### Client#clientUserGuildSettingsUpdate

The `client.clientUserGuildSettingsUpdate` event has been removed entirely, along with all other user account-only properties and methods.

#### Client#clientUserSettingsUpdate

The `client.clientUserSettingsUpdate` event has been removed entirely, along with all other user account-only properties and methods.

#### Client#destroy

The `client.destroy()` method no longer returns a Promise.

#### Client#disconnect

The `client.disconnect` event has been removed in favor of the `client.shardDisconnect` event to make use of internal sharding.

```diff
- client.on('disconnect', event => {});
+ client.on('shardDisconnect', (event, shardID) => {});
```

#### Client#emojis

`client.emojis` has been changed from a Collection to a Manager.

#### Client#guildMemberSpeaking

The `speaking` parameter has been changed from a `boolean` value to a read-only `Speaking` class.

#### Client#guilds

`client.guilds` has been changed from a Collection to a Manager.

#### Client#ping

`client.ping` has been moved to the WebSocketManager under `client.ws.ping`

```diff
- client.ping
+ client.ws.ping
```

#### Client#pings

`client.pings` has been moved to the `WebSocketShard` class to make use of internal sharding.  The `Client` class has a `Collection` of `WebSocketShard`s available via `client.ws.shards`; alternatively, the `WebSocketShard` can be found as a property of other structures, eg `guild.shard`.

```diff
- client.pings;
+ guild.shard.ping;
```

#### Client#presences

`client.presences` has been removed to reduce extraneous getters.

#### Client#presenceUpdate

The `client.presenceUpdate` has been changed and now passes the old and new `Presence` rather than the `GuildMember`.

```diff
- client.on('presenceUpdate', (oldMember, newMember) =>
+ client.on('presenceUpdate', (oldPresence, newPresence) =>
```

#### Client#reconnecting

The `client.reconnecting` event has been removed in favor of the `client.shardReconnecting` event to make use of internal sharding.

```diff
- client.on('reconnecting', () => console.log('Successfully reconnected.'));
+ client.on('shardReconnecting', id => console.log(`Shard with ID ${id} reconnected.`));
```

#### Client#resume

The `client.resume` event has been removed in favor of the `client.shardResume` event to make use of internal sharding.

```diff
- client.on('resume', replayed => console.log(`Resumed connection and replayed ${replayed} events.`));
+ client.on('shardResume', (replayed, shardID) => console.log(`Shard ID ${shardID} resumed connection and replayed ${replayed} events.`));
```

#### Client#status

The `client.status` property has been removed and is now in the `WebSocketManager` class.  In addition, it is no longer a getter.

```diff
- client.status;
+ client.ws.status;
```

#### Client#syncGuilds

`client.syncGuilds()` has been removed entirely, along with all other user account-only properties and methods.

#### Client#typingStop

The `client.typingStop` event has been removed entirely, as it was an event created by the library and not an actual Discord WebSocket event.

#### Client#userNoteUpdate

The `client.userNoteUpdate` event has been removed entirely, along with all other user account-only properties and methods.

#### Client#users

`client.users` has been changed from a Collection to a Manager.

#### Client#voiceConnections

`client.voiceConnections` has been removed and is now in the `ClientVoiceManager` class.  In addition, the `Collection` is no longer a getter.

```diff
- client.voiceConnections;
+ client.voice.connections;
```

#### Client#voiceStateUpdate

The `client.voiceStateUpdate` event now returns `oldState` and `newState` representing the `VoiceState` of the member before and after the update, as opposed to the member itself.

```diff
- client.on('voiceStateUpdate', (oldMember, newMember) => console.log(oldMember));
+ client.on('voiceStateUpdate', (oldState, newState) => console.log(oldState));
```

### ClientOptions

There have been several changes made to the `ClientOptions` object located in `client#options`.

#### ClientOptions#apiRequestMethod

`clientOptions.apiRequestMethod` has been made sequential and is used internally.

#### ClientOptions#shardId

`clientOptions.shardId` has been changed to `clientOptions.shards` and now also accepts an array of numbers.

```diff
- options.shardId: 1
+ options.shards: [1, 2, 3]
```

#### ClientOptions#shards

`clientOptions.shards` has been removed and is functionally equivalent to `clientOptions.shardCount` on v12.

#### ClientOptions#sync

`clientOptions.sync` has been removed entirely, along with all other user account-only properties and methods.

#### ClientOptions#disabledEvents

`clientOptions.disabledEvents` has been removed in favor of using intents. Please refer to our more [detailed article about this topic](/popular-topics/intents)

### ClientUser

#### ClientUser#acceptInvite

`clientUser.acceptInvite()` has been removed entirely, along with all other user account-only properties and methods.

#### ClientUser#addFriend

`clientUser.addFriend()` has been removed entirely, along with all other user account-only properties and methods.

#### ClientUser#avatarURL

`clientUser.avatarURL` is now a method, as opposed to a property. It also allows you to determine the file format and size to return. The `dynamic` option allows you to always get a `.gif` file for animated avatars. Otherwise the returned link will fall back to the format specified in the `format` option or `.webp` (it's default) if none is provided.

```diff
- clientUser.avatarURL;
+ clientUser.avatarURL();
+ clientUser.avatarURL({ dynamic: true, format: 'png', size: 1024 });
```

#### ClientUser#block

`clientUser.block()` has been removed entirely, along with all other user account-only properties and methods.

#### ClientUser#blocked

`clientUser.blocked` has been removed entirely, along with all other user account-only properties and methods.

#### ClientUser#createGuild

`clientUser.createGuild()` has been removed and transformed in the shape of a Manager. In addition, the second and third parameters in `clientUser.createGuild()` have been changed/removed, leaving it with a total of two parameters. The `region` and `icon` parameters from v11 have been merged into an object as the second parameter.

```diff
- clientUser.createGuild('New server', 'us-east', './path/to/file.png');
+ client.guilds.create('New server', { region: 'us-east', icon: './path/to/file.png' });
```

#### ClientUser#displayAvatarURL

`clientUser.displayAvatarURL` is now a method, as opposed to a property. It also allows you to determine the file format and size to return. If the `dynamic` option is provided you will receive a `.gif` URL if the image is animated, otherwise it will fall back to the specified `format` or its default `.webp` if none is provided.

```diff
- clientUser.displayAvatarURL;
+ clientUser.displayAvatarURL();
+ clientUser.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });
```

#### ClientUser#email

`clientUser.email` has been removed entirely, along with all other user account-only properties and methods.

#### ClientUser#fetchMentions

`clientUser.fetchMentions()` has been removed entirely, along with all other user account-only properties and methods.

#### ClientUser#fetchProfile

`clientUser.fetchProfile()` has been removed entirely, along with all other user account-only properties and methods.

#### ClientUser#friends

`clientUser.friends` has been removed entirely, along with all other user account-only properties and methods.

#### ClientUser#guildSettings

`clientUser.guildSettings` has been removed entirely, along with all other user account-only properties and methods.

#### ClientUser#mfaEnabled

`clientUser.mfaEnabled` has been removed entirely, along with all other user account-only properties and methods.

#### ClientUser#mobile

`clientUser.mobile` has been removed entirely, along with all other user account-only properties and methods.

#### ClientUser#note

`clientUser.note` has been removed entirely, along with all other user account-only properties and methods.

#### ClientUser#notes

`clientUser.notes` has been removed entirely, along with all other user account-only properties and methods.

#### ClientUser#premium

`clientUser.premium` has been removed entirely, along with all other user account-only properties and methods.

#### ClientUser#removeFriend

`clientUser.removeFriend()` has been removed entirely, along with all other user account-only properties and methods.

#### ClientUser#send\*\*\*

Just like the `TextChannel#send***` methods, all the `.send***()` methods have been removed in favor of one general `.send()` method. Read through the [TextChannel#send\*\*\*](/additional-info/changes-in-v12.md#channelsend) section for more information.

#### ClientUser#setGame

`clientUser.setGame()` has been changed to `clientUser.setActivity()`. The second parameter is no longer for providing a streaming URL, but rather an object that allows you to provide the URL and activity type.

```diff
- clientUser.setGame('with my bot friends!');
+ clientUser.setActivity('with my bot friends!');

- clientUser.setGame('with my bot friends!', 'https://twitch.tv/your/stream/here');
+ clientUser.setActivity('with my bot friends!', { url: 'https://twitch.tv/your/stream/here', type: 'STREAMING' });
```

#### ClientUser#setNote

`clientUser.setNote()` has been removed entirely, along with all other user account-only properties and methods.

#### ClientUser#setPassword

`clientUser.setPassword()` has been removed entirely, along with all other user account-only properties and methods.

#### ClientUser#settings

`clientUser.settings` has been removed entirely, along with all other user account-only properties and methods.

#### ClientUser#unblock

`clientUser.unblock()` has been removed entirely, along with all other user account-only properties and methods.

### ClientUserChannelOverride

The `ClientUserChannelOverride` class has been removed entirely, along with all other user account-only properties and methods.

### ClientUserGuildSettings

The `ClientUserGuildSettings` class has been removed entirely, along with all other user account-only properties and methods.

### ClientUserSettings

The `ClientUserSettings` class has been removed entirely, along with all other user account-only properties and methods.

### ClientUserChannelOverride

The `ClientUserChannelOverride` class has been removed entirely.

### ClientUserGuildSettings

The `ClientUserGuildSettings` class has been removed entirely.

### ClientUserSettings

The `ClientUserSettings` class has been removed entirely.

### Collection

#### Collection#find/findKey

Both methods will now return `undefined` if nothing is found.

#### Collection#deleteAll

`collection.deleteAll()` has been removed in favor of map's default `clear()` method.

```diff
- roles.deleteAll();
+ roles.clear();
```

#### Collection#exists

`collection.exists()` has been removed entirely in favor of `collection.some()`

```diff
- client.users.exists('username', 'Bob');
+ client.users.cache.some(user => user.username === 'Bob');
```

#### Collection#filterArray

`collection.filterArray()` has been removed completely.

#### Collection#findAll

`collection.findAll()` has been removed completely as the same functionality can be obtained through `collection.filter()`.

#### Collection#first/firstKey/last/lastKey/random/randomKey

The `amount` parameter of these methods now allows a negative number which will start the query from the end of the collection instead of the start.

#### Collection#tap

`collection.tap` runs a specific function over the collection instead of mimicking `<array>.forEach()`, this functionality was moved to `collection.each()`. 

### Collector

#### Collector#cleanup

`collector.cleanup()` has been removed entirely.

#### Collector#handle

`collector.handle()` has been changed to `collector.handleCollect()`.

#### Collector#postCheck

`collector.postCheck()` has been changed to `collector.checkEnd()`.

### DMChannel

#### DMChannel#acknowledge

`dmChannel.acknowledge()` has been removed entirely, along with all other user account-only properties and methods.

#### DMChannel#createCollector

`dmChannel.createCollector()` has been removed in favor of `dmChannel.createMessageCollector()`.

#### DMChannel#fetch(Pinned)Message(s)

`dmChannel.fetchMessage(s)` has been transformed in the shape of a Manager.  See the [TextChannel#fetch(Pinned)Message(s)](/additional-info/changes-inv-v12.md#channel) section for more information.

#### DMChannel#search

`dmChannel.search()` has been removed entirely, along with all other user account-only properties and methods.

#### DMChannel#send\*\*\*

Just like the `TextChannel#send***` methods, all the `.send***()` methods have been removed in favor of one general `.send()` method. Read through the [TextChannel#send\*\*\*](/additional-info/changes-in-v12.md#channelsend) section for more information.

### Emoji

`Emoji` now extends `Base` and represent either a `GuildEmoji` or `ReactionEmoji`, and some of the specific properties have moved to their respective object, instead of everything on the base `Emoji` object.

#### Emoji#\*\*\*RestrictedRole(s)

The helper methods to add and remove a role or roles from the roles allowed to use the emoji are now set via the `GuildEmojiRoleManager`.

```diff
- emoji.addRestrictedRole('123456789012345678');
- emoji.addRestrictedRoles(['123456789012345678', '098765432109876543']);
- emoji.removeRestrictedRole('1234567890123345678');
- emoji.removedRestrictedRoles(['123456789012345678', '098765432109876543']);
+ emoji.roles.add('123456789012345678');
+ emoji.roles.remove('123456789012345678');
+ emoji.roles.set(['123456789012345678', '098765432109876543']);
```

#### Emoji#deletable

`emoji.deletable` has been moved to `guildEmoji.deletable`.

#### Emoji#fetchAuthor

`emoji.fetchAuthor()` has been moved to `guildEmoji.fetchAuthor()`.

#### Emoji#guild

`emoji.guild` has been moved to `guildEmoji.guild`.

#### Emoji#setName

`emoji.setName()` has been moved to `guildEmoji.setName()`.

### EvaluatedPermissions

`evaluatedPermissions` has been removed entirely, see the `Permissions` page.

### Game

The `Game` class has been removed in favor of the `Activity` class to be consistent with the API. It is also an array of multiple Activities, since a user can have multiple.

```diff
- user.presence.game
+ user.presence.activities
```

### GroupDMChannel

The `GroupDMChannel` class has been deprecated from the Discord API.  While it's still available through Gamebridge for now, that will also be removed in the future.  In addition, group DM's has always been unreliable and hacky to work with a bot.

### Guild

#### Guild#acknowledge

`guild.acknowledge()` has been removed entirely, along with all other user account-only properties and methods.

#### Guild#allowDMs

`guild.allowDMs()` has been removed entirely, along with all other user account-only properties and methods.

#### Guild#ban

`guild.ban()` has been moved to the `GuildMemberManager`.  In addition, the second parameter in `guild.members.ban()` has been changed. The `options` parameter no longer accepts a number, nor a string.

```diff
- guild.ban(user, 7);
+ guild.members.ban(user, { days: 7 });

- guild.ban(user, 'Too much trolling');
+ guild.members.ban(user, { reason: 'Too much trolling' });
```

#### Guild#Channels

`guild.channels` is now a Manager instead of a Collection.

#### Guild#createChannel

`guild.createChannel()` has been transformed in the shape of a Manager.  The second, third and fourth parameters in `guild.createChannel()` have been changed/removed, leaving it with a total of two parameters, the second one being an object with all of the options available in `ChannelData`.

```diff
- guild.createChannel('new-channel', 'text', permissionOverwriteArray, 'New channel added for fun!');
+ guild.channels.create('new-channel', { type: 'text', permissionOverwrites: permissionOverwriteArray, reason: 'New channel added for fun!' });
```

#### Guild#createEmoji

`guild.createEmoji()` has been transformed in the shape of a Manager.  The third and fourth parameters in `guild.createEmoji()` have been changed/removed, leaving it with a total of three parameters. The `roles` and `reason` parameters from v11 have been merged into an object as the third parameter.

```diff
- guild.createEmoji('./path/to/file.png', 'NewEmoji', collectionOfRoles, 'New emoji added for fun!');
+ guild.emojis.create('./path/to/file.png', 'NewEmoji', { roles: collectionOfRoles, reason: 'New emoji added for fun!' });
```

#### Guild#createRole

`guild.createRole()` has been transformed in the shape of a Manager.  The first and second parameters in `guild.createRole()` have been changed/removed, leaving it with a total of one parameter. The `data` and `reason` parameters from v11 have been moved into an object as the first parameter.

```diff
- guild.createRole(roleData, 'New staff role!');
+ guild.roles.create({ data: roleData, reason: 'New staff role!' });
```

#### Guild#deleteEmoji

`Guild.deleteEmoji()` has been removed and transformed in the shape of a Manager. Note the possible use of `resolve()` as a broader alternative to `get()`.

```diff
- guild.deleteEmoji('123456789012345678');
+ guild.emojis.resolve('123456789012345678').delete();
```

#### Guild#defaultChannel

Unfortunately, "default" channels don't exist in Discord anymore, and as such, the `guild.defaultChannel` property has been removed with no alternative.

**Q:** "I previously had a welcome message system (or something similar) set up using that property. What can I do now?"

**A:** There are a few ways to tackle this. Using the example of a welcome message system, you can:

1. Set up a database table to store the channel ID in a column when someone uses a `!welcome-channel #channel-name` command, for example. Then inside the `guildMemberAdd` event, use `client.channels.cache.get('id')` and send a message to that channel. This is the most reliable method and gives server staff freedom to rename the channel as they please.
2. Make a new command that creates a `welcome-messages` channel, use `guild.channels.cache.find(channel => channel.name === 'welcome-messages')`, and send a message to that channel. This method will work fine in most cases, but will break if someone on that server decides to rename the channel. This may also give you unexpected results, due to Discord allowing multiple channels to have the same name.

::: tip
Not sure how to set up a database? Check out [this page](/sequelize/)!
:::

#### Guild#emojis

`guild.emojis` has been transformed in the shape of a Manager.

#### Guild#fetchBans

`guild.fetchBans()` will return a `Collection` of objects in v12, whereas v11 would return a `Collection` of `User` objects.

```diff
- guild.fetchBans().then(bans => console.log(`${bans.first().tag} was banned`));
+ guild.fetchBans().then(bans => console.log(`${bans.first().user.tag} was banned because "${bans.first().reason}"`));
```

#### Guild#fetchMember(s)

`guild.fetchMember()` and `guild.fetchMembers()` were both removed and transformed in the shape of Managers. In addition, `guild.members.fetch()` will return a `Collection` of `GuildMember` objects in v12, whereas v11 would return a `Guild` object.

```diff
- guild.fetchMember('123456789012345678');
+ guild.members.fetch('123456789012345678');
```

```diff
- guild.fetchMembers();
+ guild.members.fetch();
```

#### Guild#iconURL

`guild.iconURL` is now a method, as opposed to a property. It also allows you to determine the file format and size to return. If the `dynamic` option is provided you will receive a `.gif` URL if the image is animated, otherwise it will fall back to the specified `format` or its default `.webp` if none is provided.

```diff
- guild.iconURL;
+ guild.iconURL();
+ guild.iconURL({ format: 'png', dynamic: true, size: 1024 });
```

#### Guild#messageNotifications

`guild.messageNotifications` has been removed entirely, along with all other user account-only properties and methods.

#### Guild#mobilePush

`guild.mobilePush` has been removed entirely, along with all other user account-only properties and methods.

#### Guild#muted

`guild.muted` has been removed entirely, along with all other user account-only properties and methods.

#### Guild#position

`guild.position` has been removed entirely, along with all other user account-only properties and methods.

#### Guild#presences

`guild.presences` is now a Manager instead of a Collection.

#### Guild#pruneMembers

`guild.pruneMembers()` has been transformed in the shape of a Manager.  In addition, the first, second, and third parameters in the method have been changed or removed, leaving it with a total of one parameter. The `days`, `dry`, and `reason` parameters from v11 have been merged into an object as the first parameter.

```diff
- guild.pruneMembers(7, true, 'Scheduled pruning');
+ guild.members.prune({ days: 7, dry: true, reason: 'Scheduled pruning' });
```

#### Guild#roles

`guild.roles` is now a Manager instead of a Collection.

#### Guild#search

`guild.search()` has been removed entirely, along with all other user account-only properties and methods.

#### Guild#setChannelPosition

`guild.setChannelPosition()` has been removed entirely. As an alternative, you can use `channel.setPosition()`, or `guild.setChannelPositions()`, which accepts accepts the same form of data as `guild.setChannelPosition` but inside an array.

```diff
- guild.setChannelPosition({ channel: '123456789012345678', position: 1 });
+ guild.setChannelPositions([{ channel: '123456789012345678', position: 1 }]);
+ channel.setPosition(1);
```

#### Guild#setPosition

`guild.setPosition()` has been removed entirely, along with all other user account-only properties and methods.

#### Guild#setRolePosition

`guild.setRolePosition()` has been removed entirely as an extraneous helper method. As an alternative, you can use `role.setPosition()`.

```diff
- guild.setRolePosition({ role: '123456789012345678', position: 1 });
+ role.setPosition(1);
```

#### Guild#splashURL

`guild.splashURL` is now a method, as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- guild.splashURL;
+ guild.splashURL();
+ guild.splashURL({ format: 'png', size: 1024 });
```

#### Guild#suppressEveryone

`guild.suppressEveryone` has been removed entirely, along with all other user account-only properties and methods.

#### Guild#sync

`guild.sync()` has been removed entirely, along with all other user account-only properties and methods.

#### Guild#unban

`guild.unban()` has been transformed in the shape of a Manager and is now a method on `GuildMemberManager`.  In addition, it also now optionally accepts a string as a second parameter for `reason`.

```diff
- guild.unban('123456789012345678');
+ guild.members.unban('123456789012345678', 'Ban appealed.');
```

#### Guild#verificationLevel

`guild.verificationLevel` now returns one of `"NONE"`, `"LOW"`, `"MEDIUM"`, `"HIGH"`, `"VERY_HIGH"` instead of the corresponding number.

### GuildChannel

The properties of a channel relating to its position have been renamed.  `guildChannel.calculatedPosition` is now `guildChannel.position`.  `guildChannel.position` is now more clearly named `guildChannel.rawPosition` to denote that it's directly from the API without any sorting.

```diff
- channel.calculatedPosition;
+ channel.position;

- channel.position;
+ channel.rawPosition;
```

#### GuildChannel#clone

The first, second, third, and fourth parameters in `channel.clone()` have been changed/removed, leaving it with a total of one parameter. The `name`, `withPermissions`, `withTopic`, and `reason` parameters from v11 have been merged into an object as the first parameter.  Several other parameters have also been added to the options object.

#### GuildChannel#createInvite

The second parameter in `channel.createInvite()` has been removed, leaving it with a total of one parameter. The `reason` parameter from v11 has been merged into an object as the first parameter.

```diff
- channel.createInvite({ temporary: true }, 'Just testing');
+ channel.createInvite({ temporary: true, reason: 'Just testing' });
```

#### GuildChannel#members

`guildChannel.members` has been removed from `guildChannel.members` and added to `textChannel.members` and `voiceChannel.members`.

#### GuildChannel#messageNotifications

`guildChannel.messageNotifications` has been removed entirely, along with all other user account-only properties.

#### GuildChannel#muted

`guildChannel.muted` has been removed entirely, along with all other user account-only properties.

#### GuildChannel#overwritePermissions

`guildChannel.overwritePermissions` has been changed to act as replacement for `guildChannel.replacePermissionOverwrites`.

The old functionality is moved to `guildChannel.updateOverwrite` and `guildChannel.createOverwrite`

```diff
- message.channel.overwritePermissions(message.author, {
-   SEND_MESSAGES: false
- })
+ message.channel.createOverwrite(message.author, {
+   SEND_MESSAGES: false
+ })
```

#### GuildChannel#\*\*\*Permissions

`guildChannel.memberPermissions` and `guildChannel.rolePermissions` are now private.

#### GuildChannel#replacePermissionOverwrites

`guildChannel.replacePermissionOverwrites` has been renamed to `guildChannel.overwritePermissions`. Overwrites and reason are no longer provided Through an options object, but directly as method arguments.

```diff
- channel.replacePermissionOverwrites({
- overwrites: [
-   {
-      id: message.author.id,
-      denied: ['VIEW_CHANNEL'],
-   },
- ],
-   reason: 'Needed to change permissions'
- });
+ channel.overwritePermissions([
+   {
+      id: message.author.id,
+      deny: ['VIEW_CHANNEL'],
+   },
+ ], 'Needed to change permissions');
```

#### GuildChannel#setPosition

The second parameter in `channel.setPosition()` has been changed. The `relative` parameter from v11 has been merged into an object.

```diff
- channel.setPosition(10, true);
+ channel.setPosition(10, { relative: true, reason: 'Basic organization' });
```

### GuildMember

#### GuildMember\*\*\*Role(s)

All of the methods to modify a member's roles have been moved to the `GuildMemberRoleManager`.

```diff
- guildMember.addRole('123456789012345678');
- guildMember.addRoles(['123456789012345678', '098765432109876543']);
+ guildMember.roles.add('123456789012345678');
+ guildMember.roles.add(['123456789012345678', '098765432109876543']);

- guildMember.removeRole('123456789012345678');
- guildMember.removeRoles(['123456789012345678', '098765432109876543']);
+ guildMember.roles.remove('123456789012345678');
+ guildMember.roles.remove(['123456789012345678', '098765432109876543']);

- guildMember.setRoles(['123456789012345678', '098765432109876543']);
+ guildMember.roles.set(['123456789012345678', '098765432109876543']);
```

#### GuildMember#ban

`guildMember.ban()` has been transformed in the shape of a Manager and is now a method on `GuildMemberManager`. The second parameter has been changed from a string or an object to only accept an object.  The `reason` and `days` parameters are keys in the `options` object.

```diff
- member.ban(user, 7);
+ guild.members.ban(user, { days: 7 });

- member.ban(user, 'Too much trolling');
+ guild.members.ban(user, { reason: 'Too much trolling' });
```

#### GuildMember#\*\*\*Role

`guildMember.colorRole`, `guildMember.highestRole` and `guildMember.hoistRole` have all been moved to the `GuildMemberRoleManager`.

```diff
- guildMember.colorRole;
+ guildMember.roles.color;

- guildMember.highestRole;
+ guildMember.roles.highest;

- guildMember.hoistRole;
+ guildMember.roles.hoist;
```

#### GuildMember#\*\*\*deaf

`guildMember.deaf`, `guildMember.selfDeaf` and `guildMember.serverDeaf` have all been moved to the `VoiceState` class.

```diff
- guildMember.deaf;
+ guildMember.voice.deaf;

- guildMember.selfDeaf;
+ guildMember.voice.selfDeaf;

- guildMember.serverDeaf;
+ guildMember.voice.serverDeaf;
```

#### GuildMember#hasPermission

The `explicit` parameter has been removed entirely.  The `checkAdmin` and `checkOwner` parameters have been changed into a single `options` object with those values as keys.

```diff
- guildMember.hasPermission('MANAGE_MESSAGES', true, false, false);
+ guildMember.hasPermission('MANAGE_MESSAGES', { checkAdmin: false, checkOwner: false });
```

#### GuildMember#hasPermissions

`guildMember.hasPermissions()` has been removed in favor of `guildMember.hasPermission()`.

```diff
- guildMember.hasPermissions(['MANAGE_MESSAGES', 'MANAGE_ROLES']);
+ guildMember.hasPermission(['MANAGE_MESSAGES', 'MANAGE_ROLES']);
```

#### GuildMember#lastMessage

The `guildMember.lastMessage` property is now read-only.

#### GuildMember#missingPermissions

`guildMember.missingPermissions` has been removed entirely.

#### GuildMember#\*\*\*mute

`guildMember.mute`, `guildMember.selfMute` and `guildMember.serverMute` have all been moved to the `VoiceState` class.

```diff
- guildMember.mute;
+ guildMember.voice.mute;

- guildMember.selfMute;
+ guildMember.voice.selfMute;

- guildMember.serverMute;
+ guildMember.voice.serverMute;
```

#### GuildMember#roles

`guildMember.roles` is now a Manager instead of a Collection.

#### GuildMember#send\*\*\*

Just like the `textChannel#send***` methods, all the `.send***()` methods have been removed in favor of one general `.send()` method. Read through the [textChannel#send\*\*\*](/additional-info/changes-in-v12.md#channelsend) section for more information.

#### GuildMember#set\*\*\*

Along with the rest of the voice-related methods and properties, the methods for moving, muting and deafening a member have been moved to the `VoiceState` class.

```diff
- guildMember.setDeaf(true);
+ guildMember.voice.setDeaf(true);

- guildMember.setMute(true);
+ guildMember.voice.setMute(true);

- guildMember.setVoiceChannel('123456789012345678');
+ guildMember.voice.setChannel('123456789012345678');

- guildMember.setVoiceChannel(null);
+ guildMember.voice.kick();
```

#### GuildMember#speaking

`guildMember.speaking` has been moved to the `VoiceState` class.

```diff
- guildMember.speaking;
+ guildMember.voice.speaking;
```

#### GuildMember#voice\*\*\*

`guildMember.voiceChannel`, `guildMember.voiceChannelID` and `guildMember.voiceSessionID` have all been moved to the `VoiceState` class, which is read-only.

```diff
- guildMember.voiceChannel;
+ guildMember.voice.channel;

- guildMember.voiceChannelID;
+ guildMember.voice.channelID;

- guildMember.voiceSessionID;
+ guildMember.voice.sessionID;
```

### Invite

#### Invite#\*\*\*ChannelCount

`invite.textChannelCount` and `invite.voiceChannelCount` have both been removed entirely.

### Message

#### Message#acknowledge

`message.acknowledge()` has been removed entirely, along with all other user account-only properties and methods.

#### Message#clearReactions

`message.clearReactions()` has been transformed in the shape of a Manager.

```diff
- message.clearReactions();
+ message.reactions.removeAll();
```

#### Message#delete

The first parameter in `message.delete()` has been changed. The `timeout` parameter from v11 have been merged into an object as the first parameter.  In addition, there is now another optional key in the object, `reason`.

```diff
- message.delete(5000);
+ message.delete({ timeout: 5000, reason: 'It had to be done.' });
```

#### Message#editCode

In the same sense that the `channel.sendCode()` method was removed, `message.editCode()` has also been removed entirely.

```diff
- message.editCode('js', 'const version = 11;');
+ message.edit('const version = 12;', { code: 'js' });
```

#### Message#hit

`message.hit` has been removed entirely, as it was used for user-account only searches.

#### Message#is(Member)Mentioned

`message.isMentioned()` and `message.isMemberMentioned()` have been removed in favor of `message.mentions.has()`.

```diff
- message.isMentioned('123456789012345678');
- message.isMemberMentioned('123456789012345678');
+ message.mentions.has('123456789012345678');
```

#### Message#member

`message.member` is now read-only.

### MessageAttachment

The `MessageAttachment` class constructor parameters have changed to reflect that `Attachment` has been removed and rolled into `MessageAttachment`.

#### MessageAttachment#client

`attachment.client` has been removed entirely so an attachment can be constructed without needing the full client.

#### MessageAttachment#filename

`attachment.filename` has been renamed to `attachment.name`.

#### MessageAttachment#filesize

`attachment.filesize` has been renamed to `attachment.size`.

### MessageCollector

See the `Collector` section for most of the changes to `MessageCollector`, such as the new `dispose` method and event.  Changes to the `MessageCollector` constructor in particular are as follows:

#### MessageCollector#channel

A `GroupDMChannel` is no longer able to be used for a collector, only `DMChannel` and `TextChannel`.

#### MessageCollector#message

The `messageCollector.message` event has been removed in favor of the generic `collector.on` event.

### MessageCollectorOptions

#### MessageCollectorOptions#max(Matches)

The `max` and `maxMatches` properties of the `MessageCollector` class have been renamed and repurposed.

```diff
- `max`: The The maximum amount of messages to process.
+ `maxProcessed`: The maximum amount of messages to process.

- `maxMatches`: The maximum amount of messages to collect.
+ `max`: The maximum amount of messages to collect.
```

### MessageEmbed

`MessageEmbed` now encompasses both the received embeds in a message and the constructor - the `RichEmbed` constructor was removed in favor of `MessageEmbed`.

#### MessageEmbed#addBlankField

`messageEmbed.addBlankField()` has been removed entirely. To add a blank field, use `messageEmbed.addField('\u200b', '\u200b')`.

#### MessageEmbed#attachFiles

`RichEmbed.attachFile()` has been removed in favor of `MessageEmbed.attachFiles()` method, which works for one or more files.

#### MessageEmbed#client

`messageEmbed.client` has been removed entirely so a new embed can be constructed without needing the full client.

#### MessageEmbed#message

`messageEmbed.message` has been removed entirely so a new embed can be constructed without needing the full client.

### MessageMentions

#### MessageMentions#has

`mentions.has()` has been added, replacing `message.isMentioned()` and `message.isMemberMentioned()`.  It has two paramets: the first is `data` representing a `User`, `GuildMember`, `Role`, or `GuildChannel` and an optional `options` object.

```diff
- message.isMentioned('123456789012345678');
- message.isMemberMentioned('123456789012345678');
+ message.mentions.has('123456789012345678');
+ message.mentions.has('123456789012345678', { ignoreDirect: true, ignoreRoles: true, ignoreEveryone: true });
```

### MessageReaction

#### MessageReaction#fetchUsers

`messageReaction.fetchUsers()` has been transformed in the shape of a Manager.  In addition, the first parameter has been removed in favor of an object.

```diff
- reaction.fetchUsers(50);
+ reaction.users.fetch({ limit: 50 });
```

#### MessageReaction#remove

`messageReaction.remove()` has been transformed in the shape of a Manager.

```diff
- reaction.remove();
+ reaction.users.remove();
```

### OAuth2Application

The `OAuth2Application` class has been renamed to `ClientApplication`.

#### OAuth2Application#bot

`application.bot` has been removed entirely.

#### OAuth2Application#flags

`application.flags` has been removed entirely.

#### OAuth2Application#iconURL

`application.iconURL` is now a method, as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- application.iconURL;
+ application.iconURL();
+ application.iconURL({ format: 'png', size: 1024 });
```

#### OAuth2Application#redirectURLs

`application.redirectURLs` has been removed entirely.

#### OAuth2Application#reset

`application.reset()` has been removed entirely, as it was an endpoint for user accounts.

#### OAuth2Application#rpcApplicationState

`application.rpcApplicationState` has been removed entirely.

#### OAuth2Application#secret

`application.secret` has been removed entirely.

### PartialGuild(Channel)

The `PartialGuild` and `PartialGuildChannel` classes for use with invites have been removed entirely.

### Permissions

#### Permissions#_member

`permissions._member` has been removed entirely.

#### Permissions#flags

The following permission flags have been renamed:

* `READ_MESSAGES` -> `VIEW_CHANNEL`
* `EXTERNAL_EMOJIS` -> `USE_EXTERNAL_EMOJIS`
* `MANAGE_ROLES_OR_PERMISSIONS` -> `MANAGE_ROLES`

#### Permissions#hasPermission(s)

`permissions.hasPermission()` and `permissions.hasPermissions()` have been removed entirely in favor of `permissions.has()`.  This change reduces extraneous helper methods.

#### Permissions#missingPermissions

`permissions.missingPermissions()` has been renamed to `permissions.missing()` and also refactored. The second parameter in v11 was named `explicit`, described as "Whether to require the user to explicitly have the exact permissions", defaulting to `false`. However, the second parameter in v11 is named `checkAdmin`, described as "Whether to allow the administrator permission to override", defaulting to `true`.

```diff
- permissions.missingPermissions(['MANAGE_SERVER']);
+ permissions.missing(['MANAGE_SERVER']);
```

#### Permissions#raw

`permissions.raw` has been removed in favor of `permissions.bitfield`.

```diff
- permissions.raw;
+ permissions.bitfield;
```

#### Permissions#resolve

`permissions.resolve()` has been removed entirely.

### Presence

#### Presence#game

`presence.game` has been removed in favor of the `Activity` class. It is now an array of Activities.

```diff
- presence.game;
+ presence.activities;
```

### RichEmbed

The `RichEmbed` class has been removed in favor of the `MessageEmbed` class.

#### RichEmbed#attachFile

`RichEmbed.attachFile()` has been removed in favor of `MessageEmbed.attachFiles()`.

```diff
- new RichEmbed().attachFile('attachment://file-namme.png');
+ new MessageEmbed().attachFiles(['attachment://file-namme.png']);

- new RichEmbed().attachFile({ attachment: './file-name.png' });
+ new MessageEmbed().attachFiles([{ attachment: './file-name.png' }]);

- new RichEmbed().attachFile(new Attachment('./file-name.png'));
+ new MessageEmbed().attachFiles([new MessageAttachment('./file-name.png')]);
```

### RichPresenceAssets

#### RichPresenceAssets#\*\*\*ImageURL

Both properties relating to the rich presence's image URL have been changed to be a method, as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- asset.smallImageURL;
- asset.largeImageURL;
+ asset.smallImageURL();
+ asset.largeImageURL({ format: 'png', size: 1024 });
```

### Role

The properties of a role relating to its position have been renamed.  `role.calculatedPosition` is now `role.position`.  `role.position` is now more clearly named `role.rawPosition` to denote that it's directly from the API without any sorting.

```diff
- role.calculatedPosition;
+ role.position;

- role.position;
+ role.rawPosition;
```

#### Role#hasPermission(s)

`role.hasPermission()` and `role.hasPermissions()` have been removed in favor of `permissions.has()`.

```diff
- role.hasPermission('MANAGE_MESSAGES');
+ role.permissions.has('MANAGE_MESSAGES');
```

```diff
- role.hasPermissions(['MANAGE_MESSAGES', 'MANAGE_SERVER']);
+ role.permissions.has(['MANAGE_MESSAGES', 'MANAGE_SERVER']);
```

#### Role#serialize

`role.serialize()` has been removed as an extraneous helper method.

```diff
- role.serialize();
+ role.permissions.serialize();
```

#### Role#setPosition

The optional, second parameter of the `role.setPosition()` method has been changed to an object; its keys are `relative` (a boolean) and `reason` (a string).

```diff
- role.setPosition(3, true);
+ role.setPosition(3, { relative: true, reason: 'Needed to be higher.' });
```

### Shard

The `death` and `spawn` events for a shard can also include a `Worker` in addition to the `ChildProcess` that was exited or spawned.

#### Shard#args

`shard.args` is now a property of the shard and has been removed as a parameter from the constructor.

#### Shard#respawn

`shard.respawn` now takes a second, optional parameter `spawnTimeout`, how long to wait in milliseconds until the shard's `Client` becomes ready.

#### Shard#spawn

The parameters used in v11 have been removed and replaced with a single, optional parameter, `spawnTimeout`.

### ShardClientUtil

In order to make use of workers introduced in Node v10.5.0, a new `mode` parameter is available in the constructor.

#### ShardClientUtil#id

`shardClientUtil.id` has been removed and replaced with `shardClientUtil.ids`, which is an array of shard IDs of the current client.

#### ShardClientUtil#singleton

`shardCLientUtil` now has a second parameter `mode` to specify whether it's a `process` or `worker`.

### ShardingManager

#### ShardingManger#_spawn

The private method `shardingManager._spawn()` has been removed entirely.

#### ShardingManager#createShard

The `id` parameter is now optional and defaults to `this.shards.size`.

#### ShardingManager#launch

The `shardingManager.launch` event has been removed entirely and replaced with the `shardingManager.shardCreate` event.

#### ShardingManager#message

The `shardingManager.message` event has been removed from this class and is now on the `Shard` class.

#### ShardingManager#respawnAll

The `waitForReady` parameter has been renamed to `spawnTimeout`, and the `currentShardIndex` parameter has been removed entirely.

#### ShardingManager#spawn

A third, optional parameter `spawnTimeout` has been added, specifying how long to wait in miliseconds to wait until the `Client` is ready; the default is `30000`.

### StreamDispatcher

`StreamDispatcher` now extends `WritableStream` from Node, you can see the docs [here](https://nodejs.org/api/stream.html#stream_class_stream_writable).

#### StreamDispatcher#destroyed

`streamDispatcher.destroyed` has been removed entirely.

#### StreamDispatcher#end

The `end` event has been removed. Please use the native `finish` event as documented [here](https://nodejs.org/api/stream.html#stream_event_finish).

The `end` method is now inherited from `WritableStream` as documented [here](https://nodejs.org/api/stream.html#stream_writable_end_chunk_encoding_callback).

#### StreamDispatcher#passes

`streamDispatcher.passes` has been removed entirely.

#### StreamDispatcher#pause

The `streamDispatcher.pause` method now takes an optional parameter `silence`, to specify whether to play silence while paused to prevent audio glitches.  Its value is a `boolean` and defaults to `false`.

```diff
- dispatcher.pause();
+ dispatcher.pause(true);
```

#### StreamDispatcher#stream

The `streamDispatcher.stream` property has been removed entirely and has been replaced with the `streamDispatcher.broadcast` property, which is the broadcast controlling the stream, if any.

#### StreamDispatcher#time

The `streamDispatcher.time` property has been renamed to `streamDispatcher.streamTime`.

### TextChannel

#### TextChannel#acknowledge

Has been removed entirely, along with all other user account-only methods and properties.

#### TextChannel#\*\*\*position

See the [GuildChannel](/additional-info/changes-in-v12.md#guildchannel) section for changes to positions.

#### TextChannel#clone

All parameters have been removed and reconfigured into a single object.

```diff
- channel.clone(undefined, true, false, 'Needed a clone');
+ channel.clone({ name: undefined, reason: 'Needed a clone' });
```

#### TextChannel#createCollector

`textChannel.createCollector()` has been removed entirely in favor of `textChannel.createMessageCollector()`.

See [this section](/additional-info/changes-in-v12.md#messagecollector) for changes to the `MessageCollector` class.

```diff
- channel.createCollector(filterFunction, { maxMatches: 2, max: 10, time: 15000 });
+ channel.createMessageCollector(filterFunction, { max: 2, maxProcessed: 10, time: 15000 });
```

#### TextChannel#createWebhook

The second and third parameters in `textChannel.createWebhook()` have been changed/removed, leaving it with a total of two parameters. The `avatar` and `reason` parameters from v11 have been merged into an object as the second parameter.

```diff
- channel.createWebhook('Snek', 'https://i.imgur.com/mI8XcpG.jpg', 'Needed a cool new Webhook');
+ channel.createWebhook('Snek', { avatar: 'https://i.imgur.com/mI8XcpG.jpg', reason: 'Needed a cool new Webhook' });
```

#### TextChannel#memberPermissions

This method is now private.

#### TextChannel#rolePermissions

This method is now private.

#### TextChannel#search

This method has been removed, along with all other user account-only methods.

#### TextChannel#send\*\*\*

All the `.send***()` methods have been removed in favor of one general `.send()` method.

```diff
- channel.sendMessage('Hey!');
+ channel.send('Hey!');
```

```diff
- channel.sendEmbed(embedVariable);
+ channel.send(embedVariable);
+ channel.send({ embed: embedVariable });
```

::: warning
`channel.send(embedVariable)` will only work if that variable is an instance of the `MessageEmbed` class; object literals won't give you the expected result unless your embed data is inside an `embed` key.
:::

```diff
- channel.sendCode('js', 'const version = 11;');
+ channel.send('const version = 12;', { code: 'js' });
```

```diff
- channel.sendFile('./file.png');
- channel.sendFiles(['./file-one.png', './file-two.png']);
+ channel.send({
+ 	files: [{
+ 		attachment: 'entire/path/to/file.jpg',
+ 		name: 'file.jpg',
+ 	}]
+ channel.send({
+ 	files: ['https://cdn.discordapp.com/icons/222078108977594368/6e1019b3179d71046e463a75915e7244.png?size=2048']
+ });
```

```diff
- channel.sendFiles(['./file-one.png', './file-two.png']);
+ channel.send({ files: [{ attachment: './file-one.png' }, { attachment: './file-two.png' }] });
+ channel.send({ files: [new MessageAttachment('./file-one.png'), new MessageAttachment('./file-two.png')] });
```

#### TextChannel#fetch(Pinned)Message(s)

`channel.fetchMessage()`, `channel.fetchMessages()`, and `channel.fetchPinnedMessages()` were all removed and transformed in the shape of Managers.

```diff
- channel.fetchMessage('123456789012345678');
+ channel.messages.fetch('123456789012345678');
```

```diff
- channel.fetchMessages({ limit: 100 });
+ channel.messages.fetch({ limit: 100 });
```

```diff
- channel.fetchPinnedMessages();
+ channel.messages.fetchPinned();
```

### User

#### User#addFriend

`user.addFriend()` has been removed entirely, along with all other user account-only methods.

#### User#avatarURL

`user.avatarURL` is now a method, as opposed to a property. It also allows you to determine the file format and size to return. If the `dynamic` option is provided you will receive a `.gif` URL if the image is animated, otherwise it will fall back to the specified `format` or its default `.webp` if none is provided.

```diff
- user.avatarURL;
+ user.avatarURL();
+ user.avatarURL({ format: 'png', dynamic: true, size: 1024 });
```

#### User#block

`user.block()` has been removed entirely, along with all other user account-only methods.

#### User#displayAvatarURL

`user.displayAvatarURL` is now a method, as opposed to a property. It also allows you to determine the file format and size to return. If the `dynamic` option is provided you will receive a `.gif` URL if the image is animated, otherwise it will fall back to the specified `format` or its default `.webp` if none is provided.

```diff
- user.displayAvatarURL;
+ user.displayAvatarURL();
+ user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });
```

#### User#fetchProfile

`user.fetchProfile()` has been removed entirely, along with all other user account-only methods.

#### User#note

`user.note` has been removed entirely, along with all other user account-only methods.

#### User#removeFriend

`user.removeFriend()` has been removed entirely, along with all other user account-only methods.

#### User#setNote

`user.setNote()` has been removed entirely, along with all other user account-only methods.

#### User#send\*\*\*

Just like the `textChannel#send***` methods, all the `.send***()` methods have been removed in favor of one general `.send()` method. Read through the [textChannel#send\*\*\*](/additional-info/changes-in-v12.md#channelsend) section for more information.

#### User#unblock

`user.unblock()` has been removed entirely, along with all other user account-only methods.

### UserConnection

The `UserConnection` class has been removed entirely, along with all other user account-only properties.

### UserProfile

The `UserProfile` class has been removed entirely, along with all other user account-only properties.

### VoiceBroadcast

`VoiceBroadcast` now implements `PlayInterface` instead of `VolumeInterface`.

#### VoiceBroadcast#currentTranscoder

This property has been removed entirely.

#### VoiceBroadcast#destroy

This method has been removed entirely.

#### VoiceBroadcast#dispatchers

This property has been renamed to `subscribers` and is no longer read-only.

```diff
- broadcast.dispatchers;
+ broadcast.subscribers;
```

#### VoiceBroadcast#end

This event has been removed from the `VoiceBroadcast` class and is implemented from the `WritableStream` class from Node, which `BroadcastDispatcher` implements.

#### VoiceBroadcast#error

This event has been moved from the `VoiceBroadcast` class to the `BroadcastDispatcher` class.

#### VoiceBroadcast#pause

This method has been moved from the `VoiceBroadcast` class to the `BroadcastDispatcher` class.

#### VoiceBroadcast#play\*\*\*

All `.play***()` methods have been removed and transformed into a single `.play()` method.

#### VoiceBroadcast#prism

This property has been removed entirely.

#### VoiceBroadcast#resume

This method has been moved from the `VoiceBroadcast` class to the `BroadcastDispatcher` class.

#### VoiceBroadcast#warn

This event has been removed entirely.

### VoiceConnection

The `VoiceConnection` class also implements the new `PlayInterface` class in addition to extending `EventEmitter` from Node.

#### VoiceConnection#createReceiver
`voiceconnection.createReceiver()` has been removed, there is now a single receiver that be accessed from `voiceConnection.receiver`

#### VoiceConnection#play\*\*\*

All `connection.play***()` methods have been removed in favor of one, flexible `.play()` method.

#### VoiceConnection#prism

This property has been removed entirely.

#### VoiceConnection#receivers

This property has been removed entirely.

#### VoiceConnection#sendVoiceStateUpdate

This method has been removed entirely.

#### VoiceConnection#set\*\*\*

Both `connection.setSessionID()` and `connection.setTokenAndEndpoint()` have been removed entirely.

### VoiceReceiver

#### VoiceReceiver#create\*\*\*Stream

Both the `receiver.createOpusStream()` and `receiver.createPCMStream()` methods have been condensed into one method, `receiver.createStream()`, which also optionally accepts a `ReceiveStreamOptions` object for the stream.

```diff
- receiver.createOpusStream('123456789012345678');
- receiver.createPCMStream('123456789012345678');
+ receiver.createStream('123456789012345678', { mode: 'opus', end: 'silence' });
```

#### VoiceReceiver#destroy

This method has been removed entirely, refer to `StreamDispatcher#destroy` for documentation.

#### VoiceReceiver#destroyed

This property has been removed entirely.

#### VoiceReceiver#opus

This event has been removed entirely.

#### VoiceReceiver#pcm

This event has been removed entirely.

#### VoiceReceiver#recreate

This method has been removed entirely.

#### VoiceReceiver#voiceConnection

This property has been removed entirely.

#### VoiceReceiver#warn

This event has been removed entirely, use the `receiver.debug` event instead.

### VoiceRegion

#### VoiceRegion#sampleHostname

This property has been removed entirely.

### Webhook

#### Webhook#avatarURL

`webhook.avatarURL` is now a method, as opposed to a property. It also allows you to determine the file format and size to return. If the `dynamic` option is provided you will receive a `.gif` URL if the image is animated, otherwise it will fall back to the specified `format` or its default `.webp` if none is provided.

```diff
- webhook.avatarURL;
+ webhook.avatarURL();
+ webhook.avatarURL({ format: 'png', dynamic: true, size: 1024 });
```

#### Webhook#send\*\*\*

Just like the `TextChannel#send***` methods, all the `.send***()` methods have been removed in favor of one general `.send()` method. Read through the [TextChannel#send\*\*\*](/additional-info/changes-in-v12.md#channelsend) section for more information.

### WebhookClient

The `WebhookClient` class now extends `BaseClient` and implements `Webhook` instead of just extending `Webhook`, so a lot of methods and properties are documented there, as opposed to on the client.

---

## Additions

::: warning
Remember to add examples for the additions.
:::

### Activity

### ActivityFlags

### ActivityOptions

These are options for setting an `Activity`.

### APIMessage

### Base

### BaseClient

### BitField

### BroadcastDispatcher

### CategoryChannel

#### CategoryChannel#members

Similar to `textChannel#members` and `voiceChannel#members`, `categoryChannel#members` returns a `Collection` of `GuildMembers` who can see the category, mapped by their ID.

### Channel

#### Channel#toString

`channel.toString()` was moved from `GuildChannel` to `Channel`.

#### Channel#type

`channel.type` now may also return `unknown`.

### Client

#### Client#clearImmediate

#### Client#guildIntegrationsUpdate

#### Client#invalidated

#### Client#setImmediate

#### Client#webhookUpdate

### ClientApplication

This is a not a new class; it was formerly called `OAuth2Application` in v11.  Changes and deletions to methods and properties are covered above (link needed).  Additions are as follow:

#### ClientApplication#cover(Image)

`ClientApplication.cover` and its associated method `ClientApplication.coverImage()` return the URL to the application's cover image, with optional modifiers if applied in the method.

```js
ClientApplication.coverImage({ width: 1024, height: 1024 });
```

#### ClientApplication#fetchAssets

`ClientApplication.fetchAssests()` returns a promise that resolves into an array of `ClientAsset` objects, each of which contains `id`, `name` and `type` keys.

### ClientOptions

#### ClientOptions#partials

`clientOptions.partials` has been added to allow for partial structures - see the `Partials` section of the guide for more details.

#### ClientOptions#retry

`clientOptions.retry` has been added to allow a maximum amount of reconnect attempts on 5XX errors.

#### ClientOptions#presence

`clientOptions.presence` has been added to specify presence data to set upon login.

### ClientVoiceManager

### Collector

#### Collector#(handle)Dispose

`collector.handleDispose` and `collector.dispose()` have been added to remove an element from the collection.

### CollectorOptions

#### CollectorOptions#dispose

`collectorOptions.dispose` has been added to allow for deleted data to be removed from the collection.

### Manager

The Manager class was added in order to store various data types. Uses include
- RoleManager
- UserManager
- GuildManager
- ChannelManager
- MessageManager
- PresenceManager
- ReactionManager
- GuildEmojiManager
- GuildMemberManager
- GuildChannelManager
- ReactionUserManager
- GuildEmojiRoleManager
- GuildMemberRoleManager

### DiscordAPIError

#### DiscordAPIError#httpStatus

The `DiscordAPIError#httpStatus` has been added with the 4xx status code that the error returns.  See [the MDN docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#Client_error_responses) for more details.

### DMChannel

#### DMChannel#lastMessage

The message object of the last message in the channel, if one was sent.  It is a read-only property.

#### DMChannel#lastPin\*\*\*

Two properties have been added, `dmChannel#lastPinAt` (read-only) and `dmChannel#lastPinStamp`, which returns the Date and timestamp, respectively, of the last pinned message if one is present.

### Guild

#### Guild#createIntegration

`guild.createIntegration()` has been added.

#### Guild#fetchEmbed

`guild.fetchEmbed` has been added.

#### Guild#fetchIntegrations

`guild.fetchIntegrations()` has been added.

#### Guild#fetchVanityCode

`guild.fetchVanityCode()` has been added. 

#### Guild#setEmbed

`guild.setEmbed()` has been added.

#### Guild#shard(ID)

`guild.shard` (read-only) and `guild.shardID` have been added, representing the information of the shard the guild is on.

### GuildAuditLogs

#### GuildAuditLogs#Actions

`auditLogs.Actions()` has been added (static method).

#### GuildAuditLogs#Targets

`auditLogs.Targets()` has been added (static method).

### GuildChannel

#### GuildChannel#createOverwrite

Creates or update an existing overwrite for a user or role.  The second parameter is a `PermissionOverwriteOption` object; the third, optional parameter is `reason`, a string.

```js
channel.createOverwrite(message.author, {
	SEND_MESSAGES: false,
});
```

#### GuildChannel#permissionsLocked

`guildChannel.permissionsLocked` is a boolean value representing if the `permissionOverwrites` of the channel match its parent's `permissionOverwrites`.

#### GuildChannel#updateOverwrite

Creates or update an existing overwrite for a user or role.  The second parameter is a `PermissionOverwriteOption` object; the third, optional parameter is `reason`, a string.

```js
channel.updateOverwrite(message.author, {
	SEND_MESSAGES: false,
});
```

#### GuildChannel#viewable

`guildChannel.viewable` is a boolean value representing whether the channel is visible to the client user.

### HTTPError

### Integration

### Message

#### Message#activity

`message.activity` has been added.

#### Message#application

`message.application` has been added.

#### Message.url

`message.url` has been added in order to provide a URL to jump to the message.

### MessageAttachment

#### MessageAttachment#setAttachment

`attachment.setAttachment()` has been added.

#### MessageAttachment#setFile

`attachment.setFile()` has been added.

#### MessageAttachment#setName

`attachment.setName()` has been added.

### MessageEmbed

#### MessageEmbed#addFields

`MessageEmbed.addFields` has been added to add multiple fields at once (note: Fields have to be passed as EmbedFieldData)

#### MessageEmbed#files

`MessageEmbed.files` has been added as an array of files in the `MessageEmbed`.

#### MessageEmbed#length

`MessageEmbed.length` has been added.  It returns a `number` equal to all of the fields, title, description, and footer.

### Permissions

#### Permissions#flags
`PRIORITY_SPEAKER` has been added.

### PlayInterface

This is a new class to play audio over `VoiceConnection`s and `VoiceBroadcast`s.

### Presence

#### Presence#clientStatus

The new `presence.clientStatus` property returns an object with three keys: `web`, `mobile` and `desktop`; their values are a `PresenceStatus` string.  This property allows you to check which client the member or user is using to access Discord.

#### Presence#guild

`presence.guild` has been added as a helper property to represent the `Guild` the presence belongs to, if applicable.

#### Presence#member

`presence.member` is a read-only property to represent the `GuildMember` the presence belongs to, if applicable.

#### Presence#user(ID)

`presence.user` (read-only) and `presence.userID` are properties to represent a `User` and its ID that the presence belongs to.  The former can be null if the `User` is not cached.

### ReactionCollector

#### ReactionCollector#empty

`reactionCollector.empty()` has been added as a method to remove all collected reactions from the collector.

#### ReactionCollector#key

#### ReactionCollector#remove

The new `remove` event emits when a collected reaction is un-reacted, if the `dispose` option is set to `true`

### Shard

#### Shard#_evals

The private property `_evals` has been added to map ongoing promises for calls to `shard.eval()`.

#### Shard#_fetches

The private property `_fetches` has been added to map ongoing promises for calls to `shard.fetchClientValues()`.

#### Shard#worker

### ShardClientUtil

#### ShardClientUtil#client

#### ShardClientUtil#parentPort

The message port for the master process, if the mode of the `ShardClientUtil` is `worker`.

#### ShardClientUtil#respawnAll

`shardClientUtil.respawnAll()` will request a respawn of all shards.  It has three parameters, all of which are optional: `shardDelay`, how to long to wait in milliseconds between each shard; `respawnDelay`, how long to wait between killing the shard's process or worker and restarting it; and `spawnTimeout`, how long to wait in milliseconds for a shard to become ready before moving to the next shard.

### Speaking

The `Speaking` class has been added as a data structure to interact with the bitfields present when a `GuildMember` is speaking, or in the `VoiceConnection#speaking` event.

### StreamDispatcher

#### StreamDispatcher#bitrateEditable

#### StreamDispatcher#paused\*\*\*

Two new properties have been added, `pausedSince` and `pausedTime`, to represent the timestamp when the stream was paused, and how long it's been paused for in milliseconds, respectively.

#### StreamDispatcher#set\*\*\*

Several new methods have been added to adjust various aspects of the stream.  Methods marked with a \* denote that they're usable only with a compatible Opus stream.

- `setFEC()`\* - whether to forward error correction or not if using a compatible Opus stream
- `setPLP()`\* - sets the expected packet loss percentage if using a compatible Opus stream
- `setVolume()` - sets the volume relative to the input stream
- `setVolumeDecibels()` - sets the volume in decibels
- `setVolumeLogarithmic()` - sets the volume so that a perceived value of `0.5` is half the perceived volume, etc.

#### StreamDispatcher#volumeChange

A new event listener, it is emitted when a volume change in the stream is detected.

```js
dispatcher.on('volumeChange', (oldVolume, newVolume) => {
	console.log(`Volume changed from ${oldVolume} to ${newVolume}.`);
});
```

### TextChannel

#### TextChannel#lastPinTimestamp

`TextChannel.lastPinTimestamp` was added.

#### TextChannel#lastPinAt

`TextChannel.lastPinAt` was added.

### User

#### User#lastMessageChannelID

#### User#locale

`user.locale` has been added.

### Util

#### Util#cleanContent

This new method converts all mentions to their equivalent text.

#### Util#discordSort

This new method sorts a `Collection` by Discord's position and ID.

#### Util#flatten

This new method flattens any object.  Any `Collection`s in the object will be converted to an array of keys.

#### Util#resolveColor

This new method resolves a `ColorResolvable` into a color number.

#### Util#resolveString

THis new method resolves a `StringResolvable` into a string.

#### Util#Constants

#### Constant.Colors
`WHITE` and `YELLOW` have been added as values.

### VoiceBroadcast

#### VoiceBroadcast#dispatcher

This new property represents the master dispatcher - if any - that controls everything played by subscribed dispatchers.

### VoiceChannel

#### VoiceChannel#editable

This new property returns a `boolean` value whether the client can edit the `VoiceChannel` or not, eg. any change to the channel besides moving it via `channel.setPosition()`.  It differs from `channel.manageable` in that it also checks if the client has the `CONNECT` permissions for that particular channel.

### VoiceReceiver

#### VoiceReceiver#debug

This new event is emitted whenever there is a warning and will emit either with an `Error` object or string, depending on what causes it to be emitted.

### VoiceState

### VolumeInterface

#### VolumeInterface#volumeEditable

This new property returns a `boolean` value whether the client can edit the volume of the stream.

### Webhook

#### Webhook#url

This new property returns a `string` representing the URL of the webhook, and is read-only.

### WebSocketManager

This new class represents the manager of the websocket connection for the client.

### WebSocketOptions

#### WebSocketOptions#intents

This new parameter adds support for Intents, controlling which events you receive from Discord. Please refer to our more [detailed article about this topic](/popular-topics/intents)

### WebSocketShard

This new class represents a `Shard`'s websocket connection.
