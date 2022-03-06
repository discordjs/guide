# Updating from v13 to v14

## Before you start

v14 requires Node 16.9 or higher to use, so make sure you're up to date. To check your Node version, use `node -v` in your terminal or command prompt, and if it's not high enough, update it! There are many resources online to help you with this step based on your host system.

## Breaking Changes

### Common Breakages

### Enum Values

Any areas that used to accept a `string` or `number` type for an enum parameter will now only accept exclusively `number`s.

In addition, the old enums exported by discord.js v13 and lower are replaced with new enums from discord-api-types (link here).

<details>
<summary> New enum differences </summary>
  Most of the difference between enums from discord.js and discord-api-types can be summarized as so:

1. Enums are singular, i.e., `ApplicationCommandOptionTypes` -> `ApplicationCommandOptionType`
2. Enums that are prefixed with `Message` no longer have the `Message` prefix, i.e., `MessageButtonStyles` -> `ButtonStyle`
3. Enum values are `PascalCase` rather than `SCREAMING_SNAKE_CASE`, i.e., `.CHAT_INPUT` -> `.ChatInput`
</details>

There are two recommended ways of representing enum values:

1. Use the actual enum type: `ButtonStyle.Primary`
2. Continue using a string representation but instead use the new `EnumResolvers`:

```js
const { EnumResolvers } = require('discord.js');
const enumValue = EnumResolvers.resolveButtonStyle('PRIMARY');
```

::: warning
You might be inclined to use raw `number`s (most commonly referred to as [magic numbers](https://en.wikipedia.org/wiki/Magic_number_(programming))) instead of enum values. This is highly discouraged. Enums provide more readability and are more resistant to changes in the API. Magic numbers can obscure the meaning of your code in many ways, check out this [blog post](https://blog.webdevsimplified.com/2020-02/magic-numbers/) if you want more context on as to why they shouldn't be used.
:::

#### Common enum breakages

Areas like `Client` initialization, JSON slash commands and JSON message components will likely need to be modified to accommodate these changes:

##### Common Client Initialization Changes

```diff
- const { Client, Intents } = require('discord.js');
+ const { Client, GatewayIntentBits, Partials } = require('discord.js');

- const client = new Client({ intents: [Intents.FLAGS.GUILDS], partials: ['CHANNEL'] });
+ const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });
```

##### Common Application Command Data changes

```diff
+ const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

const command = {
  name: 'ping',
- type: 'CHAT_INPUT',
+ type: ApplicationCommandType.ChatInput,
  options: [
    name: 'option',
    description: 'A sample option',
-   type: 'STRING',
+   type: ApplicationCommandOptionType.String
  ],
};
```

##### Common Button Data changes

```diff
+ const { ButtonStyle } = require('discord.js');

const button = {
  label: 'test',
- style: 'PRIMARY',
+ style: ButtonStyle.Primary,
  customId: '1234'
}
```

### Application

`#fetchAssets` has been removed as it is no longer supported by the API.

### BitField

- BitField constituents now have a `BitField` suffix to avoid naming conflicts with the enum names:

```diff
- new Permissions()
+ new PermissionsBitField()

- new MessageFlags()
+ new MessageFlagsBitField()

- new ThreadMemberFlags()
+ new ThreadMemberFlagsBitField()

- new UserFlags()
+ new UserFlagsBitField()

- new SystemChannelFlags()
+ new SystemChannelFlagsBitField()

- new ApplicationFlags()
+ new ApplicationFlagsBitField()

- new Intents()
+ new IntentsBitField()

- new ActivityFlags()
+ new ActivityFlagsBitField()
```

- `#FLAGS` has been renamed to `#Flags`

### CDN

Methods that return CDN URLs will now return a dynamic image URL (if available). This behavior can be overridden by setting `forceStatic` to `true` in the `ImageURLOptions` parameters.

### CategoryChannel

`CategoryChannel#children` is no longer a `Collection` of channels the category contains. It is now a manager (`CategoryChannelChildManager`). This also means `CategoryChannel#createChannel` has been moved to the `CategoryChannelChildManager`.

### Channel

- `#isText` has been renamed to `#isTextBased`
- `#isVoice` has been renamed to `#isVoiceBased`

::: tip
TypeScript users should narrow `Channel` types via type guards in order to get more specific typings.
:::

### CommandInteractionOptionResolver

`#getMember` no longer has a parameter for `required`, check out [this pull request](https://github.com/discordjs/discord.js/pull/7188) for details.

### `Constants`

- Many constant objects and key arrays are now top-level exports for example:

```diff
- const { Constants } = require('discord.js');
- const { Colors } = Constants;
+ const { Colors } = require('discord.js');
```

- The refactored constants structures have `PascalCase` member names as opposed to `SCREAMING_SNAKE_CASE` member names.

- Many of the exported constants structures have been replaced and renamed:
```diff
- Opcodes
+ GatewayOpcodes

- WSEvents
+ GatewayDispatchEvents

- WSCodes
+ GatewayCloseCodes

- InviteScopes
+ OAuth2Scopes
```

### Events

The `message` and `interaction` events are now removed. Use `messageCreate` and `interactionCreate` instead.

`applicationCommandCreate`, `applicationCommandDelete` and `applicationCommandUpdate` have all been removed. Refer to [this pull request](https://github.com/discordjs/discord.js/pull/6492) for context.

### GuildBanManager

The `days` option when banning a user has been renamed to `deleteMessageDays` to be more aligned to the API name.

### Guild

`#setRolePositions` and `#setChannelPositions` have been removed. Use `RoleManager#setPositions` and `GuildChannelManager#setPositions` instead respectively.

`Guild#maximumPresences` no longer has a default value of 25,000.

### GuildMember

`GuildMember#pending` is now nullable to account for partial guild members. See [this issue](https://github.com/discordjs/discord.js/issues/6546) for a more in-depth reason.

### Interaction

The following typeguards on `Interaction` have been renamed:

```diff
- interaction.isCommand()
+ interaction.isChatInputCommand()

- interaction.isContextMenu()
+ interaction.isContextMenuCommand()
```

In addition, `#isCommand`, now indicates whether the command is an _application command_ or not. This differs from the previous implementation where `#isCommand` indicated if the interaction was a chat input command or not.

### Invite

`#channel` and `#inviter` are now getters and resolve structures from the cache.

### MessageComponent

MessageComponents have been renamed as well. They no longer have the `Message` prefix:

```diff
- const button = new MessageButton();
+ const button = new ButtonComponent();

- const selectMenu = new MessageSelectMenu();
+ const selectMenu = new SelectMenuComponent();

- const actionRow = new MessageActionRow();
+ const actionRow = new ActionRow();
```

### MessageSelectMenu

- `MessageSelectMenu` has been renamed to `SelectMenuComponent`

- `#addOption` has been removed use `#addOptions` instead.

### MessageEmbed

- `MessageEmbed` has now been renamed to `Embed`.

- `#setAuthor` now accepts a sole `AuthorOptions` object. (add link to dapi site)

- `#setFooter` now accepts a sole `FooterOptions` object. (add link to dapi site)

- `#addField` has been removed, use `#addFields` instead.

- `#addFields` accepts an object or a rest array of `APIEmbedField`(s): (add link to dapi site)

```diff
- new MessageEmbed().addFields([
-  { name: 'one', value: 'one' },
-  { name: 'two', value: 'two' },
- ]);

+ new Embed().addFields(
+  { name: 'one', value: 'one' },
+  { name: 'two', value: 'two' },
+);
```

### PartialTypes

The `PartialTypes` string array has been removed, instead use the `Partials` enum.

### Permissions

Thread permissions `USE_PUBLIC_THREADS` and `USE_PRIVATE_THREADS` have been removed as they are now deprecated in the API. Instead use the newer `*Threads` permission flags.

### PermissionOverwritesManager

Overwrites are now keyed by the `PascalCase` permission key rather than the `SCREAMING_SNAKE_CASE` permission key.

### REST Events

The following discord.js events have been removed from the `Client`:

- `apiRequest`
- `apiResponse`
- `invalidRequestWarning`
- `rateLimit`

Instead you should access these events from `Client#rest`. In addition, the `apiRequest`, `apiResponse` and `rateLimit` events have been renamed:

```diff
- client.on('apiRequest', ...);
+ client.rest.on('request', ...);

- client.on('apiResponse', ...);
+ client.rest.on('response', ...);

- client.on('rateLimit', ...);
+ client.rest.on('rateLimited', ...);
```

### RoleManager

`Role.comparePositions` has been removed. Use `RoleManager#comparePositions` instead.

### ThreadMemberManager

`#fetch` now only takes a single object of type `ThreadMemberFetchOptions`.

### Util

`#removeMentions` has been removed, to control mentions you should use `allowedMentions` on `MessageOptions` instead.

### `.deleted` Field(s) have been removed

You can no longer use `#deleted` to check if a structure was deleted or not.

Check out [the issue ticket](https://github.com/discordjs/discord.js/issues/7091) for more context.

### VoiceChannel

`#editable` has been removed, instead you should use `GuildChannel#manageable` for checking this permission.

Many of the analogous enums can be found in the discord-api-types docs. (link website here)

### VoiceRegion

`#vip` has been removed as the field is no longer part of the API.

### Webhook

`#fetchMessage` now only takes one sole object of type `WebhookFetchMessageOptions`.

## Features

### Channel

`#url` has been added which is a link to a channel, just like in the client.

Additionally, new typeguards have been added:

- `#isCategory`
- `#isDM`
- `#isDMBased`
- `#isGroupDM`
- `#isNews`
- `#isStage`
- `#isStore`
- `#isText`\*
- `#isTextBased`
- `#isVoice`\*
- `#isVoiceBased`

\*These methods existed previously but behaved differently. Refer to the docs for their specific changes.

### Collection

- Added `#merge` and `#combineEntries` methods.
- New type: `ReadonlyCollection` which indicates an immutable `Collection`.

### Enum Resolvers

The new `EnumResolvers` class allows you to transform `SCREAMING_SNAKE_CASE` enum keys to an enum value.

```js
const { EnumResolvers } = require('discord.js');

// Returns `ButtonStyle.Primary`
const buttonStyle = EnumResolvers.resolveButtonStyle('PRIMARY');
```
### GuildEmojiManager

Added `#delete` and `#edit` methods for managing existing guild emojis.

### GuildScheduledEvent

Added `#coverImage` and `coverImageURL` for getting cover image data for a guild scheduled event.

### Interaction

Added `#isRepliable` to check whether a given interaction can be replied to.

### Unsafe Builders

Unsafe builders operate exactly like regular builders except they perform no validation on input. Unsafe builders are named by adding an `Unsafe` prefix to a regular builder.

### Webhook

Added `applicationId` property.