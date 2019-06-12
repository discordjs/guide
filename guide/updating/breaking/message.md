---
forceTheme: red
---

# Message

## Message#acknowledge

`message.acknowledge()` has been removed entirely, along with all other user account-only properties and methods.

## Message#clearReactions

`message.clearReactions()` has been transformed in the shape of a DataStore.

```diff
- message.clearReactions();
+ message.reactions.clear();
```

## Message#delete

The first parameter in `message.delete()` has been changed. The `timeout` parameter from v11 have been merged into an object as the first parameter.  In addition, there is now another optional key in the object, `reason`.

```diff
- message.delete(5000);
+ message.delete({ timeout: 5000, reason: 'It had to be done.' });
```

## Message#editCode

In the same sense that the `channel.sendCode()` method was removed, `message.editCode()` has also been removed entirely.

```diff
- message.editCode('js', 'const version = 11;');
+ message.edit('const version = 12;', { code: 'js' });
```

## Message#hit

`message.hit` has been removed entirely, as it was used for user-account only searches.

## Message#is(Member)Mentioned

`message.isMentioned()` and `message.isMemberMentioned()` have been removed in favor of `message.mentions.has()`.

```diff
- message.isMentioned('123456789012345678');
- message.isMemberMentioned('123456789012345678');
+ message.mentions.has('123456789012345678');
```

## Message#member

`message.member` is now read-only.