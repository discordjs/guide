const { SapphireClient } = require('@sapphire/framework');

const client = new SapphireClient({ intents: ['GUILDS', 'GUILD_MESSAGES'] });

client.login('your-token-goes-here');
