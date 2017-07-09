## Basic changes

You will most likely have to change some code in order to get your newly sharded bot to work. If your bot is very basic, then you are in luck. My guess is that you probably have a `stats` command by which to quickly view the statistics of your bot, such as **server count**. In this code, you likely have the snippet `<client>.guilds.size`, which counts the number of *cached* guilds attached to that client. With sharding, since multiple processes will be launched (each shard), each process will now have its own subset collection of guilds, which means that original code will not function as you expect it to. Here is some sample code for a `stats` command, without sharding taken into consideration.

```js
// bot.js
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('message', (message) => {
  if (message.content === 'stats') {
    return message.reply(`Server count: ${client.guilds.size}`);
  }
});

client.login();
```

Let's say your bot is in a total of 3600 guilds. With the recommended shard count, you might be in 4 shards, the first 3 containing 1,000 guilds each,a nd the last one containing the remaining 600. If a guild on a certain shard, let's say, shard 2, and it receives this command. The guild count will be 1,000, which is obviously not the "correct" number of guilds for your bot. Likewise, if the message is received on a guild in shard 3, (shards go up from 0 to n), the guild count will be 600, which is still not what you want. How can I fix this, you ask? Well, that's why we're here, isn't it?
First, let's take a look at the [most common sharding utility method we will be using](https://discord.js.org/#/docs/main/stable/class/ShardClientUtil?scrollTo=broadcastEval). This method makes all of the shards evaluate a given script, where `this` is the `client` once each shard gets to evaluating it. Read more about `this` [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this). For now, essentially understand that it is the "client".
Now, take the following snippet of code, `client.shard.broadcastEval('this.guilds.size').then(console.log)`, if you run it, you will notice an output like `[1000, 1000, 1000, 600]`. You will be correct in assuming thats the total guilds per shard, which is stored in an array in the promise resolve. We can both assume this isn't the ideal output for guild count, so we will need to make use of an array manipulation method, [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce). I highly urge you to visit that link to understand how the method works, as you will probably find great use of it in sharding. Basically this method, in this case, iterates through the array and adds each current value to the total amount.

```js
client.shard.broadcastEval('this.guilds.size').then(results => {
  console.log(`${results.reduce((prev, val) => prev + val, 0)} total guilds`);
}).catch(console.error);

```

While it's indeed ugly to have more nesting in your commands, its necessary without async await (more info [here](/asyncawait/placeholder)). Now, the code at the top should look something like the below:

```js
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('message', (message) => {
  if (message.content === 'stats') {
    return client.shard.broadcastEval('this.guilds.size').then(results => {
      message.reply(`Server count: ${results.reduce((prev, val) => prev + val, 0)}`);
    }).catch(console.error);
  }
});

client.login();
```
