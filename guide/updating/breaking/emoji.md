---
forceTheme: red
---

# Emoji

`Emoji` now extends `Base` and represent either a `GuildEmoji` or `ReactionEmoji`, and some of the specific properties have moved to their respective object, instead of everything on the base `Emoji` object.

## Emoji#\*\*\*RestrictedRole(s)

The helper methods to add and remove a role or roles from the roles allowed to use the emoji have been removed from `emoji.edit()` and are now set via `guildEmoji.edit()`.

```diff
- emoji.addRestrictedRole('123456789012345678');
- emoji.addRestrictedRoles(['123456789012345678', '098765432109876543']);
- emoji.removeRestrictedRole('1234567890123345678');
- emoji.removedRestrictedRoles(['123456789012345678', '098765432109876543']);
+ emoji.edit({ roles: ['123456789012345678', '098765432109876543'] })
```

## Emoji#deletable

`emoji.deletable` has been moved to `guildEmoji.deletable`.

## Emoji#fetchAuthor

`emoji.fetchAuthor()` has been moved to `guildEmoji.fetchAuthor()`.

## Emoji#guild

`emoji.guild` has been moved to `guildEmoji.guild`.

## Emoji#setName

`emoji.setName()` has been moved to `guildEmoji.setName()`.

