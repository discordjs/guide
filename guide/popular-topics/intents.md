# Gateway Intents

<branch version="11.x">

Intents are not available in version 11; please update to version 12 of the library if you want to use gateway intents in your application.

</branch>
<branch version="12.x">

::: warning
Version 13 of Discord.js will require you to choose intents (as it uses a new version of Discord's API), it's worthwhile reading this section even if you don't currently want to update, so you know what to do later.
:::

Discord introduced gateway intents so developers can choose which events their application receives. Intents are named groups of pre-defined WebSocket events, which the discord.js client will receive.

## Enabling Intents

You can find an up-to-date list of all available intents on the [Discord Developer Documention](https://discord.com/developers/docs/topics/gateway#list-of-intents) in the following format:

```
INTENT_NAME (0 << 0)
	- EVENT_NAME
	- OTHER_EVENT_NAME
```

If you want to listen to `'eventName'` or `'otherEventName'` in discord.js you need to supply `INTENT_NAME` (`0 << 0` is the bit representation for this intent).

Take a look at your event handlers (like `client.on('message', ...)`, `client.on('inviteCreate', ...)`) and figure out which intent corresponds to each event. Note that discord.js event names follow the lowerCamelCase convention, while discord uses MACRO_CASE for WebSocket events. Discord.js also emits both `MESSAGE_CREATE` for direct and guild messages in the `'message'` client event.

In the case of `'message'` for guilds you will find `MESSAGE_CREATE` to be listed under the `GUILD_MESSAGES` intent and so on. After you found all intents, provide them to the Client constructor as shown below:

```js
const { Client } = require('discord.js');
const client = new Client({ ws: { intents: ['GUILDS', 'GUILD_MESSAGES'] } });
```

::: warning
Note that discord.js relies heavily on caching to provide its functionality. Some methods that seem unrelated might stop working if certain events do not arrive.

Please make sure to provide the list of gateway intents and partials you use in your Client constructor when asking for support on our [Discord server](https://discord.gg/djs) or [GitHub repository](https://github.com/discordjs/discord.js).
:::

## Privileged Intents

Discord defines some intents as "privileged" due to the data's sensitive nature. If your application is not verified and its bot is in less than 100 guilds, you can enable privileged gateway intents in the [Discord Developer Portal](https://discord.com/developers/applications) under "Privileged Gateway Intents" in the "Bot" section. If your application is already verified or is about to [require verification](https://support.discord.com/hc/en-us/articles/360040720412), you need to request privileged intents. You can do this in your verification application or by reaching out to Discord's [support team](https://dis.gd/contact), including an explanation as to why you require access to each privileged intent.

Before storming off and doing so, you should stop and carefully think about if you need these events. Discord made them opt-in so users across the platform can enjoy a higher level of [privacy](https://en.wikipedia.org/wiki/Privacy_by_design). Presences can expose quite a bit of personal information through games and online times, for example. You might find it sufficient for your application to have a little less information about all guild members at all times, considering you still get the command author as GuildMember from the command execution message and can fetch targets separately.

### Error: Disallowed Intents

Should you receive an error prefixed with `[DISALLOWED_INTENTS]`, please review your developer dashboard settings for all privileged intents you use. This topic's official documentation is on the [Discord API documentation](https://discord.com/developers/docs/topics/gateway#privileged-intents).

### Problems in version 12

`GUILD_MEMBERS`
- The client events `"guildMemberAdd"`, `"guildMemberRemove"`, `"guildMemberUpdate"` do not emit
- <docs-link branch="stable" path="class/Guild?scrollTo=memberCount">`Guild#memberCount`</docs-link> returns the member count as of ready
- Fetching members times out

`GUILD_PRESENCES`
- Member caches are empty *(or only have very few entries)*
- User cache is empty *(or has only very few entries)*
- All members appear to be offline

## The Intents Bitfield

Discord.js provides a utility structure <docs-link path="class/Intents">`Intents`</docs-link> which you can use to modify bitfields easily.

You can use the `.add()` and `.remove()` methods to add or remove flags (Intent string literals representing a certain bit) and modify the bitfield. You can provide single flags as well as an array or bitfield. To use a set of intents as a template you can pass it to the constructor. Note that the empty constructor `new Intents()` creates an empty Intents instance, representing no intents or the bitfield `0`:

```js
const { Client, Intents } = require('discord.js');
const myIntents = new Intents();
myIntents.add('GUILD_PRESENCES', 'GUILD_MEMBERS');

const client = new Client({ ws: { intents: myIntents } });

// other examples:

const otherIntents = new Intents(['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES']);
otherIntents.remove(['DIRECT_MESSAGES', 'GUILD_MESSAGES']);

const otherIntents2 = new Intents(32509);
otherIntents2.remove(4096, 512);
```

If you want to view the built flags you can utilize the `.toArray()` and `.serialize()` methods. The first returns an array of flags represented in this bitfield, the second an object mapping all possible flag values to a boolean, based on their representation in this bitfield.

## More on Bitfields

Discord Intents and Permissions are stored in a 53-bit integer and calculated using bitwise operations. If you want to dive deeper into what's happening behind the curtains, check the [Wikipedia](https://en.wikipedia.org/wiki/Bit_field) and [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators) articles on the topic.

In discord.js, Permissions and Intents bitfields are represented as either the decimal value of said bit field or its referenced flags. Every position in a permissions bitfield represents one of these flags and its state (either referenced `1` or not referenced `0`).

</branch>
