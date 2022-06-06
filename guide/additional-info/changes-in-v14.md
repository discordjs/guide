# Updating from v13 to v14

## Before you start

v14 requires Node 16.9 or higher to use, so make sure you're up to date. To check your Node version, use `node -v` in your terminal or command prompt, and if it's not high enough, update it! There are many resources online to help you with this step based on your host system.

### Builders are now included in v14

If you previously had `@discordjs/builders` manually installed it's _highly_ recommended that you uninstall the package to avoid package naming conflicts.

:::: code-group
::: code-group-item npm

```sh:no-line-numbers
npm uninstall @discordjs/builders
```

:::
::: code-group-item yarn

```sh:no-line-numbers
yarn remove @discordjs/builders
```

:::
::: code-group-item pnpm

```sh:no-line-numbers
pnpm remove @discordjs/builders
```

:::
::::

## Breaking Changes

### API version

discord.js v14 makes the switch to Discord API v10!

### Common Breakages

### Enum Values

Any areas that used to accept a `string` or `number` type for an enum parameter will now only accept exclusively `number`s.

In addition, the old enums exported by discord.js v13 and lower are replaced with new enums from [discord-api-types](https://discord-api-types.dev/api/discord-api-types-v10/enum/ActivityFlags).

#### New enum differences

Most of the difference between enums from discord.js and discord-api-types can be summarized as so:

1. Enums are singular, i.e., `ApplicationCommandOptionTypes` -> `ApplicationCommandOptionType`
2. Enums that are prefixed with `Message` no longer have the `Message` prefix, i.e., `MessageButtonStyles` -> `ButtonStyle`
3. Enum values are `PascalCase` rather than `SCREAMING_SNAKE_CASE`, i.e., `.CHAT_INPUT` -> `.ChatInput`

::: warning
You might be inclined to use raw `number`s (most commonly referred to as [magic numbers](<https://en.wikipedia.org/wiki/Magic_number_(programming)>)) instead of enum values. This is highly discouraged. Enums provide more readability and are more resistant to changes in the API. Magic numbers can obscure the meaning of your code in many ways, check out this [blog post](https://blog.webdevsimplified.com/2020-02/magic-numbers/) if you want more context on as to why they shouldn't be used.
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
+   type: ApplicationCommandOptionType.String,
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

##### Removal of method-based channel type guards

Channel some channel type guard methods that narrowed to one channel type have been removed. Instead compare the `type` property against a [ChannelType](https://discord-api-types.dev/api/discord-api-types-v10/enum/ChannelType) enum member to narrow channels.

```diff
-channel.isText()
+channel.type === ChannelType.GuildText

-channel.isVoice()
+channel.type === ChannelType.GuildVoice

-channel.isDM()
+channel.type === ChannelType.DM
```

### Builders

Builders are no longer returned by the API like they were previously. For example you send the API an `EmbedBuilder` but you receive an `Embed` of the same data from the API. This may affect how your code handles received structures such as components. Refer to [message component changes section](#messagecomponent) for more details.

### Activity

The following properties have been removed as they are not documented by Discord:

-   `Activity#id`
-   `Activity#platform`
-   `Activity#sessionId`
-   `Activity#syncId`

### Application

`Application#fetchAssets()` has been removed as it is no longer supported by the API.

### BitField

-   BitField constituents now have a `BitField` suffix to avoid naming conflicts with the enum names:

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

-   `#FLAGS` has been renamed to `#Flags`

### CDN

Methods that return CDN URLs will now return a dynamic image URL (if available). This behavior can be overridden by setting `forceStatic` to `true` in the `ImageURLOptions` parameters.

### CategoryChannel

`CategoryChannel#children` is no longer a `Collection` of channels the category contains. It is now a manager (`CategoryChannelChildManager`). This also means `CategoryChannel#createChannel()` has been moved to the `CategoryChannelChildManager`.

### Channel

-   Some type guards have been removed, refer to [this section](#removal-of-method-based-channel-type-guards) for more context.
    -   `Channel#isText()` has been removed.
    -   `Channel#isVoice()` has been removed.
    -   `Channel#isDirectory()` has been removed.
    -   `Channel#isDM()` has been removed.
    -   `Channel#isGroupDM()` has been removed.
    -   `Channel#isCategory()` has been removed.
    -   `Channel#isNews()` has been removed.

::: tip
TypeScript users should narrow `Channel` types via type guards in order to get more specific typings.
:::

### CommandInteractionOptionResolver

`CommandInteractionOptionResolver#getMember()` no longer has a parameter for `required`. See [this pull request](https://github.com/discordjs/discord.js/pull/7188) for more information.

### `Constants`

-   Many constant objects and key arrays are now top-level exports for example:

```diff
- const { Constants } = require('discord.js');
- const { Colors } = Constants;
+ const { Colors } = require('discord.js');
```

-   The refactored constants structures have `PascalCase` member names as opposed to `SCREAMING_SNAKE_CASE` member names.

-   Many of the exported constants structures have been replaced and renamed:

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

`applicationCommandCreate`, `applicationCommandDelete` and `applicationCommandUpdate` have all been removed. See [this pull request](https://github.com/discordjs/discord.js/pull/6492) for more information.

The `ThreadMembersUpdate` event now emits the users who were added, the users who were removed, and the thread respectively.

### GuildBanManager

The `days` option when banning a user has been renamed to `deleteMessageDays` to be more aligned to the API name.

### Guild

`Guild#setRolePositions()` and `Guild#setChannelPositions()` have been removed. Use `RoleManager#setPositions()` and `GuildChannelManager#setPositions()` instead respectively.

`Guild#maximumPresences` no longer has a default value of 25,000.

`Guild#me` has been moved to `GuildMemberManager#me`. See [this pull request](https://github.com/discordjs/discord.js/pull/7669) for more information.

### GuildAuditLogs & GuildAuditLogsEntry

`GuildAuditLogs.build()` has been removed as it has been deemed defunct. There is no alternative.

The following properties & methods have been moved to the `GuildAuditLogsEntry` class:

-   `GuildAuditLogs.Targets`
-   `GuildAuditLogs.actionType()`
-   `GuildAuditLogs.targetType()`

### GuildMember

`GuildMember#pending` is now nullable to account for partial guild members. See [this issue](https://github.com/discordjs/discord.js/issues/6546) for more information.

### IntegrationApplication

`IntegrationApplication#summary` has been removed as it is no longer supported by the API.

### Interaction

The following typeguards on `Interaction` have been renamed:

```diff
- interaction.isCommand()
+ interaction.isChatInputCommand()

- interaction.isContextMenu()
+ interaction.isContextMenuCommand()
```

In addition, `Interaction#isCommand()` now indicates whether the command is an _application command_. This differs from the previous implementation where `Interaction#isCommand()` indicated if the interaction was a chat input command.

### Invite

`Invite#channel` and `Invite#inviter` are now getters and resolve structures from the cache.

### MessageComponent

-   MessageComponents have been renamed as well. They no longer have the `Message` prefix, and now have a `Builder` suffix:

```diff
- const button = new MessageButton();
+ const button = new ButtonBuilder();

- const selectMenu = new MessageSelectMenu();
+ const selectMenu = new SelectMenuBuilder();

- const actionRow = new MessageActionRow();
+ const actionRow = new ActionRowBuilder();

- const textInput = new TextInputComponent();
+ const textInput = new TextInputBuilder();
```

-   Components received from the API are no longer directly mutable. If you wish to mutate a component from the API, use `ComponentBuilder#from`. For example, if you want to make a button mutable:

```diff
- const editedButton = receivedButton
-   .setDisabled(true);

+ const { ButtonBuilder } = require('discord.js');
+ const editedButton = ButtonBuilder.from(receivedButton)
+   .setDisabled(true);
```

### MessageManager

`MessageManager#fetch()`'s second parameter has been removed. The `BaseFetchOptions` the second parameter once was is now merged into the first parameter.

```diff
- messageManager.fetch('1234567890', { cache: false, force: true });
+ messageManager.fetch({ message: '1234567890', cache: false, force: true });
```

### MessageSelectMenu

-   `MessageSelectMenu` has been renamed to `SelectMenuBuilder`

-   `SelectMenuBuilder#addOption()` has been removed. Use `SelectMenuBuilder#addOptions()` instead.

### MessageEmbed

-   `MessageEmbed` has now been renamed to `EmbedBuilder`.

-   `EmbedBuilder#setAuthor()` now accepts a sole [`EmbedAuthorOptions`](https://discord.js.org/#/docs/builders/main/typedef/EmbedAuthorData) object.

-   `EmbedBuilder#setFooter()` now accepts a sole [`FooterOptions`](https://discord.js.org/#/docs/builders/main/typedef/EmbedFooterOptions) object.

-   `EmbedBuilder#addField()` has been removed. Use `EmbedBuilder#addFields()` instead.

```diff
- new MessageEmbed().addFields(...[
-  { name: 'one', value: 'one' },
-  { name: 'two', value: 'two' },
-]);

+ new EmbedBuilder().addFields([
+  { name: 'one', value: 'one' },
+  { name: 'two', value: 'two' },
+]);
```

### PartialTypes

The `PartialTypes` string array has been removed. Use the `Partials` enum instead.

In addition to this, there is now a new partial: `Partials.ThreadMember`.

### Permissions

Thread permissions `USE_PUBLIC_THREADS` and `USE_PRIVATE_THREADS` have been removed as they are deprecated in the API. Use `CREATE_PUBLIC_THREADS` and `CREATE_PRIVATE_THREADS` respectively.

### PermissionOverwritesManager

Overwrites are now keyed by the `PascalCase` permission key rather than the `SCREAMING_SNAKE_CASE` permission key.

### REST Events

The following discord.js events have been removed from the `Client`:

-   `apiRequest`
-   `apiResponse`
-   `invalidRequestWarning`
-   `rateLimit`

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

`Role.comparePositions()` has been removed. Use `RoleManager#comparePositions()` instead.

### ThreadMemberManager

`ThreadMemberManager#fetch()` now only takes a single object of type `ThreadMemberFetchOptions`.

### Util

`Util.removeMentions()` has been removed. To control mentions, you should use `allowedMentions` on `MessageOptions` instead.

`Util.splitMessage()` has been removed. This utility method is something the developer themselves should do.

### `.deleted` Field(s) have been removed

You can no longer use the `deleted` property to check if a structure was deleted. See [this issue](https://github.com/discordjs/discord.js/issues/7091) for more information.

### VoiceChannel

`VoiceChannel#editable` has been removed. You should use `GuildChannel#manageable` instead.

Many of the analogous enums can be found in the discord-api-types docs. [discord-api-types](https://discord-api-types.dev/api/discord-api-types-v10/enum/ActivityFlags)

### VoiceRegion

`VoiceRegion#vip` has been removed as it is no longer part of the API.

### Webhook

`Webhook#fetchMessage()` now only takes one sole object of type `WebhookFetchMessageOptions`.

## Features

### Channel

Store channels have been removed as they are no longer part of the API.

`Channel#url` has been added which is a link to a channel, just like in the client.

Additionally, new typeguards have been added:

-   `Channel#isDMBased()`
-   `Channel#isTextBased()`
-   `Channel#isVoiceBased()`

### Collection

-   Added `Collection#merge()` and `Collection#combineEntries()`.
-   New type: `ReadonlyCollection` which indicates an immutable `Collection`.

### GuildEmojiManager

Added `GuildEmojiManager#delete()` and `GuildEmojiManager#edit()` for managing existing guild emojis.

### Interaction

Added `Interaction#isRepliable()` to check whether a given interaction can be replied to.

### Unsafe Builders

Unsafe builders operate exactly like regular builders except they perform no validation on input. Unsafe builders are named by adding an `Unsafe` prefix to a regular builder.

### Webhook

Added `Webhook#applicationId`.
