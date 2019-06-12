---
forceTheme: red
---

# GuildChannel

The properties of a channel relating to its position have been renamed.  `guildChannel.calculatedPosition` is now `guildChannel.position`.  `guildChannel.position` is now more clearly named `guildChannel.rawPosition` to denote that it's directly from the API without any sorting.

```diff
- channel.calculatedPosition;
+ channel.position;

- channel.position;
+ channel.rawPosition;
```

## GuildChannel#clone

The first, second, third, and fourth parameters in `channel.clone()` have been changed/removed, leaving it with a total of one parameter. The `name`, `withPermissions`, `withTopic`, and `reason` parameters from v11 have been merged into an object as the first parameter.  Several other parameters have also been added to the options object.

## GuildChannel#createInvite

The second parameter in `channel.createInvite()` has been removed, leaving it with a total of one parameter. The `reason` parameter from v11 have been merged into an object as the first parameter.

```diff
- channel.createInvite({ temporary: true }, 'Just testing');
+ channel.createInvite({ temporary: true, reason: 'Just testing' });
```

## GuildChannel#members

`guildChannel.members` has been removed from `guildChannel.members` and added to `textChannel.members` and `voiceChannel.members`.

## GuildChannel#messageNotifications

`guildChannel.messageNotifications` has been removed entirely, along with all other user account-only properties.

## GuildChannel#muted

`guildChannel.muted` has been removed entirely, along with all other user account-only properties.

## GuildChannel#\*\*\*Permissions

`guildChannel.memberPermissions` and `guildChannel.rolePermissions` are now private.

## GuildChannel#replacePermissionOverwrites

`guildChannel.replacePermissionOverwrites` has been removed entirely.

## GuildChannel#setPosition

The second parameter in `channel.setPosition()` has been changed. The `relative` parameter from v11 has been merged into an object.

```diff
- channel.setPosition(10, true);
+ channel.setPosition(10, { relative: true, reason: 'Basic organization' });
```
