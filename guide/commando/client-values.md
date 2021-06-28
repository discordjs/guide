---
pageTheme: blue
---

# Using client values in commands

This one is easy. If you want any value from the client object, normally, you'd do this:

```js
client.guilds.cache.size;
```

However, in Commando, you have to use `this` to get these values.

```js
this.client.guilds.cache.size;
```

It's that simple!
