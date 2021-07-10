# Using client values in commands

This one is easy. If you want any value from the client object, normally, you'd do this:

```javascript
client.guilds.cache.size;
```

However, in Commando, you have to use `this` to get these values.

```javascript
this.client.guilds.cache.size;
```

It's that simple!

