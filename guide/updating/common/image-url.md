---
forceTheme: red
---

# Image URLs

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