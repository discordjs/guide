# Cache customization

Sometimes, you might want to customize the caching behavior of discord.js in order to reduce memory usage.
There are two ways within discord.js to do this:

1. Limiting the size of caches.
2. Periodically removing old items from caches.

::: danger
Customization of caching behavior is an advanced topic.
It is very easy to introduce errors if your custom cache is not working as expected.
:::

## Limiting caches

When creating a new <DocsLink path="class/Client"/>, you can use the `makeCache` option to limit the size of caches that are particular to certain managers.
Generally speaking, almost all your customizations can be done via the helper functions from the <DocsLink path="class/Options"/> module.

Below are the default settings, which will limit the message cache to 200 items.

```js
const { Client, Options } = require('discord.js');

const client = new Client({
	makeCache: Options.cacheWithLimits(Options.DefaultMakeCacheSettings),
});
```

To change the cache behaviors for a type of manager, add it on top of the default settings. For example, you can make caches for reactions limited to 0 items i.e. the client won't cache reactions at all:

```js
const client = new Client({
	makeCache: Options.cacheWithLimits({
		...Options.DefaultMakeCacheSettings,
		ReactionManager: 0,
	}),
});
```

::: danger
As noted in the documentation, customizing `GuildManager`, `ChannelManager`, `GuildChannelManager`, `RoleManager`, or `PermissionOverwriteManager` is unsupported! Functionality will break with any kind of customization.
:::

We can further customize this by passing options to <DocsLink path="class/LimitedCollection"/>, a special kind of collection that limits the number of items. In the example below, the client is configured so that:

1. Per `GuildMemberManager`, a maximum of 200 members can be cached. (essentially, per guild)
2. We never remove a member if it is the client. This is especially important in order for the client to work properly in guilds.

```js
const client = new Client({
	makeCache: Options.cacheWithLimits({
		...Options.DefaultMakeCacheSettings,
		ReactionManager: 0,
		GuildMemberManager: {
			maxSize: 200,
			keepOverLimit: (member) => member.id === YourClientID,
		},
	}),
});
```

::: warning
Replace `YourClientID` with your client's ID. You can find this in the [Discord Developer Portal](https://discord.com/developers/applications) or by [copying it in Discord](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-). `client.user.id` will not work here, as the client is not yet logged in.
:::

## Sweeping caches

In addition to limiting caches, you can also periodically sweep and remove old items from caches. When creating a new <DocsLink path="class/Client"/>, you can customize the `sweepers` option.

Below is the default settings, which will occasionally sweep threads.

```js
const { Client, Options } = require('discord.js');

const client = new Client({
	sweepers: Options.DefaultSweeperSettings,
});
```

To modify the sweep behavior, you specify the type of cache to sweep (<DocsLink path="typedef/SweeperKey"/>) and the options for sweeping (<DocsLink path="typedef/SweepOptions"/>). If the type of cache has a lifetime associated with it, such as invites, messages, or threads, then you can set the `lifetime` option to sweep items older than specified. Otherwise, you can set the `filter` option for any type of cache, which will select the items to sweep.

```js
const client = new Client({
	sweepers: {
		...Options.DefaultSweeperSettings,
		messages: {
			interval: 60 * 60, // Every hour...
			lifetime: 60 * 30, // Remove messages older than 30 minutes.
		},
		users: {
			interval: 60 * 60, // Every hour...
			filter: (user) => user.bot && user.id !== YourClientID, // Remove all bots from the cache, except for the client.
		},
	},
});
```

::: warning
Replace `YourClientID` with your client's ID. You can find this in the [Discord Developer Portal](https://discord.com/developers/applications) or by [copying it in Discord](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-). `client.user.id` will not work here, as the client is not yet logged in.
:::

::: tip
Take a look at the documentation for which types of cache you can sweep.
Also look to see exactly what lifetime means for invites, messages, and threads!
:::
