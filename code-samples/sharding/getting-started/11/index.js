const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./bot.js', { token: 'your-token-goes-here' });

manager.spawn();
manager.on('launch', shard => console.log(`Launched shard ${shard.id}`));
