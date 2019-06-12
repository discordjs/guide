---
forceTheme: red
---

# Ban and Unban

The method to ban members and users have been moved to the `GuildMemberStore` Data Store.

```diff
- guildMember.ban();
- guild.ban('123456789012345678');
+ guild.members.ban('123456789012345678');

- guild.unban('123456789012345678');
+ guild.members.unban('123456789012345678');
```