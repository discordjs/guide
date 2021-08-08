# Slash command permissions

Slash commands have their own permissions system, which allows you to control who has access to use which commands. Unlike the slash commands permission setting within the Discord client, you can fine-tune access to commands without preventing the selected user or role from using all commands.

::: tip
If you set `defaultPermission: false` when creating a command, you can immediately disable it for everyone, including guild administrators and yourself.
:::

## User permissions

To begin, fetch an `ApplicationCommand` and then set the permissions using the `ApplicationCommandPermissionsManager#add()` method:

```js
client.on('messageCreate', async message => {
	if (!client.application?.owner) await client.application?.fetch();

	if (message.content.toLowerCase() === '!perms' && message.author.id === client.application?.owner.id) {
		const command = await client.guilds.cache.get('123456789012345678')?.commands.fetch('876543210987654321');

		const permissions = [
			{
				id: '224617799434108928',
				type: 'USER',
				permission: false,
			},
		];

		await command.permissions.add({ permissions });
	}
});
```

Now you have successfully denied the user whose `id` you used access to this application command.

::: tip
If you want to update permissions for a global command instead, your `command` variable would be:
```js
const command = client.application?.commands.fetch('123456789012345678');
```
:::

If you have a command that is disabled by default and you want to grant someone access to use it, do as follows:

<!-- eslint-skip -->

```js {5}
const permissions = [
	{
		id: '224617799434108928',
		type: 'USER',
		permission: true,
	},
];

await command.permissions.set({ permissions });
```


## Role permissions

Permissions may also be denied (or allowed) at a role scope instead of a single user:

<!-- eslint-skip -->

```js {4-5}
const permissions = [
	{
		id: '464464090157416448',
		type: 'ROLE',
		permission: false,
	},
];

await command.permissions.add({ permissions });
```

## Bulk update permissions

If you have a lot of commands, you likely want to update their permissions in one go instead of one-by-one. For this approach, you can use `ApplicationCommandPermissionsManager#set()` method:

<!-- eslint-skip -->

```js
const fullPermissions = [
	{
		id: '123456789012345678',
		permissions: [{
			id: '224617799434108928',
			type: 'USER',
			permission: false,
		}],
	},
	{
		id: '876543210987654321',
		permissions: [{
			id: '464464090157416448',
			type: 'ROLE',
			permission: true,
		}],
	},
];

await client.guilds.cache.get('123456789012345678')?.commands.permissions.set({ fullPermissions });
```

And that's all you need to know on slash command permissions!
