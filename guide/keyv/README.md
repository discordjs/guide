# Storing data with Keyv

[Keyv](https://github.com/lukechilds/keyv) is a simple key-value store that works with multiple backends. It's fully scalable for [sharding](/sharding/) and supports JSON storage.

## Installation

```bash
npm install --save keyv
```

Keyv requires an additional package depending on which persistent backend you would prefer to use. If you want to keep everything in memory, you can skip this part. Otherwise, install one of the below.

```bash
npm install --save @keyv/redis
npm install --save @keyv/mongo
npm install --save @keyv/sqlite
npm install --save @keyv/postgres
npm install --save @keyv/mysql
```

Now that Keyv and any necessary drivers are installed, create an instance of Keyv.

<!-- eslint-skip -->
```js
const Keyv = require('keyv');

// One of the following
const keyv = new Keyv(); // for in-memory storage
const keyv = new Keyv('redis://user:pass@localhost:6379');
const keyv = new Keyv('mongodb://user:pass@localhost:27017/dbname');
const keyv = new Keyv('sqlite://path/to/database.sqlite');
const keyv = new Keyv('postgresql://user:pass@localhost:5432/dbname');
const keyv = new Keyv('mysql://user:pass@localhost:3306/dbname');
```

Make sure to handle connection errors.

```js
keyv.on('error', err => console.error('Keyv connection error:', err));
```

For more detailed setup, check out the [Keyv readme](https://github.com/lukechilds/keyv/blob/master/README.md).

## Usage

Keyv exposes a familiar [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)-like API. However, it only has `set`, `get`, `delete`, and `clear` methods. Additionally, instead of immediately returning data, these methods return [Promises](/additional-info/async-await.md) that resolve with the data.

```js
(async () => {
	// true
	await keyv.set('foo', 'bar');

	// bar
	await keyv.get('foo');

	// undefined
	await keyv.clear();

	// undefined
	await keyv.get('foo');
})();
```

## Application

Although Keyv can be used in any scenario where you need key-value data, we will focus on setting up a per-guild prefix configuration using Sqlite.

::: tip
This section will still work with any provider supported by Keyv. We recommend PostgreSQL for larger applications.
:::

### Setup

```js
const Discord = require('discord.js');
const Keyv = require('keyv');

const client = new Discord.Client();
const prefixes = new Keyv('sqlite://path/to.sqlite');
const globalPrefix = '.';
```

### Command handler

This guide uses a very basic command handler with some added complexity to allow for multiple prefixes. For a more robust command handler, look at the [command handling](/command-handling/) guide.

```js
client.on('message', async message => {
	if (message.author.bot) return;

	let args;
	// handle messages in a guild
	if (message.guild) {
		let prefix;

		if (message.content.startsWith(globalPrefix)) {
			prefix = globalPrefix;
		} else {
			// check the guild-level prefix
			const guildPrefix = await prefixes.get(message.guild.id);
			if (message.content.startsWith(guildPrefix)) prefix = guildPrefix;
		}

		// if we found a prefix, setup args; otherwise, this isn't a command
		if (!prefix) return;
		args = message.content.slice(prefix.length).split(/\s+/);
	} else {
		// handle DMs
		const slice = message.content.startsWith(globalPrefix) ? globalPrefix.length : 0;
		args = message.content.slice(slice).split(/\s+/);
	}

	// get the first space-delimited argument after the prefix as the command
	const command = args.shift().toLowerCase();
});
```

### Prefix command

Now that you have a command handler, make a command to allow people to use your prefix system.

<!-- eslint-skip -->
```js
if (command === 'prefix') {
	// if there's at least one argument, set the prefix
	if (args.length) {
		await prefixes.set(message.guild.id, args[0]);
		return message.channel.send(`Successfully set prefix to \`${args[0]}\``);
	}

	return message.channel.send(`Prefix is \`${await prefixes.get(message.guild.id) || globalPrefix}\``);
}
```

You will probably want to setup additional validation such as required permissions and maximum prefix length.

### Usage

<div is="discord-messages">
	<discord-message author="User" avatar="djs">
		.prefix
	</discord-message>
	<discord-message author="Tutorial Bot" :bot="true">
		Prefix is `.`
	</discord-message>
	<discord-message author="User" avatar="djs">
		.prefix $
	</discord-message>
	<discord-message author="Tutorial Bot" :bot="true">
		Successfully set prefix to `$`
	</discord-message>
	<discord-message author="User" avatar="djs">
		$prefix
	</discord-message>
	<discord-message author="Tutorial Bot" :bot="true">
		Prefix is `$`
	</discord-message>
</div>

## Next steps

Keyv can be used in a variety of other applications, such as guild settings; simply create another instance with a different [namespace](https://github.com/lukechilds/keyv#namespaces) for each setting. Additionally, it can be [extended](https://github.com/lukechilds/keyv#third-party-storage-adapters) to work with whatever storage backend you prefer.

Check out the [Keyv repository](https://github.com/lukechilds/keyv) for more information.

## Resulting code

<resulting-code />
