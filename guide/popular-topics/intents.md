# Gateway Intents

:::warning
For now sending intents is optional, but it will become mandatory as of October 7, 2020!
:::

<branch version="11.x">

Intents are not available in version 11, please update to version 12 of the library if you want to use gateway intents in your bot.

</branch>

<branch version="12.x">

## Enabling Intents

You can choose which intents you'd like to receive as client options when instantiating your bot client.

A list of all available gateway intents the library supports can be found at [the discord.js documentation](https://discord.js.org/#/docs/main/stable/class/Intents?scrollTo=s-FLAGS). The events included in the respective events on the [discord API documentation](https://discordapp.com/developers/docs/topics/gateway#list-of-intents).

:::tip
`GUILD_PRESENCES` is required in order to receive the initial GuildMember data. If you do not supply it your member caches will be empty and not updates, even if you do provide `GUILD_MEMBERS`! Before you disable intents think about what your bot does and how not receiving the listed events might prevent it from doing this. Version 12 of discord.js does not yet fully support any combination of intents without loosing seemingly unrelated data.
:::

```js
const { Client } = require('discord.js');
const client = new Client({ ws: { intents: ['GUILDS', 'GUILD_MESSAGES'] } });
```

### Privileged Intents

Discord defines some intents as "privileged" due to the sensitive nature of the data.
Intents above marked with an asterisk signify a privileged intent (`GUILD_PRESENCES` and `GUILD_MEMBERS`).

To receive privileged intents, you must first go to your application in the [Developer Portal](https://discordapp.com/developers/applications) and enable the toggle for the Privileged Intents you wish to use.

</branch>
