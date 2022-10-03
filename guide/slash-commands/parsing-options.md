# Parsing options

## Command options

In this section, we'll cover how to access the values of a command's options. Let's consider a `ban` command example with two options:

```js {6-14}
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Select a member and ban them.')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('The member to ban')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('reason')
				.setDescription('The reason for banning'))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setDMPermission(false),
};
```

In the execute method, we'll get the value of these two options from the `CommandInteractionOptionResolver` as shown below:

```js {4-8}
module.exports = {
	// data: new SlashCommandBuilder()...
	async execute(interaction) {
		const target = interaction.options.getUser('target');
		const reason = interaction.options.getString('reason') ?? 'No reason provided';

		await interaction.reply(`Banning ${targetUser.username} for reason: ${reason}`);
		await interaction.guild.members.ban(target);
	},
};
```

From our ban command options, we're able to get our `target` user and the `reason` for which we're going to ban them. Since `reason` isn't a required option, we've also set a default value using [nullish coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator). 

If the target user is still in the guild where the command is being run, we'd also be able to `.getMember('target')` to get their `GuildMember` object.

::: tip
If you want the Snowflake of a structure instead, grab the option via `get()` and access the Snowflake via the `value` property. Note that you should use `const { value: name } = ...` here to [destructure and rename](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) the value obtained from the <DocsLink path="typedef/CommandInteractionOption" /> structure to avoid identifier name conflicts.
:::

In the same way as the above examples, you can get values of any type using the corresponding `CommandInteractionOptionResolver#get_____()` method. `String`, `Integer`, `Number` and `Boolean` options all provide the respective primitive types, while `User`, `Channel`, `Role` and `Mentionable` options will provide either the respective discord.js class if your application has a bot user in the guild, or a raw API structure for commands-only deployments.

### Subcommands

If you have a command that contains subcommands, the `CommandInteractionOptionResolver#getSubcommand()` will tell you which subcommand was used. You can then get any additional options of the selected subcommand using the same methods as above.

The snippet below uses the same `info` command from the [subcommand creation guide](/slash-commands/advanced-creation.md#subcommands) to demonstrate how we can control the logic flow when replying to different subcommands:

```js {4,11}
module.exports = {
	// data: new SlashCommandBuilder()...
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'user') {
			const user = interaction.options.getUser('target');

			if (user) {
				await interaction.reply(`Username: ${user.username}\nID: ${user.id}`);
			} else {
				await interaction.reply(`Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`);
			}
		} else if (interaction.options.getSubcommand() === 'server') {
			await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
		}
	},
};
```
