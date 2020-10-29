# Gateway Intents
:::danger
The high volume of requests regarding recent API changes have made a change necessary here. This is a makeshift placeholder based around current knowledge until we can invest resources to properly rewrite the section on intents.

We are sorry for any confusion or inconvenience our previous explanations might have caused for developers and discord staff! We are doing our best to update information as it becomes available.
:::

:::warning

**Privileged intents and what they mean for you** </br>
**❯ If you are on version 11 or earlier**  </br>
• Update. We no longer provide support for or add features and bug fixes to version 11.  </br> </br>

**❯ Which intents are privileged, which do I need?**  </br>
• `GUILD_MEMBERS` | `guildMemberAdd`, `guildMemberRemove`, `guildMemberUpdate`  </br>
• `GUILD_PRESENCES` | `presenceUpdate`, knowledge about peoples activities and client status  </br>
• If your bot does not need this information to provide its functionality, please do not request it.  </br> </br>

**❯ How can I do things without these events?**  </br>
• Try to design your commands so they do not require this information  </br>
• Fetch member data by ID as you need it `<Guild>.members.fetch("id")`  </br>
• You have `GUILD_MEMBERS`: consider fetching members periodically, for the initial operation on boot you can consider using the client option `fetchAllMembers` (note: this will heavily increase memory usage)  </br> </br>

**❯ A) Your bot is verified**  </br>
• You need to reach out to discord support `R3` in order for intents to be enabled  </br>
• Please include a use case sample as to why you need that intent into your request  </br>
• Read `R1`, it explains the whole procedure and requirements  </br> </br>

**❯ B) Your bot is not verified**  </br>
• You can switch the intent toggles in the developer dashboard's "bot" section `R2`  </br>
• You should still consider designing your commands to not require privileged intents where ever possible  </br> </br>

**❯ Symptoms you might be experiencing right now:**  </br>
• member caches are empty *(or only have very few entries)*  </br>
• user cache is empty *(or has only very few entries)*  </br>
• fetching members times out  </br>
• all members appear to be offline  </br>
• login times out if you try to fetch all members on startup  </br>
• The client events `"guildMemberAdd"`, `"guildMemberRemove"`, `"guildMemberUpdate"` do not emit  </br>
• `Guild#memberCount` returns count as of ready  </br> </br>

**❯ Resources**  </br> 
• `R1` Discords FAQ: <https://dis.gd/gwupdate>  </br>
• `R2` Discord Developer Portal: <https://discord.com/developers/applications>  </br>
• `R3` Discord Support: <https://dis.gd/contact>

:::

<!--
:::warning
As of October 7th 2020, the privileged intents `GUILD_PRESENCES` and `GUILD_MEMBERS` must be enabled for your bot application in the Developer Portal if you wish to continue receiving them. For bots in 100+ servers, enabling these intents will require verification. 

v12 of the library uses Discord API v6, which does not require intents to be specified when connecting to Discord. Specifying intents will be required when the library moves to API v8 in the next major release.
:::

Gateway Intents were introduced to the library in v12 and allow you to pick which events your bot will receive. Intents are groups of pre-defined events that the discord.js client will conditionally subscribe to. For example, omitting the `DIRECT_MESSAGE_TYPING` intent would prevent the discord.js client from receiving any typing events from direct messages. Intents also enable you to remove unwanted data from polluting your bot's cache, however we can not yet explicitly list which unwanted side effects omitting a certain event may have on the internal workings of the library.

<branch version="11.x">

Intents are not available in version 11, please update to version 12 of the library if you want to use gateway intents in your bot.

</branch>

<branch version="12.x">

## Enabling Intents

You can choose which intents you'd like to receive as client options when instantiating your bot client.

A list of all available gateway intents the library supports can be found at [the discord.js documentation](https://discord.js.org/#/docs/main/stable/class/Intents?scrollTo=s-FLAGS). The events included in the respective intents on the [discord API documentation](https://discord.com/developers/docs/topics/gateway#list-of-intents).

:::tip
`GUILD_PRESENCES` is required in order to receive the initial GuildMember data when your bot connects to Discord. If you do not supply it, your member caches will start empty. `guildMemberUpdate` events will not be processed, regardless of if the `GUILD_MEMBER` partial is enabled, unless the `GuildMember` has been cached by other means such as by sending a message, being mentioned in one, or the `guildMemberAdd` event. Before you disable intents think about what your bot does and how not receiving the listed events might prevent it from doing this. Version 12 of discord.js may not function as expected when specific intents are not provided.
:::

```js
const { Client } = require('discord.js');
const client = new Client({ ws: { intents: ['GUILDS', 'GUILD_MESSAGES'] } });
```

## The Intents bit field wrapper

Discord.js provides a utility structure [`Intents`](https://discord.js.org/#/docs/main/stable/class/Intents) which can be utilized to easily adapt the underlying bit field.

We also provide static fields for all, privileged and non-privileged intents. You can provide these as-is or pass them to the Intents constructor to further modify to your needs.

```js
const { Client, Intents } = require('discord.js');
const client = new Client({ ws: { intents: Intents.ALL } });
```

The other static bits can be accessed likewise via `Intents.PRIVILEGED` and `Intents.NON_PRIVILEGED`.

You can use the `.add()` and `.remove()` methods to add or remove flags to modify the bit field. Since discord.js uses a spread operator for the provided arguments you can provide single flags as well as an array or bit field. To use a set of intents as template you can pass them to the constructor. A few approaches are demonstrated below:

```js
const { Client, Intents } = require('discord.js');
const myIntents = new Intents();
myIntents.add('GUILD_PRESENCES', 'GUILD_MEMBERS');

const client = new Client({ ws: { intents: myIntents } });

// more examples of manipulating the bit field

const otherIntents = new Intents(Intents.NON_PRIVILEGED);
otherIntents.remove(['GUILDS', 'GUILD_MESSAGES']);

const otherIntents2 = new Intents(32509);
otherIntents2.remove(1, 512);
```

If you want to view the built flags you can utilize the `.toArray()`, `.serialize()` and `.missing()`  methods. The first returns an array of flags represented in this bit field, the second an object mapping all possible flag values to a boolean, based on it they are represented in this bit field. The third can be used to view the flags not represented in this bit field (you use it by passing a bit field of specific intents to check against).

## Privileged Intents

Discord defines some intents as "privileged" due to the sensitive nature of the data sent through the affected events.
At the time of writing this article privileged intents are `GUILD_PRESENCES` and `GUILD_MEMBERS`

You can enable privileged gateway intents in the [Discord Developer Portal](https://discord.com/developers/applications) under "Privileged Gateway Intents" in the "Bot" section.

Note that access to these special intents needs to be requested during the [verification process](https://support.discord.com/hc/en-us/articles/360040720412) discord requires for bots in 100 or more guilds.

Should you receive an error prefixed with `[DISALLOWED_INTENTS]` please review your settings for all privileged intents you use. The official documentation for this topic can be found on the [discord API documentation](https://discord.com/developers/docs/topics/gateway#privileged-intents).

## More on bit fields

Discord permissions are stored in a 53-bit integer and calculated using bitwise operations. If you want to dive deeper into what's happening behind the curtains, check the [Wikipedia](https://en.wikipedia.org/wiki/Bit_field) and [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators) articles on the topic.

In discord.js, permission bit fields are represented as either the decimal value of said bit field or its referenced flags. Every position in a permissions bit field represents one of these flags and its state (either referenced `1` or not referenced `0`).

</branch>
-->
