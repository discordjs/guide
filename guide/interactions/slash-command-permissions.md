# Slash command permissions

Slash commands have their own permission system, which allows you to control who has access to use which commands. You can enable or disable a specific user or role from using a specific command.

::: tip
For now, if you don't have permission to use a command, they'll show up in the command picker as disabled and unusable. They will not be hidden.
:::

As you might have noticed now, you were able to use all of your slash commands right after registering them. This is because the `defaultPermission` of a slash command is set to `true` by default if you don't specify it during registration.

You can set the `defaultPermission` of your slash command to `false` if you want them to be disabled for everyone. Setting `defaultPermission` to `false` will disallow anyone in a guild from using the command—even Administrators and guild owners—unless a specific overwrite is configured. It will also disable the command (if it's a global one) from being usable in DMs.

You can set the `defaultPermission` of a slash command with the `setDefaultPermission()` method of the `SlashCommandBuilder()` builder that you have been using so far. For example, if you want to do that for the `ping` command:

```js:no-line-numbers {4}
new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with pong!')
  .setDefaultPermission(false) // defaults to "true" if not specified
```

Since the `defaultPermission` will either allow or disallow everyone from using a specific slash command, there are two approaches for controlling the permission of a slash command:

- [Denylist](https://en.wikipedia.org/wiki/Blacklist_(computing))
- [Allowlist](https://en.wikipedia.org/wiki/Whitelisting)

If you follow the **denylist** approach, the command is enabled for everyone (i.e. `setDefaultPermission(true)`), and then you'll have to manually disable the command for a specific user or role in a specific guild.

If you follow the **allowlist** approach, the command is disabled for everyone (i.e. `setDefaultPermission(false)`), and then you'll have to manually enable the command for a specific user or role in a specific guild.

When you enable or disable a command for a specific user or role, you perform a **permission overwrite**.

::: warning
You can only add up to **10 permission overwrites** for a command.

Permission overwrites are guild-specific, which means that you need to specify permission overwrites for each guild your application is registered in separately, even if the command is a global command. This means that, for a given global command, it's possible to enable it for a user in one guild, but disable it for the same user in another guild.
:::

Let's try the allowlist approach for the `ping` command. First, you set the `defaultPermission` to `false` by using the `setDefaultPermission()` method:

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

![Disabled command](./images/disabled-command.png)

Next, let's enable the `ping` command for a specific role. You need three ids for a permission overwrite:

- The id of the guild to apply overwrites in.
- The id of the command to apply overwrites for.
- The id of the user/role to apply overwrites for.

So far, you already have the id of the guild in the `deploy-commands.js` file.

- Guild ID ✅
- Command ID
- User/role ID

With these three ids, you make another HTTP `PUT` request but to a different endpoint (route). Let us go back to your `deploy-commands.js` file to implement a few more lines of code:

:::: code-group
::: code-group-item deploy-commands.js
```js {13,20,22-33,35-38,40}
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	// ...
];

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

		console.log('Successfully applied permission overwrites.');
	} catch (error) {
		console.error(error);
	}
})();
```
:::
::::

Here, we are taking the response of the first `PUT` method which contains an array of all the registered commands.

Then, we retrieve the `ping` command from that array using the [`Array.find()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) method. Once you retrieve the `ping` command, you can access its id from the `id` property.

Next, we define an array of objects. Each object needs to have two properties: `id` and `permissions`. The `id` should be the command's id and the `permissions` should be an array of [Application Command Permissions Structure](https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object-application-command-permissions-structure) objects. 

This `Application Command Permissions Structure` object needs to have three properties: `id`, `type`, and `permission`. The `id` will be the user id or role id that you want to allow running the command. The `type` specifies what type of `id` it is. Type `1` is for roles, and type `2` is for users. Finally, the `permission` specifies if you want to allow or disallow this `id` to use the command. If `permission` is `true` then it means allow, if it is `false` then it means disallow. Since we want to allow users, we set `permission` to true.

Finally, we make a `PUT` request to update command overwrites. We use the `Routes.guildApplicationCommandsPermissions()` route, and pass our `fullPermissions` array as the body of the `PUT` request.

We can now run the deployment script again:

```sh:no-line-numbers
node deploy-commands.js
```

Congratulations, you've successfully applied your first permission overwrites. You can go ahead and assign yourself the role you allowed in your guild. You should be able to use the `ping` command now. If you remove that role from yourself, you should see the `ping` command disabled again.

::: warning
You can only adjust the permissions of commands at the top level. This means that you can not adjust permissions for subcommand groups and/or subcommands.

Let's use the `/permissions` command from the [Subcommands and Subcommand groups](#subcommands-and-subcommand-groups) as an example. It is not possible to enable `/permissions user get` for a user, while also disabling `/permissions user edit` for that same user.
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

And that's all you need to know about slash command permissions!