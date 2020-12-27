# Updating from v12 to v13

## Before you start

v13 requires Node 14.x or higher to use, so make sure you're up to date. To check your Node version, use `node -v` in your terminal or command prompt, and if it's not high enough, update it! There are many resources online to help you with this step based on your host system.

Once you got Node up-to-date you can install v12 by running `npm install discord.js` in your terminal or command prompt for text-only use, or `npm install discord.js @discordjs/opus` for voice support.

You can check your discord.js version with `npm list discord.js`. Should it still show v12.x uninstall (`npm uninstall discord.js`) and re-install discord.js and make sure the entry in your package.json does not prevent a major version update. Please refer to the [npm documentation](https://docs.npmjs.com/files/package.json#dependencies) for this.

## Commonly used methods that changed

### Intents

As v13 makes the switch to Discord API v8, it will now be **required** to specify intents in your Client constructor.
For more information, refer to our more [detailed article about this topic](/popular-topics/intents)

:::danger

`clientOptions.disableMentions` has been removed and replaced with `clientOptions.allowedMentions`!

The Discord API now allows bots much more granular control over mention parsing, down to the specific ID if desired. Refer to the [Discord API documentation](https://discord.com/developers/docs/resources/channel#allowed-mentions-object) for more information.

```diff
- const client = new Discord.Client({ disableMentions: 'everyone' });
+ const client = new Discord.Client({ allowedMentions: { parse: ['users', 'roles'], repliedUser: true } });

```

:::

### Replies / Message#reply

`Message.reply()` will no longer result in the bot prepending a user mention to the content, replacing the behaviour with Discord's reply feature.

`MessageOptions.reply` (User ID) has been removed, replaced with `MessageOptions.replyTo` (Message ID)

```diff
- channel.send("content", { reply: '123456789012345678' })` // User ID
+ channel.send("content", { replyTo: '765432109876543219' })` // Message ID
```

The new `MessageOptions.allowedMentions.repliedUser` boolean option determines if the reply will notify the author of the original message.

```diff
- message.reply('content')
+ message.reply('content', { allowedMentions: { repliedUser: false }})
```

### Bitfields / Permissions

Bitfields such as Permissions and UserFlags will no longer support the use of string literals, instead requiring use of the flag.

```diff
- permissions.has('SEND_MESSAGES')
+ permissions.has(Permissions.FLAGS.SEND_MESSAGES)
```

### Webpack

Webpack builds are no longer supported.

## Breaking changes and deletions

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

### GuildMember / GuildMemberManager

#### GuildMember#ban / GuildMemberManager#ban

`GuildMember#ban()` and `GuildMemberManager#ban` will throw a TypeError when a string is provided instead of an options object.

```diff
- member.ban('reason')
+ member.ban({ reason: 'reason' })

- guild.members.ban('123456789012345678', 'reason')
+ guild.members.ban('123456789012345678', { reason: 'reason' })
```

### Message / MessageManager

#### Message#delete / MessageManager#delete

`Message.delete()` and `MessageManager.delete()` no longer accept any options, requiring a timed-delete to be performed manually.

```diff
- message.delete({ timeout: 10000 });
+ client.setTimeout(() => message.delete(), 10000);
```

### RoleManager

#### RoleManager#fetch

`RoleManager.fetch()` will now return a Collection instead of a RoleManager when called without params.

### User

#### User#locale

`User.locale` has been removed, as this property is not exposed to bots.

### UserFlags

The deprecated UserFlags `DISCORD_PARTNER` and `VERIFIED_DEVELOPER/EARLY_VERIFIED_DEVELOPER` have been removed in favour of their renamed versions.

```diff
- user.flags.has(UserFlags.FLAGS.DISCORD_PARTNER)
+ user.flags.has(UserFlags.FLAGS.PARTNERED_SERVER_OWNER)

- user.flags.has(UserFlags.FLAGS.VERIFIED_DEVELOPER)
+ user.flags.has(UserFlags.FLAGS.EARLY_VERIFIED_BOT_DEVELOPER)
```

## Additions

### ActivityTypes

New activity type `COMPETING` added.

### Channel

#### Channel#isText()

The new `Channel#isText()` getter provides an easy way for TypeScript developers to determine if a channel is Text-Based ("dm", "text", "news")

### ClientOptions

#### ClientOptions#messageEditHistoryMaxSize

The new `ClientOptions#messageEditHistoryMaxSize` option allows developers to set a fixed limit on the edit history stored for each message in the client cache. 

### GuildManager

#### GuildManager#create

The `GuildManager#create` method now supports specifying the AFK and system channels when creating a new guild.

### GuildEmojiManager

#### GuildEmojiManager#fetch

API support for the `GET /guilds/{guild.id}/emojis` endpoint.

### GuildMemberManager

Methods were added to `GuildMemberManager` to provide API support for uncached members.

#### GuildMemberManager#edit

`guild.members.edit('123456789012345678', data, reason)`

Approximately equivalent to `GuildMember#edit(data, reason)` but does not resolve to a GuildMember.

#### GuildMemberManager#kick

`guild.members.kick('123456789012345678', reason)`

Equivalent to `GuildMember#kick(reason)`

### GuildTemplate

API support for [Server Templates](https://github.com/discord/discord-api-docs/pull/2144)

### Message

#### Message#crosspostable

Permission helper to check if a Message can be crossposted

#### Message#react

Adds support for `<:name:id>` and `<a:name:id>` as valid inputs to `Message#react()`

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

`NewsChannel#addFollower` provides API support for bots to follow announcements in other channels
