# Updating from v12 to v13

## Before you start

v13 requires Node 14.x or higher to use, so make sure you're up to date. To check your Node version, use `node -v` in your terminal or command prompt, and if it's not high enough, update it! There are many resources online to help you with this step based on your host system.

Once you've got Node up-to-date, you can install v13 by running `npm install discord.js` in your terminal or command prompt for text-only use, or `npm install discord.js @discordjs/opus` for voice support.

You can check your discord.js version with `npm list discord.js`. Should it still show v12.x uninstall (`npm uninstall discord.js`) and re-install discord.js and make sure the entry in your package.json does not prevent a major version update. Please refer to the [npm documentation](https://docs.npmjs.com/files/package.json#dependencies) for this.

## Commonly used methods that changed

### Intents

As v13 makes the switch to Discord API v8, it will now be **required** to specify intents in your Client constructor.
Refer to our more [detailed article about this topic](/popular-topics/intents).

### Allowed Mentions

:::danger

`clientOptions.disableMentions` has been removed and replaced with `clientOptions.allowedMentions`!

The Discord API now allows bots much more granular control over mention parsing, down to the specific ID. Refer to the [Discord API documentation](https://discord.com/developers/docs/resources/channel#allowed-mentions-object) for more information.

```diff
- const client = new Discord.Client({ disableMentions: 'everyone' });
+ const client = new Discord.Client({ allowedMentions: { parse: ['users', 'roles'], repliedUser: true } });
```

:::

### Replies / Message#reply

`Message.reply()` will no longer result in the bot prepending a user mention to the content, replacing the behavior with Discord's reply feature.

`MessageOptions.reply` (User ID) has been removed, replaced with `MessageOptions.replyTo` (Message ID)

```diff
- channel.send('content', { reply: '123456789012345678' })` // User ID
+ channel.send('content', { replyTo: '765432109876543219' })` // Message ID
```

The new `MessageOptions.allowedMentions.repliedUser` boolean option determines if the reply will notify the author of the original message.

```diff
- message.reply('content')
+ message.reply('content', { allowedMentions: { repliedUser: false }})
```

### Bitfields / Permissions

The usage of string literals for bitfields such as `Permissions` and `UserFlags` is discouraged; you should use the flag instead.

```diff
- permissions.has('SEND_MESSAGES')
+ permissions.has(Permissions.FLAGS.SEND_MESSAGES)
```

### Webpack

Webpack builds are no longer supported.

## Changes and deletions

### Client

#### Client#emojis

The Client Emoji manager is now a `BaseGuildEmojiManager`, providing cache resolution only and removing methods that would fail to create emojis as there was no Guild context.

#### Client#generateInvite

`Client#generateInvite` no longer supports `PermissionsResolvable` as its argument, requiring `InviteGenerationOptions`.

To provide permissions, use `InviteGenerationOptions#permissions`.
```diff
- client.generateInvite([Permissions.FLAGS.SEND_MESSAGES]);
+ client.generateInvite({ permissions: [Permissions.FLAGS.SEND_MESSAGES] })
```

### ClientOptions

#### ClientOptions#fetchAllMembers

The `ClientOptions#fetchAllMembers` option has been removed.

With the introduction of gateway intents, the `fetchAllMembers` Client option would often fail and causes significant delays in ready states or even cause timeout errors. As its purpose is contradictory to Discord's intentions to reduce scraping of user and presence data, it has been removed.

#### ClientOptions#messageEditHistoryMaxSize

The `ClientOptions#messageEditHistoryMaxSize` option has been removed.

To reduce caching, discord.js will no longer store an edit history. You will need to implement this yourself if required.

### Guild

#### Guild#member

The helper/shortcut method `Guild#member()` has been removed.

```diff
- guild.member(user);
+ guild.members.cache.get(user.id)
```

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

### Util

#### Util#convertToBuffer

#### Util#str2ab

Both were removed in favor of Node built-in Buffer methods.

## Additions

### ActivityTypes

New activity type `COMPETING` added.

### Channel

#### Channel#isText()

The new `Channel#isText()` getter provides an easy way for TypeScript developers to determine if a channel is Text-Based ("dm", "text", "news")

### CollectorOptions

#### CollectorOptions#filter

Constructing a Collector without providing a filter function will now throw a meaningful `TypeError`.

### Guild

#### Guild#emojis

The `GuildEmojiManager` now extends `BaseGuildEmojiManager`.

In addition to the existing methods, it now supports `GuildEmojiManager#fetch`.

### GuildManager

#### GuildManager#create

The `GuildManager#create` method now supports specifying the AFK and system channels when creating a new guild.

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

Equivalent to `GuildMember#kick(reason)`

### GuildMemberRoleManager

#### GuildMemberRoleManager#botRole

Gets the managed role this member created when joining the guild if any.

`member.roles.botRole`

#### GuildMemberRoleManager#premiumSubscriberRole

Gets the premium subscriber (booster) role if present on the member.

`member.roles.premiumSubscriberRole`

### GuildTemplate

API support for [Server Templates](https://discord.com/developers/docs/resources/template)

### Integration

#### Integration#roles

Provides a Collection of Roles managed by the integration.

### Message

#### Message#crosspostable

Permission helper to check if a Message can be crossposted.

#### Message#react

Added support for `<:name:id>` and `<a:name:id>` as valid inputs to `Message#react()`.

#### Message#referencedMessage

Gets the message this message references if this message is a crosspost/reply/pin-add and the referenced message is cached.

### MessageManager

Methods were added to `MessageManager` to provide API support for uncached messages.

#### MessageManager#crosspost

`channel.messages.crosspost('765432109876543210')`

Equivalent to `message.crosspost()`

#### MessageManager#edit

`channel.messages.edit('765432109876543210', content, options)`

Equivalent to `message.edit(content, options)`

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

Provides API support for bots to follow announcements in other channels

#### NewsChannel#setType

`channel.setType('text')`

Allows conversion between NewsChannel and TextChannel

### Role

#### Role#tags

Tags for roles belonging to bots, integrations, or premium subscribers.

### RoleManager

#### RoleManager#botRoleFor

`guild.roles.botRoleFor(user)`

Gets the managed role a bot created when joining the guild if any.

#### RoleManager#premiumSubscriberRole

`guild.roles.premiumSubscriberRole`

Gets the premium subscriber (booster) role for the Guild, if any

### TextChannel

#### TextChannel#setType

`channel.setType('news')`

Allows conversion between TextChannel and NewsChannel
