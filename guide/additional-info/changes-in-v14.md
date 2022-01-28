# Updating from v13 to v14

## Before you start

v14 requires Node 16.9 or higher to use, so make sure you're up to date. To check your Node version, use `node -v` in your terminal or command prompt, and if it's not high enough, update it! There are many resources online to help you with this step based on your host system.

## Breaking Changes

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
2. Continue using a string representation but instead use the new `EnumResolver`:

```js
const { EnumResolver } = require('discord.js');
const enumValue = EnumResolvers.resolveButtonStyle('PRIMARY');
```

Areas like JSON slash commands and JSON message compononents will likely need to be modified to accomodate these changes:

#### Common Application Command Data changes

```diff
+ const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

const command = {
  name: 'ping',
- type: 'CHAT_INPUT',
+ type: ApplicationCommandType.ChatInput,
  options: [
    name: 'option',
    description: 'A sample option'
-   type: 'STRING',
+   type: ApplicationCommandOptionType.String
  ],
};
```

#### Common Button Data changes

```diff
+ const { ButtonStyle } = require('discord.js');

const button = {
  label: 'test'
- style: 'PRIMARY',
+ style: ButtonStyle.Primary,
  customId: '1234'
}
```

### Events

The `message` and `interaction` events are now removed. Use `messageCreate` and `interactionCreate` instead.

`applicationCommandCreate`, `applicationCommandDelete` and `applicationCommandUpdate` have all been removed. Refer to [this pull request](https://github.com/discordjs/discord.js/pull/6492) for context.

#### REST Events

The following discord.js events:
- `invalidRequestWarning`
- `request`
- `response`
- `rateLimited`
- `newListener`
- `removeListener`

Have been removed from the `Client` in discord.js. Instead you should access these events from `Client#rest`.

### Util

`Util#removeMentions` has been removed, to control mentions you should use `allowedMentions` on `MessageOptions` instead.

### CDN

Methods that return CDN URLs will now return a dynamic image URL (if available). This behavior can be overriden by setting `forceStatic` to `true` in the `MakeURLOptions` parameters.

### Guild

`Guild#setRolePositions` and `Guild#setChannelPositions` have been removed. Use `RoleManager#setPositions` and `GuildChannelManager#setPositions` instead respectively.

### ThreadMemberManager

`ThreadMemberManager#fetch` now only takes a single object of type `ThreadMemberFetchOptions`.

### RoleManager

`Role.comparePositions` has been removed. Use `RoleManager#comparePositions` instead.

### `.deleted` Field(s) have been removed

You can no longer use `#deleted` to check if a structure was deleted or not. 

Check out [the issue ticket](https://github.com/discordjs/discord.js/issues/7091) for more context.

### Channel

`Channel#createdAt` and `Channel#createdTimestamp` are now nullable. On any regular channel or private thread `#createdAt` and `#createTimestamp` will always be non-null. This value is only nullable for public threads. 

::: tip
TypeScript users should narrow `Channel` types via type guards in order to get more specific typings.
:::

### MessageEmbed

- `MessageEmbed` has now been renamed to `Embed`

- `#setFooter` now accepts a sole `FooterOptions` object. (add link to dapi site)

- `#addField` and `#addFields` both accept an object or array of `APIEmbedField`(s) respectively. (add link to dapi site)

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

Many of the analogous enums can be found be found in the discord-api-types docs (link website here)

### Interaction

The following typeguards on `Interaction` have been renamed:

```diff
- interaction.isCommand()
+ interaction.isChatInputCommand()

- interaction.isContextMenu()
+ interaction.isContextMenuCommand()
```

In addition, `Interaction#isCommand`, now indicates whether the command is an *application command* or not. This differs from the previous implementation where `isCommand()` indicated if the interaction was a chat input command or not.

### VoicesRegion Changes

`VoiceRegion#vip` has been removed as the field is no longer part of the API.

### Application

`Application#fetchAssets` has been removed as it is no longer supported by the API.

## Features

### Enum Resolvers
The new `EnumResolvers` class allows you to transform `SCREAMING_SNAKE_CASE` enum keys to an enum value.

```js
const { EnumResolvers } = require('discord.js');

// Returns `ButtonStyle.Primary`
const buttonStyle = EnumResolvers.buttonStyle('PRIMARY');
```