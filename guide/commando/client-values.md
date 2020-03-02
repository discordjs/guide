---
forceTheme: blue
---

# Using client values in commands

This one is easy. If you want any value from the client object, normally, you'd do this:

<branch version="11.x">

```js
client.guilds.size;
```

</branch>
<branch version="12.x">

```js
client.guilds.cache.size;
```

</branch>

However, in Commando, you have to use `this` to get these values.

<branch version="11.x">

```js
this.client.guilds.size;
```

</branch>
<branch version="12.x">

```js
this.client.guilds.cache.size;
```

</branch>

It's really that simple!
