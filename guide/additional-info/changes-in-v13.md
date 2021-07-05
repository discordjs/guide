# Updating from v12 to v13

## Before you start

v13 requires Node 14.x or higher to use, so make sure you're up to date. To check your Node version, use `node -v` in your terminal or command prompt, and if it's not high enough, update it! There are many resources online to help you with this step based on your host system.

Once you've got Node up-to-date, you can install v13 by running `npm install discord.js` in your terminal or command prompt for text-only use, or `npm install discord.js @discordjs/opus` for voice support.

You can check your discord.js version with `npm list discord.js`. Should it still show v12.x, uninstall (`npm uninstall discord.js`) and re-install discord.js and make sure the entry in your package.json does not prevent a major version update. Please refer to the [npm documentation](https://docs.npmjs.com/files/package.json#dependencies) for this.

## API Version

Discord.js v13 makes the switch to Discord API v9! In addition to this, the new major version also includes a bunch of cool new features...

## Slash Commands

Discord.js now has support for Slash Commands!

Refer to the [Slash Commands](/interactions/registering-slash-commands) section of this guide to get started.

In addition to the `interactionCreate` event covered in the above guide, this release also includes the new Client events `applicationCommandCreate`, `applicationCommandDelete` and `applicationCommandUpdate`.

## Message Components

Discord.js now has support for Message Components!

This introduces the `MessageActionRow`, `MessageButton` and `MessageSelectMenu` classes, as well as associated interactions and collectors. 

Refer to the [Message Components](/interactions/buttons) section of this guide to start using Message Components.

## Threads

Discord.js now has support for Threads! Threads are a new type of sub-channel that can be used to help separate conversations into a more meaningful flow.

This introduces the `ThreadManager` class, which can be found as `TextChannel#threads`, in addition to `ThreadChannel`, `ThreadMemberManager` and `ThreadMember`.

There are also five new events; `threadCreate`, `threadDelete`, `threadListSync`, `threadMemberUpdate` and `threadMembersUpdate`.

Refer to the [Threads](/popular-topics/threads) section of this guide to start using Threads.

## Voice

Support for voice has been separated into its own module. You now need to install and use [@discordjs/voice](https://github.com/discordjs/voice) for interacting with the Discord Voice API.

## Customizable Manager Caches

A popular request that has finally been heard, by 1Computer specifically. The `Client` class supports a new option, `makeCache` which accepts a `CacheFactory`.

By combining this with the helper function `Options.cacheWithLimits` users can define custom caps on the caches of each Manager, and let discord.js handle the rest.

```js
const client = new Client({
	makeCache: Options.cacheWithLimits({
		MessageManager: 200, // This is default.
		PresenceManager: 0, // Add more class names here.
	}),
});
```

Additional flexibility can be gained by providing a function which returns a custom cache implementation - keep in mind this should still maitain the Collector / Map-like interface for internal compatibility.

```js
const client = new Client({
	makeCache: manager => {
		if (manager.name === 'MessageManager') return new LimitedCollection(0);
		return new Collection();
	},
});
```

## Commonly used methods that changed

### Sending Messages, MessageEmbeds, and everything else

With the introduction of Interactions and it becoming far common for users to want to send an embed with MessageOptions, methods that send messages now enforce a single param. 

That can be either a string, an `APIMessage`, or that method's variant of `MessageOptions`.

Additionally, all messages sent by bots now support up to 10 embeds. As a result the `embed` option is completely removed, replaced with an `embeds` array which must be in the options object.

```diff
- channel.send(embed);
+ channel.send({ embeds: [embed, embed2] });

- channel.send('Hello!', { embed });
+ channel.send({ content: 'Hello!', embeds: [embed, embed2] });

- interaction.reply('Hello!', { ephemeral: true });
+ interaction.reply({ content: 'Hello!', ephemeral: true });
```

`MessageEmbed#attachFiles` has been removed - files should now be attached directly to the Message.

```diff
- const embed = new Discord.MessageEmbed().setTitle('Attachments').attachFiles(['./image1.png', './image2.jpg']);
- channel.send(embed);
+ const embed = new Discord.MessageEmbed().setTitle('Attachments');
+ channel.send({ embeds: [embed], files: ['./image1.png', './image2.jpg'] });
```

The `code` and `split` options have also been removed. This functionality will now have to be handled manually, such as via the `Formatters.codeBlock` and `Util.splitMessage` helpers.

### Strings

Many methods in discord.js that were documented as accepting strings would accept other types, and resolve this into a string on your behalf. The results of this behaviour were often undesirable, producing output such as `[object Object]`.

Discord.js now enforces and validates string input on all methods that expect it. Users will need to manually call `toString()` or utilise template literals for all string inputs as appropriate.

The most common areas you will encounter this change in are `MessageOptions#content`, the properties of a `MessageEmbed`, and passing objects such as users or roles, expecting them to be stringified.

```diff
- message.channel.send(user);
+ message.channel.send(user.toString());

let count = 5;
- embed.addField('Count', count);
+ embed.addField('Count', `${count}`);
```

### Intents

As v13 makes the switch to Discord API v9, it will now be **required** to specify intents in your Client constructor. 

They also move from `ClientOptions#ws#intents` to the top level `ClientOptions#intents`.

Refer to our more [detailed article about this topic](/popular-topics/intents).

```diff
- const client = new Client({ ws: { intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
+ const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
```

### Structures#extend

The concept of extendable Structures has been completely removed from discord.js.

For more information on why this decision was made and the recommended alternatives, refer to the [pull request](https://github.com/discordjs/discord.js/pull/6027).

### Collectors

All Collector related classes and methods (both create and await) now take a single object parameter which also includes the filter.

```diff
- const collector = message.createReactionCollector(filter, { time: 15000 });
+ const collector = message.createReactionCollector({ filter, time: 15000 });
```

### Naming conventions

Some commonly used naming conventions in discord.js have been changed:

#### Thing#thingId

The casing of `thingID` properties has changed to `thingId`. This is a more-correct casing for the camelCase used by discord.js as `Id` is an abbreviation, not an acronym.

```diff
- console.log(guild.ownerID);
+ console.log(guild.ownerId);

- console.log(interaction.channelID);
+ console.log(interaction.channelId);
```

#### Client#message

#### Client#interaction

- `message` and `interaction` events have been renamed to `messageCreate` and `interactionCreate` respectively, to bring the library in line with Discord's naming conventions.

Don't worry - the old names still work, but you'll receive a Deprecation Warning until you switch over.

```diff
- client.on("message", message => { ... });
+ client.on("messageCreate", message => { ... });

- client.on("interaction", interaction => { ... });
+ client.on("interactionCreate", interaction => { ... });
```

### Snowflakes

For TypeScript users, discord.js now enforces the `Snowflake` type, a stringified bigint, rather than allowing any string to be accepted.

```diff
interface Config {
 	prefix: string;
-	ownerId: string;
+	ownerId: Snowflake;
}
```

### Allowed Mentions

`clientOptions.disableMentions` has been removed and replaced with `clientOptions.allowedMentions`!

The Discord API now allows bots much more granular control over mention parsing, down to the specific id.

Refer to the [Discord API documentation](https://discord.com/developers/docs/resources/channel#allowed-mentions-object) for more information.

```diff
- const client = new Discord.Client({ disableMentions: 'everyone' });
+ const client = new Discord.Client({ allowedMentions: { parse: ['users', 'roles'], repliedUser: true } });
```

### Replies / Message#reply

`Message#reply` will no longer result in the bot prepending a user mention to the content, replacing the behavior with Discord's reply feature.

`MessageOptions#reply` no longer takes a user id. It has been replaced with a `ReplyOptions` type, expecting `MessageOptions#reply#messageReference` as a Message id.

```diff
- channel.send('content', { reply: '123456789012345678' }); // User id
+ channel.send({ content: 'content', reply: { messageReference: '765432109876543219' }}); // Message id
```

The new `MessageOptions.allowedMentions.repliedUser` boolean option determines if the reply will notify the author of the original message.

```diff
- message.reply('content')
+ message.reply({ content: 'content', allowedMentions: { repliedUser: false }})
```
Note that this will disable all other mentions in this message. To enable other mentions, you will need to include other `allowedMentions` fields. See the above "Allowed Mentions" section for more.

### Bitfields / Permissions

Bitfields are now `BigInt`s instead of `Number`s. This can be handled using the `BigInt()` class, or the n-suffixed [BigInt literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).

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

On Discord API v8 and later, DM Channels do not emit the `CHANNEL_CREATE` event, which means discord.js is unable to cache them automatically. In order for your bot to receive DMs the `CHANNEL` partial must be enabled.

### Webpack

Webpack builds are no longer supported.

## Changes and deletions

### APIMessage

The `APIMessage` class has been renamed to `MessagePayload`, resolving a naming clash with an interface in the `discord-api-types` library which raw message data objects.

### Client

#### Client#emojis

The Client Emoji manager is now a `BaseGuildEmojiManager`, providing cache resolution only and removing methods that would fail to create emojis as there was no Guild context.

#### Client#fetchApplication

The `Client#fetchApplication` has been removed and replaced with the `Client#application` property.

```diff
- client.fetchApplication().then(application => console.log(application.name))
+ console.log(client.application.name);
```

#### Client#generateInvite

`Client#generateInvite` no longer supports `PermissionsResolvable` as its argument, requiring `InviteGenerationOptions`.

`InviteGenerationOptions` requires that at least one of either `bot` or `applications.commands` is provided in `scopes` to generate a valid invite URL.

To generate an invite link for Slash Commands only.

```js
client.generateInvite({ scopes: ['applications.commands'] });
```

To generate an invite link for a bot and define required permissions.

```diff
- client.generateInvite([Permissions.FLAGS.SEND_MESSAGES]);
+ client.generateInvite({ scopes: ['bot'], permissions: [Permissions.FLAGS.SEND_MESSAGES] })
```

### Client#login

Previously when a token had reached its 1000 login limit for the day, discord.js would treat this as a rate limit and silently wait to login again, but this was not communicated to the user.

This will now instead cause an error to be thrown.

### ClientOptions

#### ClientOptions#fetchAllMembers

The `ClientOptions#fetchAllMembers` option has been removed.

With the introduction of gateway intents, the `fetchAllMembers` Client option would often fail and causes significant delays in ready states or even cause timeout errors.

As its purpose is contradictory to Discord's intentions to reduce scraping of user and presence data, it has been removed.

#### ClientOptions#messageEditHistoryMaxSize

The `ClientOptions#messageEditHistoryMaxSize` option has been removed.

To reduce caching, discord.js will no longer store an edit history. You will need to implement this yourself if required.

### ClientUser

#### ClientUser#setActivity

This `ClientUser#setActivity` method no longer returns a Promise.

#### ClientUser#setAFK

This `ClientUser#setAFK` method no longer returns a Promise.

#### ClientUser#setPresence

This `ClientUser#setPresence` method no longer returns a Promise.

`PresenceData#activity` is replaced with `PresenceData#activities` which now requires an `Array<ActivitiesOptions>`.

```diff
- client.user.setPresence({ activity: { name: 'with discord.js' } });
+ client.user.setPresence({ activities: [{ name: 'with discord.js' }] });
```

#### ClientUser#setStatus

This `ClientUser#setStatus` method no longer returns a Promise.

### ColorResolvable

Colors have been updated to align with the new Discord branding.

### Guild

#### Guild#fetchInvites

This method has been removed, with functionality replaced by the new `GuildInviteManager`.

```diff
- guild.fetchInvites();
+ guild.invites.fetch();
```

#### Guild#fetchVanityCode

This `Guild#fetchVanityCode` method has been removed.

```diff
- Guild.fetchVanityCode().then(code => console.log(`Vanity URL: https://discord.gg/${code}`));
+ Guild.fetchVanityData().then(res => console.log(`Vanity URL: https://discord.gg/${res.code} with ${res.uses} uses`));
```

#### Guild#member

The `Guild#member()` helper/shortcut method has been removed.

```diff
- guild.member(user);
+ guild.members.cache.get(user.id)
```

### Guild#mfaLevel

The `Guild#mfaLevel` property is now an enum.

### Guild#nsfw

The `Guild#nsfw` property has been removed, replaced by `Guild#nsfwLevel`.

#### Guild#voice

The `Guild#voice` getter has been removed.

```diff
- guild.voice
+ guild.me.voice
```

### GuildChannel

#### GuildChannel#createOverwrite

This method has been removed, with functionality replaced by the new `PermissionOverwriteManager`.

```diff
- channel.createOverwrite(user, { VIEW_CHANNEL: false });
+ channel.permissionOverwrites.create(user, { VIEW_CHANNEL: false });
```

#### GuildChannel#overwritePermissions

This method has been removed, with functionality replaced by the new `PermissionOverwriteManager`.

```diff
- channel.overwritePermissions([{ id: user.id , allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES'] }]);
+ channel.permissionOverwrites.set([{ id: user.id , allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES'] }]);
```

#### GuildChannel#permissionOverwrites

This method no longer returns a Collection of PermissionOverwrites, instead providing access to the `PermissionOverwriteManager`.

#### GuildChannel#updateOverwrite

This method has been removed, with functionality replaced by the new `PermissionOverwriteManager`.

```diff
- channel.updateOverwrite(user, { VIEW_CHANNEL: false });
+ channel.permissionOverwrites.edit(user, { VIEW_CHANNEL: false });
```

### GuildMember 

#### GuildMember#ban

`GuildMember#ban()` will throw a TypeError when a string is provided instead of an options object.

```diff
- member.ban('reason')
+ member.ban({ reason: 'reason' })
```

### GuildMember#hasPermission

The `GuildMember#hasPermission` shortcut/helper method has been removed.

```diff
- member.hasPermission(Permissions.FLAGS.SEND_MESSAGES);
+ member.permissions.has(Permissions.FLAGS.SEND_MESSAGES);
```

### GuildMemberManager

#### GuildMemberManager#ban

The `GuildMemberManager#ban` method will throw a TypeError when a string is provided instead of an options object.

```diff
- guild.members.ban('123456789012345678', 'reason')
+ guild.members.ban('123456789012345678', { reason: 'reason' })
```

### Message / MessageManager

#### Message#delete

The `Message.delete()` method no longer accepts any options, requiring a timed-delete to be performed manually.

```diff
- message.delete({ timeout: 10000 });
+ client.setTimeout(() => message.delete(), 10000);
```

`reason` is no longer a parameter as it is not used by the API.

#### MessageManager#delete

The `MessageManager.delete()` method no longer accepts any additional options, requiring a timed-delete to be performed manually.

```diff
- channel.messages.delete('123456789012345678', { timeout: 10000 });
+ client.setTimeout(() => channel.messages.delete('123456789012345678'), 10000);
```

`reason` is no longer a parameter as it is not used by the API.

### MessageEmbed

#### MessageEmbed#attachFiles

The `MessageEmbed#attachFiles` method has been removed. Instead, files should be attached to the Message directly via `MessageOptions`.

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

The `RoleManager#fetch()` method will now return a Collection instead of a RoleManager when called without params.

### Shard

#### Shard#respawn

The options for the `Shard#respawn` method are now an object instead of separate params. In addition the `spawnTimeout` param has been renamed to `timeout`.

This means the user no longer needs to pass defaults to fill each positional param.

```diff
- shard.respawn(500, 30000);
+ shard.respawn({ delay: 500, timeout: 30000 });
```

#### Shard#spawn

The `spawnTimeout` param has been renamed to `timeout`.

### ShardClientUtil

#### ShardClientUtil#broadcastEval

The `ShardClientUtil#broadcastEval` method no longer accepts a string, instead expecting a function.

```diff
- client.shard.broadcastEval('this.guilds.cache.size')
+ client.shard.broadcastEval(client => client.guilds.cache.size)
		.then(results => console.log(`${results.reduce((prev, val) => prev + val, 0)} total guilds`))
		.catch(console.error);
```

#### ShardClientUtil#respawnAll

The options for the `ShardClientUtil#respawnAll` method are now an object instead of separate params. In addition the `spawnTimeout` param has been renamed to `timeout`.

This means the user no longer needs to pass defaults to fill each positional param.

```diff
- client.shard.respawnAll(5000, 500, 30000);
+ client.shard.respawnAll({ shardDelay: 5000, respawnDelay: 500, timeout: 30000 });
```

### ShardingManager

#### ShardingManager#broadcastEval

The `ShardingManager#broadcastEval` method no longer accepts a string, instead expecting a function. See `ShardClientUtil#broadcastEval`.

#### ShardingManager#spawn

The options for the `ShardingManager#spawn` method are now an object instead of separate params. In addition the `spawnTimeout` param has been renamed to `timeout`.

This means the user no longer needs to pass defaults to fill each positional param.

```diff
- manager.spawn('auto', 5500, 30000);
+ manager.spawn({ amount: 'auto', delay: 5500, timeout: 30000 });
```

#### ShardingManager#respawnAll

The options for the `ShardingManager#respawnAll` method are now an object instead of separate params. In addition the `spawnTimeout` param has been renamed to `timeout`.

This means the user no longer needs to pass defaults to fill each positional param.

```diff
- manager.respawnAll(5000, 500, 30000);
+ manager.respawnAll({ shardDelay: 5000, respawnDelay: 500, timeout: 30000 });
```

### User

#### User#locale

The `User.locale` property has been removed, as this property is not exposed to bots.

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

Shortcuts to Util methods which were previously exported at the top level have been removed.

#### Util#convertToBuffer

#### Util#str2ab

Both were removed in favor of Node built-in Buffer methods.

#### Util#resolveString

The `Util#resolveString` method has been removed. Discord.js now enforces that users provide strings where expected rather than resolving one on their behalf.

## Additions

### ActivityTypes

A new activity type `COMPETING` has been added.

### ApplicationCommand

Provides API support for Slash Commands.

### ApplicationCommandManager

Provides API support for creating, editing and deleting Slash Commands.

### ApplicationCommandPermissionsManager

Provides API support for creating, editing and deleting permission overwrites on Slash Commands.

### ApplicationFlags

Provides an enumerated bitfield for `ClientApplication` flags.

### BaseGuild

The new `BaseGuild` class is extended by both `Guild` and `OAuth2Guild`.

### ButtonInteraction

Provides gateway support for a `MessageComponentInteraction` coming from a button component.

### Channel

#### Channel#isText()

Checks and typeguards if a channel is Text-Based; one of `TextChannel`, `DMChannel`, `NewsChannel` or `ThreadChannel` 

#### Channel#isThread()

Checks and typeguards if a channel is a Thread type.

### CollectorOptions

#### CollectorOptions#filter

Constructing a `Collector` without providing a filter function will now throw a meaningful `TypeError`.

### CommandInteraction

Provides gateway support for Slash Command interactions. For more information refer to the [Slash Commands](/interactions/registering-slash-commands) section of the guide.

### Guild

#### Guild#bans

Provides access to the Guild's `GuildBanManager`.

#### Guild#create

`Guild#systemChannelFlags` can now be set in the `Guild#create` method.

#### Guild#edit

The `Guild#description` and `Guild#features` properties can now be edited.

#### Guild#editWelcomeScreen

Provides API support for bots to edit the Guild's `WelcomeScreen`.

#### Guild#emojis

The `GuildEmojiManager` class now extends `BaseGuildEmojiManager`.

In addition to the existing methods, it now supports `GuildEmojiManager#fetch`.

#### Guild#fetchWelcomeScreen

Provides API support for fetching the Guild's `WelcomeScreen`.

#### Guild#fetchWidget

Provides API support for the Guild's Widget, containing information about the guild and it's members.

#### Guild#invites

Provides access to the new `GuildInviteManager`.

#### Guild#nsfwLevel

Guilds can now be marked as NSFW.

#### Guild#owner

The `Guild#owner` property has been removed as it was unreliable due to caching, replaced with `Guild#fetchOwner`.

```diff
- console.log(guild.owner);
+ guild.fetchOwner().then(console.log);
```

#### Guild#premiumTier

The `Guild#premiumTier` property is now represented by the `PremiumTier` enum.

#### Guild#setChannelPositions

Now supports setting the parent of multiple channels, and locking their permissions via the `ChannelPosition#parent` and `ChannelPosition#lockPermissions` options.

### GuildBanManager

Provides improved API support for handling and caching bans.

### GuildChannel

#### GuildChannel#clone

Now supports setting the `position` property.

#### GuildChannel#createInvite

Now supports additional options:

- `targetUser` to target the invite to join a particular streaming user
- `targetApplication` to target the invite to a particular Discord activity
- `targetType`

### GuildChannelManager

#### GuildChannelManager#fetch

Now supports fetching the channels of a Guild.

### GuildInviteManager

Aligns support for creating and fetching invites with the managers design.

Replaces `Guild#fetchInvites`.

### GuildManager

#### GuildManager#create

Now supports specifying the AFK and system channels when creating a new guild.

#### GuildManager#fetch

Now supports fetching multiple guilds, returning a `Promise<Collection<Snowflake, OAuth2Guild>>` if used in this way.

### GuildEmojiManager

#### GuildEmojiManager#fetch

Provides API support for the `GET /guilds/{guild.id}/emojis` endpoint.

### GuildMember

#### GuildMember#pending

Flags whether a member has passed the guild's membership gate.

The flag is `true` before accepting and fires `guildMemberUpdate` when the member accepts.

### GuildMemberManager

Several methods were added to `GuildMemberManager` to provide API support for uncached members.

#### GuildMemberManager#edit

`guild.members.edit('123456789012345678', data, reason)`

Approximately equivalent to `GuildMember#edit(data, reason)` but does not resolve to a GuildMember.

#### GuildMemberManager#kick

`guild.members.kick('123456789012345678', reason)`

Equivalent to `GuildMember#kick(reason)`.

#### GuildMemberManager#search

Provides API support for querying GuildMembers via the REST API endpoint.

`GuildMemberManager#fetch` uses the websocket gateway to receive data.

### GuildMemberRoleManager

#### GuildMemberRoleManager#botRole

Gets the managed role this member created when joining the guild if any.

`member.roles.botRole`

#### GuildMemberRoleManager#premiumSubscriberRole

Gets the premium subscriber (booster) role if present on the member.

`member.roles.premiumSubscriberRole`

### GuildTemplate

Provides API support for [Server Templates](https://discord.com/developers/docs/resources/guild-template).

### Integration

#### Integration#roles

A Collection of Roles which are managed by the integration.

### Interaction

Provides gateway support for Slash Command and Message Component interactions. 

For more information refer to the [Slash Commands](/interactions/replying-to-slash-commands) and [Message Components](/interactions/buttons.html#responding-to-buttons) sections of the guide.

### InteractionCollector

Provides a way for users to collect any type of Interaction.

This class has a more flexible design that other Collectors, able to be bound to any Guild, Channel or Message as appropriate.

TypeScript developers can also leverage generics to define the subclass of Interaction that will be returned.

### InteractionWebhook

Provides webhook support specifically for interactions, due to their unique qualities.

### InviteGuild

Provides API support for the partial Guild data available from an `Invite`.

### InviteStageInstance

Provides API support for bots to inviting users to Stage Instances.

### Message

#### Message#awaitMessageComponent

A shortcut method to create a promisified `InteractionCollector` which resolves to a single `MessageComponentInteraction`.

#### Message#createMessageComponentCollector

A shortcut method to create an `InteractionCollector` for components on a specific message.

#### Message#crosspostable

Checks permissions to see if a Message can be crossposted.

#### Message#edit

Editing and/or removing attachments when editing a Message is now supported.

#### Message#fetchReference

Provides support for fetching the Message referenced by `Message#reference`, if the client has access to do so.

#### Message#react

Now supports both `<:name:id>` and `<a:name:id>` as valid inputs.

#### Message#stickers

A Collection of Stickers which were in the message.

### MessageActionRow

A builder class which makes constructing action row type Message Components easy.

### MessageAttachment

#### MessageAttachment#contentType

The media type of a MessageAttachment.

### MessageButton

A builder class which makes constructing button type Message Components easy.

### MessageComponentInteraction

Provides gateway support for receiving interactions from Message Components. Subclass of `Interaction`.

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

### MessageMentions

#### MessageMentions#repliedUser

Checks if the author of a message being replied to has been mentioned.

### MessagePayload

This class has been renamed from APIMessage.

Global headers can now be set in the HTTP options.

### MessageSelectMenu

A builder class which makes constructing select menu type Message Components easy.

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

### PermissionOverwriteManager

Replaces the `createOverwrite`, `updateOverwrite` and `overwritePermissions` methods of `GuildChannel`, aligning the design with other Managers.

### Role

#### Role#tags

Tags for roles belonging to bots, integrations, or premium subscribers.

### RoleManager

#### RoleManager#botRoleFor

`guild.roles.botRoleFor(user)`

Gets the managed role a bot created when joining the guild, if any.

#### RoleManager#edit

`guild.roles.edit('12345678987654321', options)`

Equivalent to `role.edit(options)`

#### RoleManager#premiumSubscriberRole

`guild.roles.premiumSubscriberRole`

Gets the premium subscriber (booster) role for the Guild, if any.

### SelectMenuInteraction

Provides gateway support for a `MessageComponentInteraction` coming from a select menu component.

### StageChannel

Provides API support for Stage Channels.

### StageInstance

Provides API support Stage Instances. Stage instances contain information about live stages.

### StageInstanceManager

Provides API support for the bot to create, edit and delete live Stage Instances, and stores a cache of Stage Instances.

### Sticker

Provides API support for Discord Stickers.

### TextChannel

#### TextChannel#awaitMessageComponent

A shortcut method to create a promisified `InteractionCollector` which resolves to a single `MessageComponentInteraction`

#### TextChannel#createMessageComponentCollector

A shortcut method to create an `InteractionCollector` for components on a specific channel.

#### TextChannel#setType

`channel.setType('news')`

Allows conversion between `TextChannel` and `NewsChannel`.

#### TextChannel#threads

Provides access to the `ThreadManager` for this channel.

### ThreadChannel

Provides API support for Thread Channels.

### ThreadChannelManager

Provides API support for the bot to create, edit and delete threads, and stores a cache of `ThreadChannels`.

### ThreadMember

Represent a member of a thread, and their thread-specific metadata.

### ThreadMemberManager

Provides API support for the bot to add and remove members from threads, and stores a cache of `ThreadMembers`.

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

### WelcomeChannel

Represents the channels that can be seen in a Guild's `WelcomeScreen`.

### WelcomeScreen

Provides API support for a Guild's Welcome Screen.

### Widget

Represents a Guild's Widget.

### WidgetMember

Partial information about a guild's members stored in a Widget.

### Util

#### Formatters

A number of new formatter functions are provided in the Util class, to easily handle adding markdown to strings.

#### Util#resolvePartialEmoji

A helper method that attempts to resolve properties for a raw emoji object from input data, without the use of the discord.js Client class or its EmojiManager.

#### Util#verifyString

A helper method which is used to internally validate string arguments provided to methods in discord.js.
