## Basic changes

You will most likely have to change some code in order to get your newly sharded bot to work. If your bot is very basic, then you're in luck! I assume you probably have a `stats` command, by which you can quickly view your bots statistics, such as its server count. In this code, you likely have the snippet `client.guilds.size`, which counts the number of *cached* guilds attached to that client. With sharding, since multiple processes will be launched, each process (each shard) will now have its own subset collection of guilds. This means that your original code will not function as you expect it to. Here is some sample code for a `stats` command, without sharding taken into consideration.

```js
// bot.js
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('message', (message) => {
	if (message.content === 'stats') {
		message.reply(`Server count: ${client.guilds.size}`);
	}
});

client.login('token');
```

Let's say your bot is in a total of 3,600 guilds. With the recommended shard count, you might be in 4 shards, the first 3 containing 1,000 guilds each, and the last one containing the remaining 600. If a guild on a certain shard (shard #2, for example) and it receives this command, the guild count will be 1,000, which is obviously not the "correct" number of guilds for your bot. Likewise, if the message is received on a guild in shard 3, (shards go up from 0 to n), the guild count will be 600, which is still not what you want. "How can I fix this?", you ask? Well, that's why we're here, isn't it?

### BroadcastEval

First, let's take a look at [the most common sharding utility method you'll be using](https://discord.js.org/#/docs/main/stable/class/ShardClientUtil?scrollTo=broadcastEval). This method makes all of the shards evaluate a given script, where `this` is the `client` once each shard gets to evaluating it. You can read more about the `this` keyword [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this). For now, essentially understand that it is the "client".

Now, take the following snippet of code:

```js
client.shard.broadcastEval('this.guilds.size').then(console.log);
```

If you run it, you will notice an output like `[1000, 1000, 1000, 600]`. You will be correct in assuming that that's the total number of guilds per shard, which is stored in an array in the Promise. We can both assume this isn't the ideal output for guild count, so we will need to make use of an array manipulation method - specifically [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce).

It's highly urged for you to visit that link to understand how the method works, as you will probably find great use of it in sharding. Basically, this method (in this case) iterates through the array and adds each current value to the total amount.

```js
client.shard.broadcastEval('this.guilds.size').then(results => {
	console.log(`${results.reduce((prev, val) => prev + val, 0)} total guilds`);
}).catch(console.error);
```

While it's a bit unattractive to have more nesting in your commands, it is necessary when not using `async`/`await` (more info [here](/asyncawait/placeholder)). Now, the code at the top should look something like the below:

```js
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('message', (message) => {
	if (message.content === 'stats') {
		client.shard.broadcastEval('this.guilds.size').then(results => {
			message.reply(`Server count: ${results.reduce((prev, val) => prev + val, 0)}`);
		}).catch(console.error);
	}
});

client.login('token');
```

The next section contains additional changes you might want to take into consideration, which you may learn about by clicking [this link](/sharding/additional).
