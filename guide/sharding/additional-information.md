## Additional changes

Here are some extra topics covered about sharding that you might have concerns about.

### Client#Shard

You should know this one from reading the guide up until this point, but just to make sure, `<client>.shard` is a reference to an instance of [ShardClientUtil](https://discord.js.org/#/docs/main/stable/class/ShardClientUtil).

### Shard messages

In order for shards to communicate, they must send messages to one another, as they are each their own process. You can listen for these messages by adding the following listener in your `index.js` file:

```js
manager.on('message', (shard, message) => console.log(`Shard[${shard.id}]:${message._eval}:${message._result}`));
```

As the property names would imply, the `_eval` property would be what the shard is attempting to calculate, and the `_result` property would be the output of said calculation. However, these properties are only guaranteed if a _shard_ is sending a message. There will also be an `_error` property, should the calculation have encountered an error.

You can also send messages via `process.send('hello')`, which would not contain the same information. This is why, in the discord.js documentation, you see a `*` for the message type.

### Specific shards

Sometimes you might want to target a specific shard, for various reasons. One of those reasons might be to reboot a specific shard that decided it didn't want to be a shard anymore. You can do this by taking the following snippet (in a command, preferably):

```js
client.shard.broadcastEval('if (this.shard.id === 0) { process.exit() }');
```

This code snippet will ask the first shard (0) to restart. Remember, [Shard#BroadcastEval](https://discord.js.org/#/docs/main/stable/class/ShardClientUtil?scrollTo=broadcastEval) sends a message to **all** shards, so you have to check if it's on the shard you want.

### shardArgs

Take the following code snippet for example, with some _shardArgs_ passed to it.

```js
const manager = new ShardingManager('./bot.js', { shardArgs: ['--ansi', '--color', '--trace-warnings'], token });
```

The shardArgs are what you would normally pass if you ran your bot without sharding, like so: `node bot.js --ansi --color --trace-warnings`, and are available in `process.argv`, which contain an array of command line arguments used to execute the script.

### Eval Arguments

There may come a point where you will want to pass functions or arguments from the outer scope into a broadcastEval.

```js
client.shard.broadcastEval(`(${funcName})('${arg}')`)
```

In this small snippet, I am passing an entire function through the eval, and it needs to be encased in parenthesis otherwise it will throw errors on its way there. Another set of parenthesis is needed so the function actually *gets called*. Finally, the passing of the argument itself, which varies slightly depending on what type of argument you are passing. If it's a string, you must wrap it in quotes, otherwise it will be interpreted as is and throw a syntax error, because it won't be a string by the time it gets there.
Now, what if you wanted to call a function from *within* the client context? That is to say, you are not passing a function. It would look something like this:

```js
client.shard.broadcastEval(`this.${funcName}(${args});`);
```

Looks a bit weird, for sure. At the end of the day, this would become `client.funcName(args)` once it gets through. This is handy if you have extended your client object with your own class and wish to call some of its methods manually.

## Online Examples

Here are some popular examples if you still need more resources.

* [SNEK's Google Bot](https://github.com/devsnek/googlebot)
* [WeebDev's Listen.moe](https://github.com/LISTEN-moe/discord-bot)
