# Gateway Intents

:::warning
For now sending intents is optional, but it will become mandatory as of October 7, 2020!
:::

Gateway Intents were introduced to the library in v12 and allow you to pick which events your bot will receive. Intents are groups of pre-defined events that the discord.js client will conditionally subscribe to. For example, omitting the `DIRECT_MESSAGE_TYPING` intent would prevent the discord.js client from receiving any typing events from direct messages. Intents also enable you to remove unwanted data from polluting your bots cache, however we can not yet explicitly list which unwanted side effects omitting a certain event may have on the internal workings of the library.

<branch version="11.x">

Intents are not available in version 11, please update to version 12 of the library if you want to use gateway intents in your bot.

</branch>

<branch version="12.x">

## Enabling Intents

You can choose which intents you'd like to receive as client options when instantiating your bot client.

A list of all available gateway intents the library supports can be found at [the discord.js documentation](https://discord.js.org/#/docs/main/stable/class/Intents?scrollTo=s-FLAGS). The events included in the respective intents on the [discord API documentation](https://discordapp.com/developers/docs/topics/gateway#list-of-intents).

:::tip
`GUILD_PRESENCES` is required in order to receive the initial GuildMember data. If you do not supply it your member caches will be empty and not updates, even if you do provide `GUILD_MEMBERS`! Before you disable intents think about what your bot does and how not receiving the listed events might prevent it from doing this. Version 12 of discord.js does not yet fully support any combination of intents without loosing seemingly unrelated data.
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

For now you can simply enable these intents in the [Discord Developer Portal](https://discordapp.com/developers/applications) through a toggle. Please note that this is currently in a deprecation period and you will require a whitelisted bot in order to use privileged intents as of October 7, 2020. You can find more information on whitelisting in [this discord support article](https://support.discordapp.com/hc/en-us/articles/360040720412-Bot-Verification-and-Data-Whitelisting)

Should you receive the error `[DISALLOWED_INTENTS]: Privileged intent provided is not enabled or whitelisted` please review your settings for all privileged intents you use. The official documentation for privileged intents can be found on the [discord API documentation](https://discordapp.com/developers/docs/topics/gateway#privileged-intents).

## More on bit fields

Discord permissions are stored in a 53-bit integer and calculated using bitwise operations. If you want to dive deeper into what's happening behind the curtains, check the [Wikipedia](https://en.wikipedia.org/wiki/Bit_field) and [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators) articles on the topic.

In discord.js, permission bit fields are represented as either the decimal value of said bit field or its referenced flags. Every position in a permissions bit field represents one of these flags and its state (either referenced `1` or not referenced `0`).

</branch>
