# Using client values in commands

This one is easy. If you want any value from the client object, normally, you'd do this:

```js
client.guilds.size;
```

However, in Commando, you have to use `this` to get these values.

```js
this.client.guilds.size;
```

It's really that simple!
