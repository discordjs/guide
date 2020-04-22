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

Permissable gateway intents include:
- `GUILDS` - Events from this intent include:
  - `guildCreate`
  - `guildDelete`
  - `roleCreate`
  - `roleUpdate`
  - `roleDelete`
  - `channelCreate` (within guilds)
  - `channelUpdate` (within guilds)
  - `channelDelete` (within guilds)
  - `channelPinsUpdate` (within guilds)
- `GUILD_MEMBERS`¹ - Events from this intent include:
  - `guildMemberAdd`
  - `guildMemberUpdate`
  - `guildMemberRemove`
- `GUILD_BANS` - Events from this intent include:
  - `guildBanAdd`
  - `guildBanRemove`
- `GUILD_EMOJIS` - Events from this intent include:
  - `emojiUpdate`
- `GUILD_INTEGRATIONS` - Events from this intent include:
  - `guildIntegrationsUpdate`
- `GUILD_WEBHOOKS` - Events from this intent include:
  - `webhookUpdate`
- `GUILD_INVITES` - Events from this intent include:
  - `inviteCreate`
  - `inviteDelete`
- `GUILD_VOICE_STATES` - Events from this intent include:
  - `voiceStateUpdate`
- `GUILD_PRESENCES`¹ - Events from this intent include (within guilds):
  - `presenceUpdate`
- `GUILD_MESSAGES` - Events from this intent include:
  - `message`
  - `messageUpdate`
  - `messageDelete`
- `GUILD_MESSAGE_REACTIONS` - Events from this intent include (within guilds):
  - `messageReactionAdd`
  - `messageReactionRemove`
  - `messageReactionRemoveAll`
  - `messageActionRemoveEmoji`
- `GUILD_MESSAGE_TYPING` - Events from this intent include (within guilds):
  - `typingStart`
- `DIRECT_MESSAGES` - Events from this intent include (within DMs):
  - `channelCreate`
  - `message`
  - `channelUpdate`
  - `channelDelete`
  - `channelPinsUpdate`
- `DIRECT_MESSAGE_REACTIONS` - Events from this intent include (within DMs):
  - `messageReactionAdd`
  - `messageReactionRemove`
  - `messageReactionRemoveAll`
  - `messageActionRemoveEmoji`
- `DIRECT_MESSAGE_TYPING` - Events from this intent include (within DMs):
  - `typingStart`
¹privileged intent (see [Privileged Intents](#privileged-intents))

:::danger
At the time of writing (2020/03/23), discord.js does not set default intents, which could potentially break things.
See [this](https://github.com/discordjs/discord.js/issues/3924) issue for more information.
:::

:::tip
Make sure you enable all intents you need for your use case! If you miss one, the corresponding events do not get emitted. For example, If you miss the `GUILDS` intent, your bot won't receive the `guildCreate` event, which is crucial if you implement per-guild command prefixes and create a new database entry when the bot is added to new guilds. If you miss the `GUILD_MESSAGES` intent, your client won't receive messages sent within guilds.
:::

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
