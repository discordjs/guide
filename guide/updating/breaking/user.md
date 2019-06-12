---
forceTheme: red
---

# User

## User#addFriend

`user.addFriend()` has been removed entirely, along with all other user account-only methods.

## User#avatarURL

`user.avatarURL` is now a method, as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- user.avatarURL;
+ user.avatarURL();
+ user.avatarURL({ format: 'png', size: 1024 });
```

## User#block

`user.block()` has been removed entirely, along with all other user account-only methods.

## User#displayAvatarURL

`user.displayAvatarURL` is now a method, as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- user.displayAvatarURL;
+ user.displayAvatarURL();
+ user.displayAvatarURL({ format: 'png', size: 1024 });
```

## User#fetchProfile

`user.fetchProfile()` has been removed entirely, along with all other user account-only methods.

## User#note

`user.note` has been removed entirely, along with all other user account-only methods.

## User#removeFriend

`user.removeFriend()` has been removed entirely, along with all other user account-only methods.

## User#setNote

`user.setNote()` has been removed entirely, along with all other user account-only methods.

## User#send\*\*\*

Just like the `textChannel#send***` methods, all the `.send***()` methods have been removed in favor of one general `.send()` method. Read through the [textChannel#send\*\*\*](/additional-info/changes-in-v12.md#channelsend) section for more information.

## User#unblock

`user.unblock()` has been removed entirely, along with all other user account-only methods.

## UserConnection

The `UserConnection` class has been removed entirely, along with all other user account-only properties.

## UserProfile

The `UserProfile` class has been removed entirely, along with all other user account-only properties.

# UserConnection

The `UserConnection` class has been removed entirely, along with all other user account-only properties.

# UserProfile

The `UserProfile` class has been removed entirely, along with all other user account-only properties.
