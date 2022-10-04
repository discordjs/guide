# Slash command permissions

Slash commands have their own permissions system. This system allows you to set the default level of permissions required for a user to to execute a command when its first deployed or your bot is added to a new server.

The slash command permissions for guilds are defaults only and can be altered by guild administrators, allowing them to configure access however best suits their moderation and server roles. Your code should not try to enforce its own permission management, as this can result in a conflict between the server-configured permissions and your bot's code.

::: warning
It is not possible to prevent users with Administrator permissions from using any commands deployed to their guild. Think twice before creating "dev-only" commands such as an `eval`.
:::

## Member permissions

You can use <DocsLink section="builders" path="class/SlashCommandBuilder?scrollTo=setDefaultMemberPermissions" type="method" /> to set the default permissions required for a member to run the command. Setting it to `0` will prohibit anyone in a guild from using the command unless a specific overwrite is configured or the user has the Administrator permission flag.

For this, we'll look at two common moderation commands, `ban` and `kick`. For a ban command, a sensible default is to ensure that users already have the Discord permission `BanMembers` in order to execute this command.

```js {9}
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('ban')
	.setDescription('Select a member and ban them.')
	.addUserOption(option =>
		option
			.setName('target')
			.setDescription('The member to ban')
			.setRequired(true))
	.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);
```

For a kick command however, we can allow members with either `BanMembers` or `KickMembers` to execute the command, so we'll list both flags here joined by the bitwise OR operator.

::: tip
If you want to learn more about the `|` bitwise OR operator you can check the [Wikipedia](https://en.wikipedia.org/wiki/Bitwise_operation#OR) and [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_OR) articles on the topic.
:::

```js {9}
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('kick')
	.setDescription('Select a member and kick them.')
	.addUserOption(option =>
		option
			.setName('target')
			.setDescription('The member to kick')
			.setRequired(true))
	.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers);
```

In reality, you'll probably want to have an additional confirmation step before a ban actually executes. Check out the [button components section]() of the guide to see how to add confirmation buttons to your command responses, and listen to button clicks.

## DM permission

By default, globally-deployed commands are also available for use in DMs. You can use <DocsLink section="builders" path="class/SlashCommandBuilder?scrollTo=setDMPermission" type="method" /> to disable this behaviour. Commands deployed to specific guilds are not available in DMs.

It wouldn't make much sense for our `ban` command to be available in DMs, so we'll `setDMPermission(false)` to remove it.

```js {6}
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('ban')
	.setDescription('Select a member and ban them.')
	.addUserOption(option =>
		option
			.setName('target')
			.setDescription('The member to ban')
			.setRequired(true))
	.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
	.setDMPermission(false);
```

And that's all you need to know on slash command permissions!