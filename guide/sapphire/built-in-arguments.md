# Built-in arguments

To facilitate with getting your bot running, Sapphire Framework defines a large set of built-in argument resolvers.

- `boolean`: Resolves to a `boolean` value.
- `channel`: Resolves to a `Channel` instance given a channel mention or ID.
- `date`: Resolves to a `Date` instance given a valid date format.
- `dmChannel`: Resolves to a `DMChannel` instance given a DM channel ID or user's ID.
- `float` / `number`: Resolves to any number.
- `guildCategoryChannel`: Resolves to a `CategoryChannel` instance given a category channel ID.
- `guildChannel`: Resolves to a `GuildChannel` or a `ThreadChannel` instance given a channel mention or ID.
- `guildNewsChannel`: Resolves to a `NewsChannel` instance given a news channel mention or ID.
- `guildNewsThreadChannel`: Resolves to a `ThreadChannel` instance of type `GUILD_NEWS_THREAD` given a thread channel mention or ID.
- `guildPrivateThreadChannel`: Resolves to a `ThreadChannel` instance of type `GUILD_PRIVATE_THREAD` given a thread channel mention or ID.
- `guildPublicThreadChannel`: Resolves to a `ThreadChannel` instance of type `GUILD_PUBLIC_THREAD` given a thread channel mention or ID.
- `guildStageVoiceChannel`: Resolves to a `StageChannel` instance given a stage voice channel mention or ID.
- `guildTextChannel`: Resolves to a `TextChannel` instance given a text channel mention or ID.
- `guildThreadChannel`: Resolves to a `ThreadChannel` instance given a thread channel mention or ID.
- `guildVoiceChannel`: Resolves to a `VoiceChannel` instance given a voice channel mention or ID.
- `hyperlink` / `url`: Resolves to a `URL` instance given a valid URL.
- `integer`: Resolves to a safe integer.
- `member`: Resolves to a `GuildMember` instance given a member mention or ID.
- `message`: Resolves to a `Message` instance given a message link or ID.
- `number`: Resolves to any number.
- `role`: Resolves to a `Role` instance given a role mention or ID.
- `string`: Resolves to a string containing the parameter.
- `user`: Resolves to a `User` instance given a user mention or ID.

:::tip
They can be used anytime using the `Args` class, and can be accessed via `container.stores.get('arguments')`.
:::

:::warning Overriding
If you define an `Argument` with the same as a built-in one, e.g. `boolean`, the one defined in your directory will replace the built-in one. This same mechanism applies to all other stores from Framework and plugins.
:::
