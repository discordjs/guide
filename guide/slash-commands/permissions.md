# Slash command permissions

Slash commands have their own permissions system, which allows you to set the level of permissions required in order for a user to to use a command. 

The slash command permissions for guilds are defaults only and can be altered by guild administrators. Your code should not try to enforce its own permission management, as this can result in a conflict between the server-configured permissions and your bot's code.

::: warning
It is not possible to prevent users with Administrator permissions from using any commands deployed to their guild.
:::

## DM permission

You can use the `ApplicationCommand#setDMPermission()` method to control if a global command can be used in DMs. By default, all global commands can be used in DMs.

```js {6}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('boop')
	.setDescription('Replies with beep!')
	.setDMPermission(false);
```

## Member permissions

You can use the `ApplicationCommand#setDefaultMemberPermissions()` method to set the default permissions required for a member to run the command. Setting it to `0` will prohibit anyone in a guild from using the command unless a specific overwrite is configured or the user has the Administrator permission flag.

::: tip
If you want to learn more about the `|` bitwise OR operator you can check the [Wikipedia](https://en.wikipedia.org/wiki/Bitwise_operation#OR) and [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_OR) articles on the topic.
:::

```js {9}
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('ban')
	.setDescription('Select a member and ban them (but not really).')
	.addUserOption(option =>
		option.setName('target').setDescription('The member to ban'))
	.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers);
```

And that's all you need to know on slash command permissions!
