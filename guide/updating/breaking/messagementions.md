---
forceTheme: red
---

# MessageMentions

## MessageMentions#has

`mentions.has()` has been added, replacing `message.isMentioned()` and `message.isMemberMentioned()`.  It has two paramets: the first is `data` representing a `User`, `GuildMember`, `Role`, or `GuildChannel` and an optional `options` object.

```diff
- message.isMentioned('123456789012345678');
- message.isMemberMentioned('123456789012345678');
+ message.mentions.has('123456789012345678');
+ message.mentions.has('123456789012345678', { ignoreDirect: true, ignoreRoles: true, ignoreEveryone: true });
```