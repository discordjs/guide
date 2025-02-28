# Updating from v14

## Before you start

Make sure you're using the latest LTS version of Node. To check your Node version, use `node --version` in your terminal or command prompt, and if it's not high enough, update it! There are many resources online to help you with this step based on your host system.

## Breaking Changes

### ActionRow

`ActionRow.from()` has been removed. Use `ActionRowBuilder.from()` instead.

### ApplicationCommand

`ApplicationCommand#dmPermission` and `ApplicationCommand#setDMPermission()` have been removed. This was legacy functionality for commands—use contexts instead.

### ApplicationCommandManager

`ApplicationCommandManager#fetch()` method has been updated for consistency with other managers. Previously, it accepted two parameters: `id` (a snowflake or an options object) and an `options` object. Now, it only accepts a single `options` argument, which can be a snowflake or an options object that may include an `id` property.

### AnnouncementChannel

`AnnouncementChannel#addFollower()` now returns `FollowedChannelData` instead of a snowflake. This helps to expose the created webhook id in the target channel.

### BaseInteraction

`BaseInteraction#isAnySelectMenu()` has been removed. Use `BaseInteraction#isSelectMenu()` instead, which has been repurposed to accept all select menu component types.

### Client

#### Emojis

`Client#emojis` has been removed due to confusion with the introduction of application emojis and performance impact. Use the `resolveGuildEmoji()` utility function to get a cached guild emoji.

#### Ping

`Client#ping` has been added to replace the old `WebSocketManager#ping`. This will be `null` when the heartbeat from the gateway is yet to be received.

#### Premium sticker packs

`Client#fetchPremiumStickerPacks()` has been removed. Use `Client#fetchStickerPacks()` instead.

#### Ready event

`client.on("ready")` has been removed. `"clientReady"` is the replacement. If you used `client.on(Events.ClientReady)`, you do not need to change anything.

#### Shard disconnect event

`client.on("shardDisconnect")` has been removed as the WebSocket manager replaces this functionality.

#### Shard error event

`client.on("shardError")` has been removed as the WebSocket manager replaces this functionality.

#### Shard ready event

`client.on("shardReady")` has been removed as the WebSocket manager replaces this functionality.

#### Shard reconnecting event

`client.on("shardReconnecting")` has been removed as the WebSocket manager replaces this functionality.

#### Shard resume event

`client.on("shardResume")` has been removed as the WebSocket manager replaces this functionality.

#### Webhook update event

`client.on("webhookUpdate")` has been removed. `"webhooksUpdate"` is the replacement. If you used `client.on(Events.WebhooksUpdate)`, you do not need to change anything.

#### WebSocket

The underlying WebSocket behaviour has changed. In version 14, this was a non-breaking implementation of <DocsLink section="ws" />. Now, it is fully integrated. See these pull requests for more information:

- [discordjs/discord.js#10420](https://github.com/discordjs/discord.js/pull/10420)
- [discordjs/discord.js#10556](https://github.com/discordjs/discord.js/pull/10556)

### ClientEvents

`ClientEvents` type has been removed. Use `ClientEventTypes` instead. This change ensures consistency with the rest of the event types across the library.

### ClientOptions

Removed `ClientOptions#shards` and `ClientOptions#shardCount` in favor of `ClientOptions#ws#shardIds` and `ClientOptions#ws#shardCount`.

### ClientUser

`ClientUser#setPresence()` now returns a promise which resolves when the gateway call was sent successfully.

### ClientPresence

`ClientPresence#set()` now returns a promise which resolves when the gateway call was sent successfully.

### CommandInteractionOptionResolver

`CommandInteractionOptionResolver#getFocused()`'s parameter has been removed. `AutocompleteFocusedOption` will always be returned.

### Constants

`DeletableMessageTypes` has been removed. Use `UndeletableMessageTypes` instead.

### DiscordjsErrorCodes

The following error codes have been removed as they either have no use or are handled in another package instead:

- `WSCloseRequested`
- `WSConnectionExists`
- `WSNotOpen`
- `ManagerDestroyed`
- `ShardingInvalid`
- `ShardingRequired`
- `InvalidIntents`
- `DisallowedIntents`
- `ButtonLabel`
- `ButtonURL`
- `ButtonCustomId`
- `SelectMenuCustomId`
- `SelectMenuPlaceholder`
- `SelectOptionLabel`
- `SelectOptionValue`
- `SelectOptionDescription`
- `UserBannerNotFetched`
- `ImageFormat`
- `ImageSize`
- `SplitMaxLen`
- `MissingManageEmojisAndStickersPermission`
- `VanityURL`
- `InteractionEphemeralReplied`

### Emoji

#### Image URL is now dynamic

`Emoji#imageURL()` now dynamically handles the extension. Previously, you would have to do this:

```js
emoji.imageURL({ extension: this.animated ? 'gif' : 'webp' });
```

Now, you can simply do this:

```js
emoji.imageURL();
```

#### Emoji URL getter removal

`Emoji#url` has been removed. To allow more granular control of the returned extension, Use `Emoji#imageURL()` instead.

### EventEmitter

`BaseClient`, `Shard`, `ShardingManager`, and `Collector` now extend `AsyncEventEmitter` instead of `EventEmitter`. This comes from [@vladfrangu/async_event_emitter](https://npmjs.com/package/@vladfrangu/async_event_emitter).

### Events

- `Events.ShardError` has been removed.
- `Events.ShardReady` has been removed.
- `Events.ShardReconnecting` has been removed.
- `Events.ShardResume` has been removed.
- `Events.WebhooksUpdate` now returns a string of `"webhooksUpdate"`. Previously, it returned `"webhookUpdate"`. This is to bring it in line with the name of Discord's gateway event (`WEBHOOKS_UPDATE`).
- `Events.ClientReady` now returns a string of `"clientReady"`. Previously, it returned `"ready"`. This is to ensure there's no confusion with Discord's `READY` gateway event.

### Formatters

This utility has been removed. Everything in this class is redundant as all methods of the class can be imported from discord.js directly.

```diff
- import { Formatters } from "discord.js";
+ import { userMention } from "discord.js";

- Formatters.userMention("123456789012345678");
+ userMention("123456789012345678");
```

### Guild

Removed `Guild#shard` as WebSocket shards are now handled by @discordjs/ws.

### GuildApplicationCommandManager

`GuildApplicationCommandManager#fetch()` method has been updated for consistency with other managers. Previously, it accepted two parameters: `id` (a snowflake or an options object) and an `options` object. Now, it only accepts a single `options` argument, which can be a snowflake or an options object that may include an `id` property.

### GuildAuditLogs

`GuildAuditLogsEntry.Targets.All` has been removed. It was not being used.

### GuildBanManager

`GuildBanManager#create()` no longer accepts `deleteMessageDays`. This is replaced with `deleteMessageSeconds`.

### GuildChannelManager

`GuildChannelManager#addFollower()` now returns `FollowedChannelData` instead of a snowflake. This helps to expose the created webhook id in the target channel.

### GuildMemberResolvable

`GuildMemberResolvable` type has been removed. It was defined as `GuildMember | UserResolvable`, but `UserResolvable` already includes `GuildMember`. Use `UserResolvable` instead.

### MessageManager

`MessageManager#crosspost()` has been moved to `GuildMessageManager`. This means it will no longer be exposed in `DMMessageManager`.

### IntegrationApplication

`IntegrationApplication#hook` has been removed.

### InteractionResponse

`InteractionResponse` has been removed. This class was encountered when responding to an interaction without `fetchReply` to allow ease of creating interaction collectors. This is no longer necessary as `withResponse` exposes the message.

### InteractionResponses

#### Ephemeral option removal

Previously, you would respond to an interaction ephemerally like so:

```js
// Way 1:
await interaction.reply({ content: 'This is an ephemeral response.', ephemeral: true });

// Way 2:
await interaction.reply({ content: 'This is an ephemeral response.', flags: MessageFlags.Ephemeral });
```

There are two ways to achieve the same behaviour, so the "helper" option has been removed. In this case, that would be `ephemeral`, as all that did was assign `MessageFlags.Ephemeral` internally.

#### Fetch reply option removal

`fetchReply` has been removed in favor of `withResponse`. If you were using the `fetchReply` option or fetching the response of an interaction, it is recommended to use `withResponse` instead, as the message is exposed without an additional API call:

```diff
- const message = await interaction.reply({ content: 'Hello!', fetchReply: true });
+ const response = await interaction.reply({ content: 'Hello!', withResponse: true });
+ const { message } = response.resource;
```

#### Premium response type

Discord no longer supports the `PREMIUM_REQUIRED` interaction response type. In the past, you would have done this:

```js
if (!premiumLogicCheck) {
	// User does not have access to our premium features.
	await interaction.sendPremiumRequired();
	return;
}

await interaction.reply('You have access to our premium features!');
```

However, you would have already noticed that this no longer works, so this method has been removed. Sending a premium button has been the replacement ever since.

### Invite

`Invite#stageInstance` has been removed.

### InviteStageInstance

`InviteStageInstance` has been removed.

### Message

`Message#interaction` has been removed. Use `Message#interactionMetadata` instead.

### MessagePayload

`MessagePayload#isInteraction` no longer serves a purpose and has been removed.

### NewsChannel

`NewsChannel` has been renamed to `AnnouncementChannel`.

### PermissionOverwrites

`PermissionOverwrites.resolve()` previously relied on cache if a snowflake was passed. This method no longer relies on cache and instead requires an explicit `type` if supplied.

### RoleManager

`RoleManager#fetch()` used to return `null` when fetching a role that did not exist. This logic has been removed and will throw an error instead.

### SelectMenuBuilder

`SelectMenuBuilder` has been removed. Use `StringSelectMenuBuilder` instead.

### SelectMenuComponent

`SelectMenuComponent` has been removed. Use `StringSelectMenuComponent` instead.

### SelectMenuInteraction

`SelectMenuInteraction` has been removed. Use `StringSelectMenuInteraction` instead.

### SelectMenuOptionBuilder

`SelectMenuOptionBuilder` has been removed. Use `StringSelectMenuOptionBuilder` instead.

### ShardClientUtil

`ShardClientUtil#ids` and `ShardClientUtil#count` have been removed in favor of `Client#ws#getShardIds()` and `Client#ws#getShardCount()`.

### StageInstance

`StageInstance#discoverableDisabled` has been removed.

### TeamMember

`TeamMember#permissions` has been removed. Use `TeamMemberManager#role` instead.

### TextBasedChannel

`TextBasedChannel#bulkDelete()` could return a collection containing `undefined` values. This was because in order to return these messages, the cache must be checked, especially when only snowflakes were provided. The return type of this method has thus changed to only return an array of snowflakes that were bulk deleted.

### ThreadChannel

`ThreadChannel#fetchOwner()` used to return `null` when the thread owner was not present in the thread. This logic has been removed and will throw an error instead.

### ThreadManager

`ThreadManager#fetch()` now throws an error when the provided thread id doesn't belong to the current channel.

### ThreadMember

The reason parameter of `ThreadMember#add()` and `ThreadMember#remove()` have been removed. Discord did not respect this parameter, so it did not do anything.

### ThreadMemberManager

The reason parameter of `ThreadMemberManager#remove()` has been removed. Discord did not respect this parameter, so it did not do anything.

### User

#### Avatar decoration

Discord no longer sends avatar decoration data via `User#avatarDecoration`, so this property has been removed. `User#avatarDecorationData` is the replacement.

#### Flags

`User#fetchFlags()` has been removed. All this did was fetch the user and return only its `flags` property. It was quite redundant.

### UserManager

`UserManager#fetchFlags()` has been removed. All this did was fetch the user and return only its `flags` property. It was quite redundant.

### WebSocketShardEvents

`WebSocketShardEvents` has been replaced with `WebSocketShardEvents` from @discordjs/ws.
