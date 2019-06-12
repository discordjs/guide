---
forceTheme: red
---

# Roles

The `GuildMember.roles` Collection has been changed to a DataStore in v12, so a lot of the associated methods for interacting with a member's roles have changed as well.  They're no longer on the GuildMember object itself, but instead now on the `GuildMemberRoleStore` DataStore.

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

In addition, the GuildMember properties related to roles have also been moved to the `GuildMemberRoleStore` DataStore.

```diff
- guildMember.colorRole;
+ guildMember.roles.color;

- guildMember.highestRole;
+ guildMember.roles.highest;

- guildMember.hoistRole;
+ guildMember.roles.hoist;
```