## Extended changes

::: tip
This page is a follow-up and bases its code off of [the previous page](/sharding/additional-information.md), which assumes knowledge of arguments and passing functions.
:::

### Sending messages across shards

Let's start off with a basic usage with shards. At some point in bot development, you might have wanted to send a message to another channel, which may or may not necessarily be on the same guild, which means it may or may not be on the same shard. To remedy this, you will need to go back to your friend `.broadcastEval()` and try every shard for the desired channel. Suppose you have the following code in your `message` event:

<branch version="11.x">

```js
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

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

```js
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

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

```diff
	if (command === 'send') {
		if (!args.length) return message.reply('please specify a destination channel id.');

-		const channel = client.channels.get(args[0]);
-		if (!channel) return message.reply('I could not find such a channel.');

-		channel.send('Hello!');
-		return message.reply(`I have sent a message to channel \`${args[0]}\`!`);
+		return client.shard.broadcastEval(`
+			const channel = this.channels.get('${args[0]}');
+			if (channel) {
+				channel.send('This is a message from shard ${this.shard.id}!');
+				true;
+			}
+			else {
+				false;
+			}
+		`)
+			.then(console.log);
	}
```

</branch>
<branch version="12.x">

```diff
	if (command === 'send') {
		if (!args.length) return message.reply('please specify a destination channel id.');

-		const channel = client.channels.cache.get(args[0]);
-		if (!channel) return message.reply('I could not find such a channel.');

-		channel.send('Hello!');
-		return message.reply(`I have sent a message to channel \`${args[0]}\`!`);
+		return client.shard.broadcastEval(`
+			const channel = this.channels.cache.get('${args[0]}');
+			if (channel) {
+				channel.send('This is a message from shard ${this.shard.id}!');
+				true;
+			}
+			else {
+				false;
+			}
+		`)
+			.then(console.log);
	}
```

</branch>

If all is well, then you should notice an output like the following: `[false, true, false, false]`. If it is not clear why `true` and `false` are hanging around, it's because the last expression of the eval statement is what will be returned. You will want this if you want any feedback in the results. Now that you have observed said results, you can adjust the command to give yourself proper feedback, like so:

<branch version="11.x">

```diff
	return client.shard.broadcastEval(`
		const channel = this.channels.get('${args[0]}');
		if (channel) {
			channel.send('This is a message from shard ${this.shard.id}!');
			true;
		}
		else {
			false;
		}
	`)
-		.then(console.log);
+		.then(sentArray => {
+			// Search for a non falsy value before providing feedback
+			if (!sentArray.includes(true)) {
+				return message.reply('I could not find such a channel.');
+			}

+			return message.reply(`I have sent a message to channel \`${args[0]}\`!`);
+		});
```

</branch>
<branch version="12.x">

```diff
	return client.shard.broadcastEval(`
		const channel = this.channels.cache.get('${args[0]}');
		if (channel) {
			channel.send('This is a message from shard ${this.shard.id}!');
			true;
		}
		else {
			false;
		}
	`)
-		.then(console.log);
+		.then(sentArray => {
+			// Search for a non falsy value before providing feedback
+			if (!sentArray.includes(true)) {
+				return message.reply('I could not find such a channel.');
+			}

+			return message.reply(`I have sent a message to channel \`${args[0]}\`!`);
+		});
```

</branch>

And that's it for this section! You have successfully communicated across all of your shards.

### Using functions continued

If you remember, there was a brief mention of passing functions through `.broadcastEval()`, but no super clear description of exactly how to go about it. Well, fret not, for it will be covered in this section! Suppose you have the following code in your `message` event:

<branch version="11.x">

```js
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'emoji') {
		if (!args.length) return message.reply('please specify an emoji id to search for.');
		const emoji = client.emojis.get(args[0]);

		return message.reply(`I have found an emoji ${emoji}!`);
	}
});
```

</branch>
<branch version="12.x">

```js
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'emoji') {
		if (!args.length) return message.reply('please specify an emoji id to search for.');
		const emoji = client.emojis.cache.get(args[0]);

		return message.reply(`I have found an emoji ${emoji}!`);
	}
});
```

</branch>

The aforementioned code will essentially search through <branch version="11.x" inline>`client.emojis`</branch><branch version="12.x" inline>`client.emojis.cache`</branch> for the provided id, which will be given with `args[0]`. However, with sharding, you might notice it doesn't search through all the emojis the client actually has. As mentioned in an earlier section of this guide, this is due to the client being split up into different shards, so each shard has its own cache. Emojis are derived from guilds, so each shard will have the emojis from all of the guilds for that shard. The solution is to use `.broadcastEval()` to search all the shards for the desired emoji. However, in the interest of providing an example on using functions, you will make use of one here. Consider that when something is evaluated, it is ran in the context of the `client`, which means `this` represents the current client for that shard.

Let's start off with an extremely basic function, which will try to grab an emoji from the current client and return it.

<branch version="11.x">

```js
function findEmoji(id) {
	const emoji = this.emojis.get(id);
	if (!emoji) return null;
	return emoji;
}
```

</branch>
<branch version="12.x">

```js
function findEmoji(id) {
	const emoji = this.emojis.cache.get(id);
	if (!emoji) return null;
	return emoji;
}
```

</branch>

Next, you need to properly call the function in your command. If you recall from [this section](/sharding/additional-information.md#eval-arguments), it is shown there how to pass a function and arguments correctly. `.call()` will also be used in order to preserve the `client` context in the function that is passed through.

```js
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

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
[ { guild:
     { members: {},
       // ...
       id: '222078108977594368',
       name: 'Discord.js Official',
       icon: '6e4b4d1a0c7187f9fd5d4976c50ac96e',
       // ...
       emojis: {} },
    id: '383735055509356544',
    name: 'duckSmug',
    requiresColons: true,
    managed: false,
    animated: false,
    _roles: [] } ]
```

While this result isnt *necessarily* bad or incorrect, it's simply a raw object that got `JSON.parse()`'d and `JSON.stringify()`'d over, so all of the circular references are gone. More importantly, The object is no longer a true <branch version="11.x" inline>`Emoji`</branch><branch version="12.x" inline>`GuildEmoji`</branch> object as provided by discord.js. This means none of the convenience methods usually provided to you are available. If this is not a concern to you, then you can effectively skip the rest of this section. However, this is a tutorial, so it should be covered regardless! Let's remedy this issue, shall we?

<branch version="11.x">

```diff
function findEmoji(id) {
-	const emoji = this.emojis.get(id);	
+	const temp = this.emojis.get(id);
-	if (!emoji) return null;
+	if (!temp) return null;
+
+	// Clone the object because it is modified right after, so as to not affect the cache in client.emojis
+	const emoji = Object.assign({}, temp);
+	// Circular references can't be returned outside of eval, so change it to the id
+	if (emoji.guild) emoji.guild = emoji.guild.id;
+	// A new object will be construted, so simulate raw data by adding this property back
+	emoji.require_colons = emoji.requiresColons;
+
	return emoji;
}
```

</branch>
<branch version="12.x">

```diff
function findEmoji(id) {
-	const emoji = this.emojis.cache.get(id);	
+	const temp = this.emojis.cache.get(id);
-	if (!emoji) return null;
+	if (!temp) return null;
+
+	// Clone the object because it is modified right after, so as to not affect the cache in client.emojis
+	const emoji = Object.assign({}, temp);
+	// Circular references can't be returned outside of eval, so change it to the id
+	if (emoji.guild) emoji.guild = emoji.guild.id;
+	// A new object will be construted, so simulate raw data by adding this property back
+	emoji.require_colons = emoji.requiresColons;
+
	return emoji;
}
```

</branch>

Now, you will want to make use of it in the actual command:

<branch version="11.x">

```diff
	return client.shard.broadcastEval(`(${findEmoji}).call(this, '${args[0]}')`)
-		.then(console.log);
+		.then(emojiArray => {
+			// Locate a non falsy result, which will be the emoji in question
+			const foundEmoji = emojiArray.find(emoji => emoji);
+			if (!foundEmoji) return message.reply('I could not find such an emoji.');
+
+			// Acquire a guild that can be reconstructed with discord.js
+			return client.rest.makeRequest('get', Discord.Constants.Endpoints.Guild(foundEmoji.guild).toString(), true)
+					.then(raw => {
+						// Reconstruct a guild
+						const guild = new Discord.Guild(client, raw);
+						// Reconstruct an emoji object as required by discord.js
+						const emoji = new Discord.Emoji(guild, foundEmoji);
+						return message.reply(`I have found an emoji ${emoji.toString()}!`);
+					});
+		});
```

</branch>
<branch version="12.x">

```diff
	return client.shard.broadcastEval(`(${findEmoji}).call(this, '${args[0]}')`)
-		.then(console.log);
+		.then(emojiArray => {
+			// Locate a non falsy result, which will be the emoji in question
+			const foundEmoji = emojiArray.find(emoji => emoji);
+			if (!foundEmoji) return message.reply('I could not find such an emoji.');
+
+			// Acquire a guild that can be reconstructed with discord.js
+			return client.api.guilds(foundEmoji.guild).get()
+					.then(raw => {
+						// Reconstruct a guild
+						const guild = new Discord.Guild(client, raw);
+						// Reconstruct an emoji object as required by discord.js
+						const emoji = new Discord.GuildEmoji(client, foundEmoji, guild);
+						return message.reply(`I have found an emoji ${emoji.toString()}!`);
+					});
+		});
```

</branch>

And that's all! The emoji should have pretty-printed in a message as you'd expect.

## Resulting code

<resulting-code />
