## Should I Shard?

Before you dive in this section, please ask yourself this question. Sharding is only necessary at 2500 guilds- at that point, Discord will not allow your bot to login. With that in mind, you should consider this when your bot is around 2000 guilds, which should be enough time to get this working. Contrary to popular belief, sharding itself is very simple. It can be complex depending on your bot's needs, however. So, if you meet the 2000 guild requirement, please continue with this guide, otherwise, maybe you should wait a bit! Without further ado, let's get started.

### How does sharding work?
As an application grows large, developers may find it necessary to split their process up to run parallel to one another in order to maximize efficiency. In a much larger scale of things, the developer might notice their process slow down, amongst other problems.
[Sharding with Discord Bots](https://discordapp.com/developers/docs/topics/gateway#sharding)

### Sharding File

First, we need to have a file that we will be launching from now on, rather than your original `index.js` file. I highly reccommend renaming that to `bot.js` and naming this `index.js` instead, as you will not be launching the other file anymore. Copy paste the following snippet into the `index.js` file.

```js
const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./bot.js', { totalShards: "auto", token: 'your token' });
manager.spawn();
manager.on('launch', (shard) => console.log(`Launched shard ${shard.id}`));
```

The above code utilizes discord.js's sharding manager to spawn the recommended amount of shards for your bot. The recommended amount should be approximately 1,000 guilds per shard. When you provide the token here, you will not need to in your `bot.js` file, but you will need to call the login method. So you should have `client.login()` exactly as it appears there.
You can find the methods available for the ShardingManager [here](https://discord.js.org/#/docs/main/master/class/ShardingManager), although you may not be making much use of this section, unlike the next feature we will explore, which you may learn about by clicking [this link](/sharding/basic-changes).
