## Should I shard?

Before you dive in this section, please ask yourself this question. Sharding is only necessary at 2500 guilds - at that point, Discord will not allow your bot to login. With that in mind, you should consider this when your bot is around 2000 guilds, which should be enough time to get this working. Contrary to popular belief, sharding itself is very simple. It can be complex depending on your bot's needs, however. So, if you meet the 2000 guild requirement, please continue with this guide, otherwise, maybe you should wait a bit! Without further ado, let's get started.

### How does sharding work?

As an application grows large, developers may find it necessary to split their process up to run parallel to one another in order to maximize efficiency. In a much larger scale of things, the developer might notice their process slow down, amongst other problems.
[Sharding with Discord Bots](https://discordapp.com/developers/docs/topics/gateway#sharding)

### Sharding file

First, you'll need to have a file that you'll be launching from now on, rather than your original `index.js` file. It's highly recommended renaming that to `bot.js` and naming this new file to `index.js` instead. Copy & paste the following snippet into your new `index.js` file.

```js
const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./bot.js', { totalShards: 'auto', token: 'your-token-goes-here' });
manager.spawn();
manager.on('launch', (shard) => console.log(`Launched shard ${shard.id}`));
```

The above code utilizes discord.js's sharding manager to spawn the recommended amount of shards for your bot. The recommended amount should be approximately 1,000 guilds per shard. Even though you provide the token here, you will still need to send it over to the main bot file in `client.login()`, so don't forget to do that.

<p class="tip">You can find the methods available for the ShardingManager class [here](https://discord.js.org/#/docs/main/master/class/ShardingManager). Though, you may not be making much use of this section, unlike the next feature we will explore, which you may learn about by clicking [this link](/sharding/basic-changes).</p>

### Getting started

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

While it's a bit unattractive to have more nesting in your commands, it is necessary when not using `async`/`await`. Now, the code at the top should look something like the below:

```js
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('message', (message) => {
	if (message.content === 'stats') {
		client.shard.broadcastEval('this.guilds.size').then(results => {
			message.reply(`server count: ${results.reduce((prev, val) => prev + val, 0)}`);
		}).catch(console.error);
	}
});

client.login('token');
```

The next section contains additional changes you might want to take into consideration, which you may learn about by clicking [this link](/sharding/additional-information).

## Resulting code

If you want to compare your code to the code we've constructed so far, you can review it over on the GitHub repository [here](https://github.com/Danktuary/Making-Bots-with-Discord.js/tree/master/code_samples/sharding/getting-started).
