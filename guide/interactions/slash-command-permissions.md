# Slash command permissions

Need to keep some of your commands safe from prying eyes, or only available to the right people? Slash commands support permission overwrites! For both guild and global commands, you can enable or disable a specific **user** or **role** in a guild from using a command.

::: tip
For now, if you don't have permission to use a command, they'll show up in the command picker as disabled and unusable. They will **not** be hidden.
:::

As you might have noticed now, you were able to use all of your slash commands right after registering them. This is because the `default_permission` of a slash command is set to `true` by default if you don't specify it **during registration**.

You can set the `default_permission` of your slash command to `false` if you want them to be disabled for everyone (literally). Setting `default_permission` to `false` will disallow *anyone* in a guild from using the command—even Administrators and guild owners—unless a specific overwrite is configured. **It will also disable the command (if it's a global one) from being usable in DMs**.

You can set the `default_permission` of a slash command with the `setDefaultPermission()` method of the `SlashCommandBuilder()` builder that you have been using so far. For example, if you want to do that for the `ping` command:

```js:no-line-numbers {4}
new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with pong!')
  .setDefaultPermission(false) // defaults to "true" if not specified
```

Since the `default_permission` will either allow or disallow everyone from using a specific slash command, there are two approaches for controlling the permission of a slash command:

- [Denylist](https://en.wikipedia.org/wiki/Blacklist_(computing))
- [Allowlist](https://en.wikipedia.org/wiki/Whitelisting)

The **denylist** approach ENABLES the commnd for everyone (i.e. `setDefaultPermission(true)`), and then manually DISABLE the command for a specific **user** or **role** in a specific guild.

The **allowlist** approach does the opposite. It DISABLES the command for everyone (i.e. `setDefaultPermission(false)`), and then manually ENABLE the command for a specific **user** or **role** in a specific guild.

The process of "manually enabling/disabling the command for a specific user/role" is called **permission overwrite**.

::: warning
You can only add up to **10 permission overwrites** for the same command.

**Permission overwrites are guild-specific**. In other words, you need to specify the guild that you want to do the permission overwrite in, **even if the command is a Global command**. That means that, for a given Global command, it's possible to enable it for a user in one guild, but disable it for the same user in another guild.
:::

Let's try the allowlist approach for the `ping` command. First, you set the `default_permission` to `false` by using the `setDefaultPermission()` method:
```js:no-line-numbers {4}
new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with pong!')
  .setDefaultPermission(false)
```

Next, you run the deployment script again to register your newly edited `ping` command:
```sh:no-line-numbers
node deploy-commands.js
```

Go ahead and try using the `/ping` command in your guild. You should see it grayed out and disabled like this:

![](./images/disabled-command.png)

Next, let's enable the `ping` command for a specific role. You need three IDs for a permission overwrite:

- Guild ID
- Command ID
- User/role ID

So far, you already have the Guild ID in the `deploy-commands.js` file.

- Guild ID ✅
- Command ID
- User/role ID

With these three IDs, you make another HTTP PUT request but to a different endpoint (route). As you might've guessed, that means we need to go back to your `deploy-commands.js` file to implement a few more lines of code:

:::: code-group
::: code-group-item deploy-commands.js
<!-- eslint-skip -->
```js {7,16,23,25-36,38-41,43}
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!').setDefaultPermission(false),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		const response = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully registered application commands.');

		const pingCommand = response.find(cmd => cmd.name === 'ping');

		const fullPermissions = [
			{
				id: pingCommand.id,
				permissions: [
					{
						id: '1234567890',
						type: 1,
						permission: true,
					},
				],
			},
		];

		await rest.put(
			Routes.guildApplicationCommandsPermissions(clientId, guildId),
			{ body: fullPermissions },
		);

		console.log('Successfully applied permission overwrite.');
	} catch (error) {
		console.error(error);
	}
})();
```
:::
::::

::: warning
We are not using the command handler version of the `deploy-commands.js` file for the sake of simplicity during explanation. However, all the concepts and examples in this page are also applicable for the command handler version of the aformentioned file.
:::

As you can see in line 16, calling `rest.put()` to this specific endpoint `Routes.applicationGuildCommands()` will return a response. We store that response in the variable called `response`. This response will be an array of all the registered commands.

Then, in line 23, we retrieve the `ping` command from that array with [`Array.find()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find). Once you retrieve the `ping` command, you can access its ID from the `id` property.

- Guild ID ✅
- Command ID ✅
- User/role ID

Next, in line 25 to 33, you define an array of JSON objects. This JSON needs to have two properties: `id` and `permissions`. The `id` should be the command ID (line 27) and the `permissions` should be an array of [Application Command Permissions Structure](https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object-application-command-permissions-structure) objects (line 28-34). 

This `Application Command Permissions Structure` object needs to have three properties: `id`, `type`, and `permission`. The `id` will be the user id or role id that you want to allowlist (line 30). The `type` specifies what type of `id` it is (line 31). Type `1` means `ROLE` id, and type `2` means `USER` id. Finally, the `permission` specifies if you want to allow or disallow this `id` to use the command (line 32). If `permission` is `true` then it means allow, if it is `false` then it means disallow. Since your `ping` command is already registered with `setDefaultPermission(false)`, it wouldn't make much sense to also have a permission overwrite to disallow specific users or roles. On top of that, you are using the allowlist approach, which means you are enabling the command for a specific role, hence you should set `permission: true`.

- Guild ID ✅
- Command ID ✅
- User/role ID ✅

Finally, you make the HTTP PUT request in line 38. However, you need a different endpoint (route) this time: `Routes.guildApplicationCommandsPermissions()` (line 39), and you pass your `fullPermissions` array in the body of the PUT request (line 40).

You can go ahead and run the deployment script again:

```sh:no-line-numbers
node deploy-commands.js
```

Congratulations! 🎉

Your permission overwrite has been applied. You can go ahead and assign yourself that role in your guild. You should be able to use the `ping` command now. If you remove that role from yourself, you will see the `ping` command as disabled again.

::: warning
As you've probably noticed, you can only adjust the permissions of a command at the top-level. This means that you do not have the granularity of adjusting permissions for subcommand groups and/or subcommands.

Let's use the `/permissions` command from [Subcommands and Subcommand groups](#subcommands-and-subcommand-groups) as example. It's NOT possible to enable `/permissions user get` for a user, while also disabling `/permissions user edit` for that same user.
:::

If you want to disallow a user from using your `/server` slash command, simply implement the following:

```js:no-line-numbers {2,15-24}
const pingCommand = response.find(cmd => cmd.name === 'ping');
const serverCommand = response.find(cmd => cmd.name === 'server');

const fullPermissions = [
	{
		id: pingCommand.id,
		permissions: [
			{
				id: '1234567890',
				type: 1,
				permission: true,
			},
		],
	},
	{
		id: serverCommand.id,
		permissions: [
			{
				id: '1234567890',
				type: 2,
				permission: false,
			},
		],
	},
];
```

### Alternative

You can also make permission overwrite with the bot itself.

```js:no-line-numbers {5}
const pingCommand = client.guilds.cache.get(guildId).commands.cache.find(cmd => cmd.name === 'ping');

const permissions: [
  {
    id: '1234567890',
    type: 'ROLE',
    permission: true,
  }
];

await pingCommand.permissions.set({ permissions });
```

All three IDs are satisfied here as well:

- Guild ID ✅
- Command ID ✅
- User/role ID ✅

The Guild ID is specified in `guildId`.

The Command ID is built into the `pingCommand` variable, because it's an instance of [ApplicationCommand](https://discord.js.org/#/docs/main/stable/class/ApplicationCommand).

The user/role ID is specified in the highlighted line.