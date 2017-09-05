## Additional Changes

Here are some extra topics covered about sharding that you might have concerns about.

### Client#Shard
You should know this one from reading the guide up until this point, but just to make sure, `<client>.shard` is a reference to an instance of [ShardClientUtil]('https://discord.js.org/#/docs/main/stable/class/ShardClientUtil').

### Shard Messages
In order for shards to communicate, they must send messages to one another, as they are each their own process. You can listen for these messages by adding the following listener in your `main.js` file:
```js
manager.on('message', (shard, message) => console.log(`Shard[${shard.id}]:${message._eval}:${message._result}`));
```
As the property names would imply, the `_eval` property would be what the shard is attempting to calculate, and the `_result` property would be the output of said calculation. However, these properties are only guaranteed if a _shard_ is sending a message. There will also be an `_error` property, should the calculation have encountered an error.
You can also send messages via `process.send('hello')`, which would not contain the same information. This is why, in the Discord.js documentation, you see a `*` for the message type.


### Specific Shards
Sometimes you might want to target a specific shard, for various reasons. One of those reasons might be to reboot a specific shard that decided it didn't want to be a shard anymore. You can do this by taking the following snippet (in a command, preferably):
```js
message.client.shard.broadcastEval('if (this.shard.id === 0) { process.exit() }');
```
This code snippet will ask the first shard (0) to restart. Remember, [Shard#BroadcastEval](https://discord.js.org/#/docs/main/stable/class/ShardClientUtil?scrollTo=broadcastEval) sends a message to **all** shards, so you have to check if it's on the shard you want.

### ShardArgs
Take the following code snippet for example, with some _shardArgs_ passed to it.
```js
const manager = new ShardingManager('./bot.js', { shardArgs: ['--ansi', '--color', '--trace-warnings'], token });
```
The shardArgs are what you would normally pass if you ran your bot without sharding, like so: `node bot.js --ansi --color --trace-warnings`, and are available in `process.argv`, which contain an array of command line arguments used to execute the script.


## Online Examples
Here are some popular examples if you still need more resources.
* [SNEK's Google Bot](https://github.com/devsnek/googlebot)
* [WeebDev's Listen.moe](https://github.com/WeebDev/Listen.moe-Discord)
