---
forceTheme: red
---

# Guild

## Guild#acknowledge

`guild.acknowledge()` has been removed entirely, along with all other user account-only properties and methods.

## Guild#allowDMs

`guild.allowDMs()` has been removed entirely, along with all other user account-only properties and methods.

## Guild#ban

`guild.ban()` has been moved to the `GuildMemberStore`.  In addition, the second parameter in `guild.members.ban()` has been changed. The `options` parameter no longer accepts a number, nor a string.

```diff
- guild.ban(user, 7);
+ guild.members.ban(user, { days: 7 });

- guild.ban(user, 'Too much trolling');
+ guild.members.ban(user, { reason: 'Too much trolling' });
```

## Guild#Channels

`guild.channels` is now a DataStore instead of a Collection.

## Guild#createChannel

`guild.createChannel()` has been transformed in the shape of a DataStore.  The second, third and fourth parameters in `guild.createChannel()` have been changed/removed, leaving it with a total of two parameters, the second one being an object with all of the options available in `ChannelData`.

```diff
- guild.createChannel('new-channel', 'text', permissionOverwriteArray, 'New channel added for fun!');
+ guild.channels.create('new-channel', 'text', { overwrites: permissionOverwriteArray, reason: 'New channel added for fun!' });
```

## Guild#createEmoji

`guild.createEmoji()` has been transformed in the shape of a DataStore.  The third and fourth parameters in `guild.createEmoji()` have been changed/removed, leaving it with a total of three parameters. The `roles` and `reason` parameters from v11 have been merged into an object as the third parameter.

```diff
- guild.createEmoji('./path/to/file.png', 'NewEmoji', collectionOfRoles, 'New emoji added for fun!');
+ guild.emojis.create('./path/to/file.png', 'NewEmoji', { roles: collectionOfRoles, reason: 'New emoji added for fun!' });
```

## Guild#createRole

`guild.createRole()` has been transformed in the shape of a DataStore.  The first and second parameters in `guild.createRole()` have been changed/removed, leaving it with a total of one parameter. The `data` and `reason` parameters from v11 have been moved into an object as the first parameter.

```diff
- guild.createRole(roleData, 'New staff role!');
+ guild.roles.create({ data: roleData, reason: 'New staff role!' });
```

## Guild#deleteEmoji

`Guild.deleteEmoji()` has been removed and transformed in the shape of a DataStore. Note the possible use of `resolve()` as a broader alternative to `get()`.

```diff
- guild.deleteEmoji('123456789012345678');
+ guild.emojis.resolve('123456789012345678').delete();
```

## Guild#defaultChannel

Unfortunately, "default" channels don't exist in Discord anymore, and as such, the `guild.defaultChannel` property has been removed with no alternative.

**Q:** "I previously had a welcome message system (or something similar) set up using that property. What can I do now?"

**A:** There are a few ways to tackle this. Using the example of a welcome message system, you can:

1. Set up a database table to store the channel ID in a column when someone uses a `!welcome-channel #channel-name` command, for example. Then inside the `guildMemberAdd` event, use `client.channels.get('id')` and send a message to that channel. This is the most reliable method and gives server staff freedom to rename the channel as they please.
2. Make a new command that creates a `welcome-messages` channel, use `guild.channels.find(channel => channel.name === 'welcome-messages')`, and send a message to that channel. This method will work fine in most cases, but will break if someone on that server decides to rename the channel. This may also give you unexpected results, due to Discord allowing multiple channels to have the same name.

<p class="tip">Not sure how to set up a database? Check out [this page](/sequelize/)!</p>

## Guild#emojis

`guild.emojis` has been transformed in the shape of a DataStore.

## Guild#fetchBans

`guild.fetchBans()` will return a `Collection` of objects in v12, whereas v11 would return a `Collection` of `User` objects.

```diff
- guild.fetchBans().then(bans => console.log(`${bans.first().tag} was banned`));
+ guild.fetchBans().then(bans => console.log(`${bans.first().user.tag} was banned because "${bans.first().reason}"`));
```

## Guild#fetchMember(s)

`guild.fetchMember()` and `guild.fetchMembers()` were both removed and transformed in the shape of DataStores. In addition, `guild.members.fetch()` will return a `Collection` of `GuildMember` objects in v12, whereas v11 would return a `Guild` object.

```diff
- guild.fetchMember('123456789012345678');
+ guild.members.fetch('123456789012345678');
```

```diff
- guild.fetchMembers();
+ guild.members.fetch();
```

## Guild#iconURL

`guild.iconURL` is now a method, as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- guild.iconURL;
+ guild.iconURL();
+ guild.iconURL({ format: 'png', size: 1024 });
```

## Guild#messageNotifications

`guild.messageNotifications` has been removed entirely, along with all other user account-only properties and methods.

## Guild#mobilePush

`guild.mobilePush` has been removed entirely, along with all other user account-only properties and methods.

## Guild#muted

`guild.muted` has been removed entirely, along with all other user account-only properties and methods.

## Guild#position

`guild.position` has been removed entirely, along with all other user account-only properties and methods.

## Guild#presences

`guild.presences` is now a DataStore instead of a Collection.

## Guild#pruneMembers

`guild.pruneMembers()` has been transformed in the shape of a DataStore.  In addition, the first, second, and third parameters in the method have been changed or removed, leaving it with a total of one parameter. The `days`, `dry`, and `reason` parameters from v11 have been merged into an object as the first parameter.

```diff
- guild.pruneMembers(7, true, 'Scheduled pruning');
+ guild.members.prune({ days: 7, dry: true, reason: 'Scheduled pruning' });
```

## Guild#roles

`guild.roles` is now a DataStore instead of a Collection.

## Guild#search

`guild.search()` has been removed entirely, along with all other user account-only properties and methods.

## Guild#setChannelPosition

`guild.setChannelPosition()` has been removed entirely. As an alternative, you can use `channel.setPosition()`, or `guild.setChannelPositions()`, which accepts accepts the same form of data as `guild.setChannelPosition` but inside an array.

```diff
- guild.setChannelPosition({ channel: '123456789012345678', position: 1 });
+ guild.setChannelPositions([{ channel: '123456789012345678', position: 1 }]);
+ channel.setPosition(1);
```

## Guild#setPosition

`guild.setPosition()` has been removed entirely, along with all other user account-only properties and methods.

## Guild#setRolePosition

`guild.setRolePosition()` has been removed entirely as an extraneous helper method. As an alternative, you can use `role.setPosition()`.

```diff
- guild.setRolePosition({ role: '123456789012345678', position: 1 });
+ role.setPosition(1);
```

## Guild#splashURL

`guild.splashURL` is now a method, as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- guild.splashURL;
+ guild.splashURL();
+ guild.splashURL({ format: 'png', size: 1024 });
```

## Guild#suppressEveryone

`guild.suppressEveryone` has been removed entirely, along with all other user account-only properties and methods.

## Guild#sync

`guild.sync()` has been removed entirely, along with all other user account-only properties and methods.

## Guild#unban

`guild.unban()` has been transformed in the shape of a DataStore and is now a method on `GuildMemberStore`.  In addition, it also now optionally accepts a string as a second parameter for `reason`.

```diff
- guild.unban('123456789012345678');
+ guild.members.unban('123456789012345678', 'Ban appealed.');