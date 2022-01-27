# Updating from v13 to v14

## Before you start

v14 requires Node 16.9 or higher to use, so make sure you're up to date. To check your Node version, use `node -v` in your terminal or command prompt, and if it's not high enough, update it! There are many resources online to help you with this step based on your host system.

## Breaking Changes

### Enum Values

Any areas that used to accept a `string` or `number` type for an enum parameter will now only accept exclusively `number`s.

In addition, the old enums exported by discord.js v13 and lower are replaced with new enums from discord-api-types (link here).

<details>
<summary> New enum differences </summary>
  Most of the difference between enums from discord.js and discord-api-type can be summarized as so:

1. Enums are singular ie `ApplicationCommandOptionTypes` -> `ApplicationCommandOptionType`
2. Enums that are prefixed with `Message` no longer have the `Message` prefix ie `MessageButtonStyles` -> `ButtonStyle`
3. Enum values are `PascalCase` rather than `SCREAMING_SNAKE_CASE` ie `.CHAT_INPUT` -> `.ChatInput`
 </details>

There are two recommended ways of representing enum values:

1. Use the actual enum type: `ButtonStyle.Primary`
2. Continue using a string representation but instead use the new `EnumResolver`:

```js
const { EnumResolver } = require('discord.js');
const enumValue = EnumResolvers.resolveButtonStyle('PRIMARY');
```

Areas like JSON slash commands and JSON message compononents will likely need to be modified to accomodate these changes:

**Application commands**:

```diff
+ const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

const command = {
  name: 'ping',
- type: 'CHAT_INPUT',
+ type: ApplicationCommandType.ChatInput
  options: [
    name: 'option',
    description: 'A sample option'
-   type: 'STRING',
+   type: ApplicationCommandOptionType.String
  ],
};
```

**Buttons**:

```diff
+ const { ButtonStyle } = require('discord.js');

const button = {
  label: 'test'
- style: 'PRIMARY'
+ style: ButtonStyle.Primary
  customId: '1234'
}
```

### Event Removals

`message` and `interaction` events are now removed. Use `messageCreate` and `interactionCreate` instead.

`applicationCommandCreate`, `applicationCommandDelete` and `applicationCommandUpdate` have all been removed. Refer to [this PR](https://github.com/discordjs/discord.js/pull/6492) for context.

# Utility Changes

`Util#removeMentions` has been removed.

### CDN Changes

Methods that return CDN URLs will now return a dynamic image URL (if available). This behavior can be overriden by setting `forceStatic` to `false` in the `MakeURLOptions` parameters.

### Guild Object Changes

All `Guild#setXPositions` methods have been removed, use `RoleManager#setPositions` and `GuildChannelManager#setPositions` instead.

### Role Manager

`#comparePositions` has been moved from `Role` to `RoleManager`

### `.deleted` Field(s) have been removed

You can no longer use `#deleted` to check if a structure was deleted or not. 

Check out [the pull request](https://github.com/discordjs/discord.js/pull/7092) for more context.

### Message Embed Changes

- `MessageEmbed` has now been renamed to `Embed`

- `#setFooter` now accepts a sole object `APIEmbedFooter` object. (add link to dapi site)

- `#addField` and `#addFields` both accept an object or array of `APIEmbedField`(s) respectively. (add link to dapi site)

### Message Component Changes

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

### Interaction typeguard changes

The following typeguards on `Interaction` have been renamed:

```diff
- interaction.isCommand()
+ interaction.isChatInputCommand()

- interaction.isContextMenu()
+ interaction.isContextMenuCommand()
```

In addition, `Interaction#isCommand`, now indicates whether the command is an *application command* or not. This differs from the previous implementation where `isCommand()` indicated if the interaction was a chat input command or not.