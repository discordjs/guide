---
forceTheme: red
---

# Presence#game

`presence.game` has been removed in favor of the `Activity` class.

```diff
- presence.game;
+ presence.activity;
```

# RichPresenceAssets

## RichPresenceAssets#\*\*\*ImageURL

Both properties relating to the rich presence's image URL have been changed to be a method, as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- asset.smallImageURL;
- asset.largeImageURL;
+ asset.smallImageURL();
+ asset.largeImageURL({ format: 'png', size: 1024 });
```