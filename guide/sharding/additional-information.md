# Additional information

::: tip
This page is a follow-up and bases its code on [the previous page](/sharding/).
:::

Here are some extra topics covered about sharding that might have raised concerns.

## Legend

* `manager` is an instance of `ShardingManager`, e.g. `const manager = new ShardingManager(file, options);`
* `client.shard` refers to the current shard.

## Shard messages

<branch version="11.x">

For shards to communicate, they have to send messages to one another, as they each have another process. You can listen for these messages by adding the following listener in your `index.js` file:

```js
manager.on('message', (shard, message) => {
	console.log(`Shard[${shard.id}] : ${message._eval} : ${message._result}`);
});
```

</branch>
<branch version="12.x">

For shards to communicate, they have to send messages to one another, as they each have another process. You must wait for each shard to finish spawning before you can listen to their events, otherwise `ShardingManager#shards` will be an empty `Collection`. You can listen for these messages on the individual shards by adding the following lines in your `index.js` file:

```js
manager.spawn()
	.then(shards => {
		shards.forEach(shard => {
			shard.on('message', message => {
				console.log(`Shard[${shard.id}] : ${message._eval} : ${message._result}`);
			});
		});
	})
	.catch(console.error);
```

</branch>

As the property names imply, the `_eval` property is what the shard is attempting to evaluate, and the `_result` property is the output of said evaluation. However, these properties are only guaranteed if a _shard_ is sending a message. There will also be an `_error` property, should the evaluation have thrown an error.

You can also send messages via `process.send('hello')`, which would not contain the same information. This is why the `.message` property's type is declared as `*` <docs-link path="class/Shard?scrollTo=e-message">in the discord.js documentation</docs-link>.

## Specific shards

There might be times where you want to target a specific shard. An example would be to kill a specific shard that isn't working as intended. You can achieve this by taking the following snippet (in a command, preferably):

<branch version="11.x">

```js
client.shard.broadcastEval('if (this.shard.id === 0) process.exit();');
```

</branch>
<branch version="12.x">

::: tip
In discord.js v12, <docs-link path="class/ShardClientUtil?scrollTo=ids">`client.shard`</docs-link> can hold multiple ids. If you use the default sharding manager, the `.ids` array will only have one entry.
:::

```js
client.shard.broadcastEval('if (this.shard.ids.includes(0)) process.exit();');
```

</branch>

If you're using something like [PM2](http://pm2.keymetrics.io/) or [Forever](https://github.com/foreverjs/forever), this is an easy way to restart a specific shard. Remember, <docs-link path="class/ShardClientUtil?scrollTo=broadcastEval">Shard#broadcastEval</docs-link> sends a message to **all** shards, so you have to check if it's on the shard you want.

## `ShardingManager#shardArgs` and `ShardingManager#execArgv`

Consider the following example of creating a new `ShardingManager` instance:

```js
const manager = new ShardingManager('./bot.js', {
	execArgv: ['--trace-warnings'],
	shardArgs: ['--ansi', '--color'],
	token: 'your-token-goes-here',
});
```

The `execArgv` property is what you would usually pass to Node without sharding, e.g.:

```
node --trace-warnings bot.js
```

You can find a list of command-line options for Node [here](https://nodejs.org/api/cli.html).

The `shardArgs` property is what you would usually pass to your bot without sharding, e.g.:

```
node bot.js --ansi --color
```

You can access them later as usual via `process.argv`, which contains an array of executables, your main file, and the command-line arguments used to execute the script.

## Eval arguments

There may come the point where you will want to pass functions or arguments from the outer scope into a `.broadcastEval()` call.

```js
client.shard.broadcastEval(`(${funcName})('${arg}')`);
```

In this small snippet, an entire function is passed to the eval. It needs to be encased in parenthesis; it will throw errors on its way there otherwise. Another set of parenthesis is required so that the function gets called. Finally, the passing of the argument itself, which slightly varies, depending on the type of argument you are passing. If it's a string, you must wrap it in quotes, or it will be interpreted as is and will throw a syntax error because it won't be a string by the time it gets there.

Now, what if you wanted to call a function from *within* the client context? That is to say, you are not passing a function. It would look something like this:

```js
client.shard.broadcastEval(`this.${funcName}(${args});`);
```

This would become `client.funcName(args)` once it gets through. This is handy if you, for example, have extended your client object with your class and wish to call some of its methods manually.

### Asynchronous functions

There may be a time when you want to have your shard process an asynchronous function. Here's how you can do that!

<branch version="11.x">

```js
client.shard.broadcastEval(`
	let channel = this.channels.get('id');
	let msg;
	if (channel) {
		msg = channel.fetchMessage('id').then(m => m.id);
	}
	msg;
`);
```

</branch>
<branch version="12.x">

```js
client.shard.broadcastEval(`
	let channel = this.channels.cache.get('id');
	let msg;
	if (channel) {
		msg = channel.messages.fetch('id').then(m => m.id);
	}
	msg;
`);
```

</branch>

This snippet allows you to return fetched messages outside of the `broadcastEval`, letting you know whether or not you were able to retrieve a message, for example. Remember, you aren't able to return entire objects outside. Now, what if we wanted to use `async/await` syntax inside?

<branch version="11.x">

```js
client.shard.broadcastEval(`
	(async () => {
		let channel = this.channels.get('id');
		let msg;
		if (channel) {
			msg = await channel.fetchMessage('id').then(m => m.id);
		}
		return msg;
	})();
`);
```

</branch>
<branch version="12.x">

```js
client.shard.broadcastEval(`
	(async () => {
		let channel = this.channels.cache.get('id');
		let msg;
		if (channel) {
			msg = await channel.messages.fetch('id').then(m => m.id);
		}
		return msg;
	})();
`);
```

</branch>

This example will work the same, but you can produce cleaner code with `async/await`. Additionally, what this does is declare an asynchronous function and then immediately call it. As it is also the last declared line, it is effectively being returned. Remember that you need to `return` an item inside a function one way or another.
