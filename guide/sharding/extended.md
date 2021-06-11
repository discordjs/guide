## Extended changes

::: tip
This page is a follow-up and bases its code on [the previous page](/sharding/additional-information.md), which assumes knowledge of arguments and passing functions.
:::

### Sending messages across shards

Let's start with the basic usage of shards. At some point in bot development, you might have wanted to send a message to another channel, which may or may not necessarily be on the same guild, which means it may or may not be on the same shard. To achieve this, you will need to go back to your friend `.broadcastEval()` and try every shard for the desired channel. Suppose you have the following code in your `message` event:

<branch version="11.x">

```js {3-11}
client.on('message', message => {
	// ...
	if (command === 'send') {
		if (!args.length) return message.reply('please specify a destination channel id.');

		const channel = client.channels.get(args[0]);
		if (!channel) return message.reply('I could not find such a channel.');

		channel.send('Hello!');
		return message.reply(`I have sent a message to channel \`${args[0]}\`!`);
	}
});
```

</branch>
<branch version="12.x">

```js {3-11}
client.on('message', message => {
	// ...
	if (command === 'send') {
		if (!args.length) return message.reply('please specify a destination channel id.');

		const channel = client.channels.cache.get(args[0]);
		if (!channel) return message.reply('I could not find such a channel.');

		channel.send('Hello!');
		return message.reply(`I have sent a message to channel \`${args[0]}\`!`);
	}
});
```

</branch>

This will never work for a channel that lies on another shard. So, let's remedy this.

<branch version="11.x">

```js {4-13}
if (command === 'send') {
	if (!args.length) return message.reply('please specify a destination channel id.');

	return client.shard.broadcastEval(`
		const channel = this.channels.get('${args[0]}');
		if (channel) {
			channel.send('This is a message from shard ${this.shard.id}!');
			true;
		} else {
			false;
		}
	`)
		.then(console.log);
}
```

</branch>
<branch version="12.x">

::: tip
In discord.js v12, <docs-link path="class/ShardClientUtil?scrollTo=ids">`client.shard`</docs-link> can hold multiple ids. If you use the default sharding manager, the `.ids` array will only have one entry.
:::

```js {4-13}
if (command === 'send') {
	if (!args.length) return message.reply('please specify a destination channel id.');

	return client.shard.broadcastEval(`
		const channel = this.channels.cache.get('${args[0]}');
		if (channel) {
			channel.send('This is a message from shard ${this.shard.ids.join(',')}!');
			true;
		} else {
			false;
		}
	`)
		.then(console.log);
}
```

</branch>

If all is well, you should notice an output like `[false, true, false, false]`. If it is not clear why `true` and `false` are hanging around, the last expression of the eval statement will be returned. You will want this if you want any feedback from the results. Now that you have observed said results, you can adjust the command to give yourself proper feedback, like so:

```js {4-10}
return client.shard.broadcastEval(`
	// ...
`)
	.then(sentArray => {
		// Search for a non falsy value before providing feedback
		if (!sentArray.includes(true)) {
			return message.reply('I could not find such a channel.');
		}
		return message.reply(`I have sent a message to channel \`${args[0]}\`!`);
	});
```

And that's it for this section! You have successfully communicated across all of your shards.

### Using functions continued

If you remember, there was a brief mention of passing functions through `.broadcastEval()`, but no super clear description of exactly how to go about it. Well, fret not, for this section will cover it! Suppose you have the following code in your `message` event:

<branch version="11.x">

```js {3-8}
client.on('message', message => {
	// ...
	if (command === 'emoji') {
		if (!args.length) return message.reply('please specify an emoji id to search for.');
		const emoji = client.emojis.get(args[0]);

		return message.reply(`I have found an emoji ${emoji}!`);
	}
});
```

</branch>
<branch version="12.x">

```js {3-8}
client.on('message', message => {
	// ...
	if (command === 'emoji') {
		if (!args.length) return message.reply('please specify an emoji id to search for.');
		const emoji = client.emojis.cache.get(args[0]);

		return message.reply(`I have found an emoji ${emoji}!`);
	}
});
```

</branch>

The aforementioned code will essentially search through <branch version="11.x" inline>`client.emojis`</branch><branch version="12.x" inline>`client.emojis.cache`</branch> for the provided id, which will be given with `args[0]`. However, with sharding, you might notice it doesn't search through all the client's emojis. As mentioned in an earlier section of this guide, the different shards partition the client and its cache. Emojis derive from guilds meaning each shard will have the emojis from all guilds for that shard. The solution is to use `.broadcastEval()` to search all the shards for the desired emoji. However, in the interest of providing an example of using functions, you will use one here. Consider that when something evaluates, it runs in the `client` context, which means `this` represents the current client for that shard.

Let's start with a basic function, which will try to grab an emoji from the current client and return it.

<branch version="11.x">

```js
function findEmoji(nameOrID) {
	return this.emojis.get(query) || this.emojis.find(e => e.name.toLowerCase() === nameOrID.toLowerCase());
}
```

</branch>
<branch version="12.x">

```js
function findEmoji(nameOrID) {
	return this.emojis.cache.get(nameOrID) || this.emojis.cache.find(e => e.name.toLowerCase() === nameOrID.toLowerCase());
}
```

</branch>

Next, you need to call the function in your command properly. If you recall from [this section](/sharding/additional-information.md#eval-arguments), it is shown there how to pass a function and arguments correctly. `.call()` will also be used to preserve the `client` context in the function that passes through.

```js {4-7}
client.on('message', message => {
	// ...
	if (command === 'emoji') {
		if (!args.length) return message.reply('please specify an emoji id to search for.');

		return client.shard.broadcastEval(`(${findEmoji}).call(this, '${args[0]}')`)
			.then(console.log);
	}
});
```

::: tip
If you are unsure as to what `.call()` does, you may read up on it [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call).
:::

Now, run this code, and you will surely get a result that looks like the following:

<!-- eslint-skip  -->

```js
[
	{ 
		guild: { 
			members: {},
			// ...
			id: '222078108977594368',
			name: 'discord.js Official',
			icon: '6e4b4d1a0c7187f9fd5d4976c50ac96e',
			// ...
			emojis: {} 
		},
		id: '383735055509356544',
		name: 'duckSmug',
		requiresColons: true,
		managed: false,
		animated: false,
		_roles: []
	}
]
```

While this result isn't *necessarily* bad or incorrect, it's simply a raw object that got `JSON.parse()`'d and `JSON.stringify()`'d over, so all of the circular references are gone. More importantly, The object is no longer a true <branch version="11.x" inline>`Emoji`</branch><branch version="12.x" inline>`GuildEmoji`</branch> object as provided by discord.js. *This means none of the convenience methods usually provided to you are available.* If this is a problem for you, you will want to handle the item *inside* the `broadcastEval`. Conveniently, the `findEmoji` function will be ran inside it, so you should execute your relevant methods there, before the object leaves the context.

<branch version="11.x">

```js {2-3,5-6}
function findEmoji(nameOrID) {
	const emoji = this.emojis.get(nameOrID) || this.emojis.find(e => e.name.toLowerCase() === nameOrID.toLowerCase());
	if (!emoji) return null;
	// If you wanted to delete the emoji with discord.js, this is where you would do it. Otherwise, don't include this code.
	emoji.delete();
	return emoji;
}
```

</branch>

<branch version="12.x">

```js {2-3,5-6}
function findEmoji(nameOrID) {
	const emoji = this.emojis.cache.get(nameOrID) || this.emojis.cache.find(e => e.name.toLowerCase() === nameOrID.toLowerCase());
	if (!emoji) return null;
	// If you wanted to delete the emoji with discord.js, this is where you would do it. Otherwise, don't include this code.
	emoji.delete();
	return emoji;
}
```

</branch>

With all that said and done, usually you'll want to display the result, so here is how you can go about doing that:

<branch version="11.x">

```js {2-7}
return client.shard.broadcastEval(`(${findEmoji}).call(this, '${args[0]}')`)
	.then(emojiArray => {
		// Locate a non falsy result, which will be the emoji in question
		const foundEmoji = emojiArray.find(emoji => emoji);
		if (!foundEmoji) return message.reply('I could not find such an emoji.');
		return message.reply(`I have found the ${foundEmoji.id ? `<${foundEmoji.animated ? 'a' : ''}:${foundEmoji.name}:${foundEmoji.id}>` : foundEmoji.name} emoji!`);
	});
```

</branch>
<branch version="12.x">

```js {2-7}
return client.shard.broadcastEval(`(${findEmoji}).call(this, '${args[0]}')`)
	.then(emojiArray => {
		// Locate a non falsy result, which will be the emoji in question
		const foundEmoji = emojiArray.find(emoji => emoji);
		if (!foundEmoji) return message.reply('I could not find such an emoji.');
		return message.reply(`I have found the ${foundEmoji.animated ? `<${foundEmoji.identifier}>` : `<:${foundEmoji.identifier}> emoji!`}!`);
	});
```

</branch>

And that's all! The emoji should have pretty-printed in a message, as you'd expect.

## Resulting code

<resulting-code />
