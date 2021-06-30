# Updating from v12 to v13

## Before you start

v13 requires Node 14.x or higher to use, so make sure you're up to date. To check your Node version, use `node -v` in your terminal or command prompt, and if it's not high enough, update it! There are many resources online to help you with this step based on your host system.

Once you've got Node up-to-date, you can install v13 by running `npm install discord.js` in your terminal or command prompt for text-only use, or `npm install discord.js @discordjs/opus` for voice support.

You can check your discord.js version with `npm list discord.js`. Should it still show v12.x, uninstall (`npm uninstall discord.js`) and re-install discord.js and make sure the entry in your package.json does not prevent a major version update. Please refer to the [npm documentation](https://docs.npmjs.com/files/package.json#dependencies) for this.

## API Version

Discord.js v13 makes the switch to Discord API v8.

## Slash Commands

Discord.js now has support for Slash Commands!

Refer to the [Slash Commands](/interactions/registering-slash-commands) section of this guide to get started.

In addition to the `interaction` event covered in the above guide, this release also includes the new Client events `applicationCommandCreate`, `applicationCommandDelete` and `applicationCommandUpdate`.

## Message Components

Discord.js now has support for Message Components!

This introduces the `MessageActionRow` and `MessageButton` classes, as well as a `MessageComponentInteractionCollector` for listening to button clicks. Refer to the [Message Components](/interactions/buttons) section of this guide to strat using Message Components.

## Voice

Support for voice has been separated into its own module. You now need to install and use [@discordjs/voice](https://github.com/discordjs/voice) for interacting with the Discord Voice API.

## Commonly used methods that changed

### Sending Messages, MessageEmbeds, and everything else

With the introduction of Interactions and it becoming far common for users to want to send an embed with MessageOptions, methods that send messages now enforce a single param. That can be either a string, an `APIMessage`, or that method's variant of `MessageOptions`.

Additionally, all messages sent by bots now support up to 10 embeds. As a result the `embed` option is completely removed, replaced with an `embeds` array which must be in the options object.

```diff
- channel.send(embed);
+ channel.send({ embeds: [embed, embed2] });

- channel.send('Hello!', { embed });
+ channel.send({ content: 'Hello!', embeds: [embed, embed2] });

- interaction.reply('Hello!', { ephemeral: true });
+ interaction.reply({ content: 'Hello!', ephemeral: true });
```

### Strings

Many methods in discord.js that were documented as accepting strings would accept other types, and resolve this into a string on your behalf. This results of this behaviour were often undesirable, producing output such as `[object Object]`. Discord.js now enforces and validates string input on all methods that expect it. 

The most common areas you will encounter this change is `MessageOptions#content` and the properties of a `MessageEmbed`.

### Intents

As v13 makes the switch to Discord API v8, it will now be **required** to specify intents in your Client constructor. 

They also move from `ClientOptions#ws#intents` to the top level `ClientOptions#intents`.

Refer to our more [detailed article about this topic](/popular-topics/intents).

```diff
- const client = new Client({ ws: { intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
+ const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
```

### Snowflakes

For TypeScript users, discord.js now enforces the `Snowflake` type, a stringified bigint, rather than allowing any string to be accepted.

### Allowed Mentions

`clientOptions.disableMentions` has been removed and replaced with `clientOptions.allowedMentions`!

The Discord API now allows bots much more granular control over mention parsing, down to the specific ID. Refer to the [Discord API documentation](https://discord.com/developers/docs/resources/channel#allowed-mentions-object) for more information.

```diff
- const client = new Discord.Client({ disableMentions: 'everyone' });
+ const client = new Discord.Client({ allowedMentions: { parse: ['users', 'roles'], repliedUser: true } });
```

### Replies / Message#reply

`Message.reply()` will no longer result in the bot prepending a user mention to the content, replacing the behavior with Discord's reply feature.

`MessageOptions.reply` no longer takes a User ID. It has been replaced with a `ReplyOptions` type, expecting `MessageOptions.reply.messageReference` as a Message ID.

```diff
- channel.send('content', { reply: '123456789012345678' }); // User ID
+ channel.send({ content: 'content', reply: { messageReference: '765432109876543219' }}); // Message ID
```

The new `MessageOptions.allowedMentions.repliedUser` boolean option determines if the reply will notify the author of the original message.

```diff
- message.reply('content')
+ message.reply({ content: 'content', allowedMentions: { repliedUser: false }})
```
Note that this will disable all other mentions in this message. To enable other mentions, you will need to include other `allowedMentions` fields. See the above "Allowed Mentions" section for more.

### Bitfields / Permissions

Bitfields are now `BigInt`s instead of `Number`s. This can be handled using the `BigInt()` class, or the n-suffixed BigInt literal.

```diff
- const p = new Permissions(104324673);
+ const p = new Permissions(BigInt(104324673)); // using class
+ const p = new Permissions(104324673n); // using literal
```
In additional, the usage of string literals for bitfield flags such as `Permissions` and `UserFlags` is discouraged; you should use the flag instead.

```diff
- permissions.has('SEND_MESSAGES')
+ permissions.has(Permissions.FLAGS.SEND_MESSAGES)
```

### DM Channels

On Discord API v8, DM Channels do not emit the `CHANNEL_CREATE` event, which means Discord.js is unable to cache them automatically. In order for your bot to receive DMs the `CHANNEL` partial must be enabled.

### Webpack

Webpack builds are no longer supported.

## Changes and deletions

### Client

#### Client#emojis

The Client Emoji manager is now a `BaseGuildEmojiManager`, providing cache resolution only and removing methods that would fail to create emojis as there was no Guild context.

#### Client#fetchApplication

This method has been removed and replaced with the `Client#application` property

```diff
- client.fetchApplication().then(application => console.log(application.name))
+ console.log(client.application.name);
```

#### Client#generateInvite

`Client#generateInvite` no longer supports `PermissionsResolvable` as its argument, requiring `InviteGenerationOptions`.

To provide permissions, use `InviteGenerationOptions#permissions`.
```diff
- client.generateInvite([Permissions.FLAGS.SEND_MESSAGES]);
+ client.generateInvite({ permissions: [Permissions.FLAGS.SEND_MESSAGES] })
```

`InviteGenerationOptions` also supports passing additional scopes, for OAuth or application.commands scopes.

### Client#login

Previously when a token had reached its 1000 login limit for the day, discord.js would treat this as a rate limit and silently wait to login again, but this was not communicated to the user.

This will now instead cause an error to be thrown.

### ClientOptions

#### ClientOptions#fetchAllMembers

The `ClientOptions#fetchAllMembers` option has been removed.

With the introduction of gateway intents, the `fetchAllMembers` Client option would often fail and causes significant delays in ready states or even cause timeout errors. As its purpose is contradictory to Discord's intentions to reduce scraping of user and presence data, it has been removed.

#### ClientOptions#messageEditHistoryMaxSize

The `ClientOptions#messageEditHistoryMaxSize` option has been removed.

To reduce caching, discord.js will no longer store an edit history. You will need to implement this yourself if required.

### ClientUser

#### ClientUser#setActivity

This method no longer returns a Promise.

#### ClientUser#setAFK

This method no longer returns a Promise.

#### ClientUser#setPresence

`PresenceData#activity` is replaced with `PresenceData#activities` which now requires an `Array<ActivitiesOptions>`.

```diff
- client.user.setPresence({ activity: { name: 'with discord.js' } });
+ client.user.setPresence({ activities: [{ name: 'with discord.js' }] });
```

This method no longer returns a Promise.

#### ClientUser#setStatus

This method no longer returns a Promise.

### ColorResolvable

Colors have been updated to align with the new Discord branding.

### Guild

#### Guild#fetchVanityCode

This method has been removed.

```diff
- Guild.fetchVanityCode().then(code => console.log(`Vanity URL: https://discord.gg/${code}`));
+ Guild.fetchVanityData().then(res => console.log(`Vanity URL: https://discord.gg/${res.code} with ${res.uses} uses`));
```

#### Guild#member

The helper/shortcut method `Guild#member()` has been removed.

```diff
- guild.member(user);
+ guild.members.cache.get(user.id)
```

### Guild#mfaLevel

The Guild#mfaLevel is now an enum.

### Guild#nsfw

The `Guild#nsfw` property has been removed, replaced by `Guild#nsfwLevel`.

#### Guild#voice

The `Guild#voice` getter has been removed.

```diff
- guild.voice
+ guild.me.voice
```

### GuildMember 

#### GuildMember#ban

`GuildMember#ban()` will throw a TypeError when a string is provided instead of an options object.

```diff
- member.ban('reason')
+ member.ban({ reason: 'reason' })
```

### GuildMember#hasPermission

This shortcut method has been removed.

```diff
- member.hasPermission(Permissions.FLAGS.SEND_MESSAGES);
+ member.permissions.has(Permissions.FLAGS.SEND_MESSAGES);
```

### GuildMemberManager

#### GuildMemberManager#ban

`GuildMemberManager#ban` will throw a TypeError when a string is provided instead of an options object.

```diff
- guild.members.ban('123456789012345678', 'reason')
+ guild.members.ban('123456789012345678', { reason: 'reason' })
```

### Message / MessageManager

#### Message#delete

`Message.delete()` no longer accepts any options, requiring a timed-delete to be performed manually.

```diff
- message.delete({ timeout: 10000 });
+ client.setTimeout(() => message.delete(), 10000);
```

`reason` is no longer a parameter as it is not used by the API.

#### MessageManager#delete

`MessageManager.delete()` no longer accepts any additional options, requiring a timed-delete to be performed manually.

```diff
- channel.messages.delete('123456789012345678', { timeout: 10000 });
+ client.setTimeout(() => channel.messages.delete('123456789012345678'), 10000);
```

`reason` is no longer a parameter as it is not used by the API.

### MessageEmbed

#### MessageEmbed#attachFiles

The `MessageEmbed#attachFiles` method has been removed. Instead, files should be attached to the Message directly via MessageOptions.

```diff
- channel.send({ embeds: [new MessageEmbed().setTitle("Files").attachFiles(file)] })
+ channel.send({ embeds: [new MessageEmbed().setTitle("Files")], files: [file] })
```

### ReactionUserManager

#### ReactionUserManager#fetch

The `before` option has been removed as it was not supported by the API.

### RoleManager

#### RoleManager#create

The options passed to `RoleManager#create` no longer need to be nested in a `data` object.
Additionally, `reason` is now part of the options, not a second parameter.

```diff
- guild.roles.create({ data: { name: "New role" } }, "Creating new role");
+ guild.roles.create({ name: "New role", reason: "Creating new role" })
```

#### RoleManager#fetch

`RoleManager.fetch()` will now return a Collection instead of a RoleManager when called without params.

### Shard

#### Shard#respawn

The options for this method are now an object instead of separate params. In addition the `spawnTimeout` param has been renamed to `timeout`.

This means the user no longer needs to pass defaults to fill each positional param.

```diff
- shard.respawn(500, 30000);
+ shard.respawn({ delay: 500, timeout: 30000 });
```

#### Shard#spawn

The `spawnTimeout` param has been renamed to `timeout`.

### ShardClientUtil

#### ShardClientUtil.respawnAll

The options for this method are now an object instead of separate params. In addition the `spawnTimeout` param has been renamed to `timeout`.

This means the user no longer needs to pass defaults to fill each positional param.

```diff
- client.shard.respawnAll(5000, 500, 30000);
+ client.shard.respawnAll({ shardDelay: 5000, respawnDelay: 500, timeout: 30000 });
```

### ShardingManager

#### ShardingManager.spawn

The options for this method are now an object instead of separate params. In addition the `spawnTimeout` param has been renamed to `timeout`.

This means the user no longer needs to pass defaults to fill each positional param.

```diff
- manager.spawn('auto', 5500, 30000);
+ manager.spawn({ amount: 'auto', delay: 5500, timeout: 30000 });
```

#### ShardingManager#respawnAll

The options for this method are now an object instead of separate params. In addition the `spawnTimeout` param has been renamed to `timeout`.

This means the user no longer needs to pass defaults to fill each positional param.

```diff
- manager.respawnAll(5000, 500, 30000);
+ manager.respawnAll({ shardDelay: 5000, respawnDelay: 500, timeout: 30000 });
```

### User

#### User#locale

`User.locale` has been removed, as this property is not exposed to bots.

### UserFlags

The deprecated UserFlags `DISCORD_PARTNER` and `VERIFIED_DEVELOPER` / `EARLY_VERIFIED_DEVELOPER` have been removed in favor of their renamed versions.

```diff
- user.flags.has(UserFlags.FLAGS.DISCORD_PARTNER)
+ user.flags.has(UserFlags.FLAGS.PARTNERED_SERVER_OWNER)

- user.flags.has(UserFlags.FLAGS.VERIFIED_DEVELOPER)
+ user.flags.has(UserFlags.FLAGS.EARLY_VERIFIED_BOT_DEVELOPER)
```

The new flag `DISCORD_CERTIFIED_MODERATOR` has been added.

### Util

#### Util#convertToBuffer

#### Util#str2ab

Both were removed in favor of Node built-in Buffer methods.

#### Util#resolveString

The `Util#resolveString` method has been removed. Discord.js now enforces that users provide strings where expected rather than resolving one on their behalf.

## Additions

### ActivityTypes

New activity type `COMPETING` added.

### APIRequest

Global headers can now be set in the HTTP options.

### ApplicationFlags

New class `ApplicationFlags`, a bitfield for ClientApplication flags.

### BaseGuild

The new `BaseGuild` class is extended by both `Guild` and `OAuth2Guild`.

### Channel

#### Channel#isText()

The new `Channel#isText()` function provides an easy way for TypeScript developers to determine if a channel is Text-Based ("dm", "text", "news").

### CollectorOptions

#### CollectorOptions#filter

Constructing a Collector without providing a filter function will now throw a meaningful `TypeError`.

### CommandInteraction

New class for handling Slash Command interactions. For more information refer to the [Slash Commands](/interactions/registering-slash-commands) section of the guide.

### Guild

#### Guild#bans

New property for the Guild's `GuildBanManager`

#### Guild#create

`Guild#systemChannelFlags` can now be set in the `Guild#create` method.

#### Guild#edit

`Guild#description` and `Guild#features` can now be edited.

#### Guild#emojis

The `GuildEmojiManager` now extends `BaseGuildEmojiManager`.

In addition to the existing methods, it now supports `GuildEmojiManager#fetch`.

#### Guild#nsfw

Guilds can now be marked as NSFW.

#### Guild#owner

The `Guild#owner` property has been removed as it was unreliable due to caching, replaced with `Guild#fetchOwner`

```diff
- console.log(Guild.owner);
+ Guild.fetchOwner().then(console.log);
```

#### Guild#setChannelPositions

The `Guild#setChannelPositions` method can now be used to set the parent of multiple channels, and lock their permissions via the `ChannelPosition#parent` and `ChannelPosition#lockPermissions` options.

### GuildBanManager

The new `GuildBanManager` provides improved support for handling and caching bans.

### GuildChannel

#### GuildChannel#clone

The `GuildChannel#clone` method now supports setting the `position` property.

#### GuildChannel#createInvite

The `GuildChannel#createInvite` method now supports additional options:

- `targetUser` to target the invite to join a particular streaming user
- `targetApplication` to target the invite to a particular Discord activity
- `targetType`

#### GuildChannel#createOverwrite

The `GuildChannel#createOverwrite` method no longer relies on cache. This is achieved by accepting an options object in which the `type` of overwrite can be specified.

#### GuildChannel#updateOverwrite

The `GuildChannel#updateOverwrite` method no longer relies on cache. This is achieved by accepting an options object in which the `type` of overwrite can be specified.

### GuildChannelManager

#### GuildChannelManager#fetch

Now supports fetching the channels of a Guild.

### GuildManager

#### GuildManager#create

The `GuildManager#create` method now supports specifying the AFK and system channels when creating a new guild.

#### GuildManager#fetch

The `GuildManager#fetch` method now supports fetching multiple guilds, returning a `Promise<Collection<Snowflake, OAuth2Guild>>` if used in this way.

### GuildEmojiManager

#### GuildEmojiManager#fetch

API support for the `GET /guilds/{guild.id}/emojis` endpoint.

### GuildMember

#### GuildMember#pending

The `GuildMember#pending` boolean property flags whether a member has passed the guild's membership gate.

The flag is `true` before accepting and fires `guildMemberUpdate` when the member accepts.

### GuildMemberManager

Methods were added to `GuildMemberManager` to provide API support for uncached members.

#### GuildMemberManager#edit

`guild.members.edit('123456789012345678', data, reason)`

Approximately equivalent to `GuildMember#edit(data, reason)` but does not resolve to a GuildMember.

#### GuildMemberManager#kick

`guild.members.kick('123456789012345678', reason)`

Equivalent to `GuildMember#kick(reason)`.

#### GuildMemberManager#search

Adds support for querying GuildMembers via the REST API endpoint.

`GuildMemberManager#fetch` uses the websocket gateway to receive data.

### GuildMemberRoleManager

#### GuildMemberRoleManager#botRole

Gets the managed role this member created when joining the guild if any.

`member.roles.botRole`

#### GuildMemberRoleManager#premiumSubscriberRole

Gets the premium subscriber (booster) role if present on the member.

`member.roles.premiumSubscriberRole`

### GuildTemplate

API support for [Server Templates](https://discord.com/developers/docs/resources/guild-template).

### Integration

#### Integration#roles

Provides a Collection of Roles managed by the integration.

### Interaction

Base class for Slash Command and Message Component interactions. For more information refer to the [Interactions](/interactions/registering-slash-commands) section of the guide.

### InteractionWebhook

New Webhook type specifically for handling interactions.

### Message

#### Message#awaitMessageComponentInteraction

Promisified collector to wait for and collect a single component interaction on a Message

#### Message#createMessageComponentInteractionCollector

New Collector class for collecting component interactions on a Message

#### Message#crosspostable

Permission helper to check if a Message can be crossposted.

#### Message#edit

Editing/removing attachments when editing a Message is now supported.

#### Message#fetchReference

New method to fetch the Message referenced by Message#reference, if the client has access to do so.

#### Message#react

Added support for `<:name:id>` and `<a:name:id>` as valid inputs to `Message#react()`.

#### Message#stickers

New Collection property containing any stickers which were in the message.

### MessageActionRow

New builder class for construction action row type Message Components.

### MessageAttachment

#### MessageAttachment#contentType

The media type of a MessageAttachment.

### MessageButton

New building class for constructing button-type Message Components

### MessageManager

Methods were added to `MessageManager` to provide API support for uncached messages.

#### MessageManager#crosspost

`channel.messages.crosspost('765432109876543210')`

Equivalent to `message.crosspost()`.

#### MessageManager#edit

`channel.messages.edit('765432109876543210', content, options)`

Equivalent to `message.edit(content, options)`.

#### MessageManager#pin

`channel.messages.pin('765432109876543210', options)`

Approximately equivalent to `message.pin(options)` but does not resolve to a Message.

#### MessageManager#react

`channel.messages.react('765432109876543210', emoji)`

Approximately equivalent to `message.react(emoji)` but does not resolve to a MessageReaction.

#### MessageManager#unpin

`channel.messages.unpin('765432109876543210', options)`

Approximately equivalent to `message.unpin(options)` but does not resolve to a Message.

### NewsChannel

#### NewsChannel#addFollower

`channel.addFollower(channel)`

Provides API support for bots to follow announcements in other channels.

#### NewsChannel#setType

`channel.setType('text')`

Allows conversion between NewsChannel and TextChannel.

### Permissions

#### Permissions#STAGE_MODERATOR

Static bitfield representing the permissions required to moderate a Stage Channel.

### Role

#### Role#tags

Tags for roles belonging to bots, integrations, or premium subscribers.

### RoleManager

#### RoleManager#botRoleFor

`guild.roles.botRoleFor(user)`

Gets the managed role a bot created when joining the guild, if any.

#### RoleManager#premiumSubscriberRole

`guild.roles.premiumSubscriberRole`

Gets the premium subscriber (booster) role for the Guild, if any.

### StageChannel

Stage Channels are now supported.

### Sticker

Stickers are now supported.

### TextChannel

#### TextChannel#awaitMessageComponentInteraction

Promisified collector to wait for and collect a single component interaction in a TextChannel

#### TextChannel#createMessageComponentInteractionCollector

New Collector class for collecting component interactions in a TextChannel

#### TextChannel#setType

`channel.setType('news')`

Allows conversion between TextChannel and NewsChannel.

### Webhook

#### Webhook#deleteMessage

Webhooks can now delete messages that were sent by the Webhook.

#### Webhook#editMessage

Webhooks can now edit messages that were sent by the Webhook.

#### Webhook#fetchMessage

Webhooks can now fetch messages that were sent by the Webhook.

#### Webhook#sourceChannel

#### Webhook#sourceGuild

Webhooks can now have a `sourceGuild` and `sourceChannel` if the message is being crossposted.

### Util

#### Util#resolvePartialEmoji

The new `Util#resolvePartialEmoji` method attempts to resolve properties for a raw emoji object from input data, without the use of the Discord.js Client class or its EmojiManager.

#### Util#verifyString

The new `Util#verifyString` method is used to internally validate string arguments provided to methods in discord.js.
