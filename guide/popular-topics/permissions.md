# Permissions

Permissions are Discord's primary feature, enabling users to customize their server's workings to their liking.
Essentially, Permissions and permission overwrites tell Discord who is allowed to do what and where.
Permissions can be very confusing at first, but this guide is here to explain and clarify them, so let's dive in!

## Roles as bot permissions

If you want to keep your bot's permission checks simple, you might find it sufficient to check if the member executing the command has a specific role.

If you have the role ID, you can check if the `.roles` Collection on a GuildMember object includes it, using `.has()`. Should you not know the ID and want to check for something like a "Mod" role, you can use `.some()`.

```js
member.roles.cache.has('role-id-here');
// returns true if the member has the role

member.roles.cache.some(role => role.name === 'Mod');
// returns true if any of the member's roles is exactly named "Mod"
```

If you want to enhance this system slightly, you can include the guild owner by comparing the executing member's ID with `message.guild.ownerId`.

To include permission checks like `ADMINISTRATOR` or `MANAGE_GUILD`, keep reading as we will cover Discord Permissions and all their intricacies in the following sections.

## Terminology

* Permission: The ability to execute a certain action in Discord
* Overwrite: Rule on a channel to modify the permissions for a member or role
* Bit field: Binary representation of Discord permissions 
* Flag: Human readable string in MACRO_CASE (e.g., `'KICK_MEMBERS'`) that refers to a position in the permission bit field. You can find a list of all valid flags in the <DocsLink path="class/Permissions?scrollTo=s-FLAGS">discord.js documentation</DocsLink>
* Base Permissions: Permissions for roles the member has, set on the guild level
* Final Permissions: Permissions for a member or role, after all overwrites are applied

::: tip
You can provide permission decimals wherever we use flag literals in this guide. If you are interested in a handy permission calculator, you can look at the "Bot" section in the [Discord developer portal](https://discord.com/developers/applications).
:::

## Base permissions

### Setting role permissions

Base permissions are set on roles, not the guild member itself. To change them, you access a Role object (for example via `member.roles.cache.first()` or `guild.roles.cache.random()`) and use the `.setPermissions()` method. This is how you'd change the base permissions for the `@everyone` role, for example:

```js
guild.roles.everyone.setPermissions(['SEND_MESSAGES', 'VIEW_CHANNEL']);
```

Any permission not referenced in the flag array or bit field is not granted to the role. 

::: tip
Note that flag names are literal. Although `VIEW_CHANNEL` grants access to view multiple channels, the permission flag is still called `VIEW_CHANNEL` in singular form.
:::

### Creating a role with permissions

Alternatively you can provide permissions as a property of the <DocsLink path="typedef/CreateRoleOptions">CreateRoleOptions</DocsLink> typedef during role creation as an array of flag strings or a permission number:

```js
guild.roles.create({ name: 'Mod', permissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS'] });
```

### Checking member permissions

To know if one of a member's roles has a permission enabled, you can use the `.has()` method of the GuildMember's <DocsLink path="class/GuildMember?scrollTo=permissions">`permissions`</DocsLink> and provide a permission flag, array, or number to check for. You can also specify if you want to allow the `ADMINISTRATOR` permission or the guild owner status to override this check with the following parameters.

```js
if (member.permissions.has('KICK_MEMBERS')) {
	console.log('This member can kick');
}

if (member.permissions.has(['KICK_MEMBERS', 'BAN_MEMBERS'])) {
	console.log('This member can kick and ban');
}

if (member.permissions.has('KICK_MEMBERS', false)) {
	console.log('This member can kick without allowing admin to override');
}
```

If you provide multiple permissions to the method, it will only return `true` if all permissions you specified are granted.

::: tip
You can learn more about the `.has()` method [here](#checking-for-permissions).
:::

## Channel overwrites

Permission overwrites control members' abilities for this specific channel or a set of channels if applied to a category with synchronized child channels.

As you have likely already seen in your desktop client, channel overwrites have three states: 

- Explicit allow (`true`, green ✓)
- Explicit deny (`false`, red X) 
- Default (`null`, gray /)

### Adding overwrites

To add a permission overwrite for a role or guild member, you access the channel's <DocsLink path="class/TextChannel?scrollTo=permissionOverwrites">PermissionOverwriteManager</DocsLink> and use the `.create()` method. The first parameter is the target of the overwrite, either a Role or User object (or its respective resolvable), and the second is a <DocsLink path="typedef/PermissionOverwriteOptions">PermissionOverwriteOptions</DocsLink> object.

Let's add an overwrite to lock everyone out of the channel. The guild ID doubles as the role id for the default role `@everyone` as demonstrated below:

```js
channel.permissionOverwrites.create(channel.guild.roles.everyone, { VIEW_CHANNEL: false });
```

Any permission flags not specified get neither an explicit allow nor deny overwrite and will use the base permission unless another role has an explicit overwrite set.

You can also provide an array of overwrites during channel creation, as shown below:

```js
guild.channels.create('new-channel', {
	type: 'GUILD_TEXT',
	permissionOverwrites: [
		{
			id: message.guild.id,
			deny: ['VIEW_CHANNEL'],
		},
		{
			id: message.author.id,
			allow: ['VIEW_CHANNEL'],
		},
	],
});
```

### Editing overwrites

To edit permission overwrites on the channel with a provided set of new overwrites, you can use the `.edit()` method. This method allows passing an array or Collection of <DocsLink path="class/PermissionOverwrites">PermissionOverwrites</DocsLink>.

```js
// editing overwrites with PermissionOverwriteOptions
channel.permissionOverwrites.edit([
	{
		id: guild.id,
		deny: ['VIEW_CHANNEL'],
	},
	{
		id: user.id,
		allow: ['VIEW_CHANNEL'],
	},
]);
```

### Replacing overwrites

To replace all permission overwrites on the channel with a provided set of new overwrites, you can use the `.set()` method. This is extremely handy if you want to copy a channel's full set of overwrites to another one, as this method also allows passing an array or Collection of <DocsLink path="class/PermissionOverwrites">PermissionOverwrites</DocsLink>.

```js
// copying overwrites from another channel
channel.permissionOverwrites.set(otherChannel.permissionOverwrites.cache);

// replacing overwrites with PermissionOverwriteOptions
channel.permissionOverwrites.set([
	{
		id: guild.id,
		deny: ['VIEW_CHANNEL'],
	},
	{
		id: user.id,
		allow: ['VIEW_CHANNEL'],
	},
]);
```

### Removing overwrites

To remove the overwrite for a specific member or role, you can use the `.delete()` method.

```js
// deleting the channel's overwrite for the message author
channel.permissionOverwrites.delete(message.author.id);
```

### Syncing with a category

If the permission overwrites on a channel under a category match with the parent (category), it is considered synchronized. This means that any changes in the categories overwrites will now also change the channels overwrites. Changing the child channels overwrites will not affect the parent. 

To easily synchronize permissions with the parent channel, you can call the `.lockPermissions()` method on the respective child channel.  

```js
if (!channel.parent) {
	return console.log('This channel is not listed under a category');
}

channel.lockPermissions()
	.then(() => console.log('Successfully synchronized permissions with parent channel'))
	.catch(console.error);
```

### Permissions after overwrites

Discord.js features two utility methods to easily determine the final permissions for a guild member or role in a specific channel: `.permissionsFor()` on the <DocsLink path="class/GuildChannel?scrollTo=permissionsFor">GuildChannel</DocsLink> class and `.permissionsIn()` on the <DocsLink path="GuildMember?scrollTo=permissionsIn">GuildMember</DocsLink> and <DocsLink path="class/Role?scrollTo=permissionsIn">Role</DocsLink> classes. Both return a <DocsLink path="class/Permissions">Permissions</DocsLink> object.

To check your bot's permissions in the channel the command was used in, you could use something like this:

```js
// final permissions for a guild member using permissionsFor
const botPermissionsFor = channel.permissionsFor(guild.me);

// final permissions for a guild member using permissionsIn
const botPermissionsIn = guild.me.permissionsIn(channel);

// final permissions for a role
const rolePermissions = channel.permissionsFor(role);
```

::: warning
The `.permissionsFor()` and `.permissionsIn()` methods return a Permissions object with all permissions set if the member or role has the global `ADMINISTRATOR` permission and does not take overwrites into consideration in this case. Using the second parameter of the `.has()` method as described further down in the guide will not allow you to check without taking `ADMINISTRATOR` into account here!
:::

If you want to know how to work with the returned Permissions objects, keep reading as this will be our next topic.

## The Permissions object

The <DocsLink path="class/Permissions">Permissions</DocsLink> object is a discord.js class containing a permissions bit field and a bunch of utility methods to manipulate it easily.
Remember that using these methods will not manipulate permissions, but rather create a new instance representing the changed bit field.

### Displaying permission flags

discord.js provides a `toArray()` method, which can be used to convert a `Permissions` object into an array containing permission flags. This is useful if you want to display/list them and it enables you to use other array manipulation methods. For example:

```js
const memberPermissions = member.permissions.toArray();
const rolePermissions = role.permissions.toArray();
// output: ['SEND_MESSAGES', 'ADD_REACTIONS', 'CHANGE_NICKNAME', ...]
```

::: tip 
The return value of `toArray()` always represents the permission flags present in the Permissions instance that the method was called on. This means that if you call the method on, for example: `PermissionOverwrites#deny`, you will receive an array of all denied permissions in that overwrite.
:::

Additionally, you can serialize the Permissions object's underlying bit field by calling `.serialize()`. This returns an object that maps permission names to a boolean value, indicating whether the relevant "bit" is available in the Permissions instance.

```js
const memberPermissions = member.permissions.serialize();
const rolePermissions = role.permissions.serialize();
/* output: {
SEND_MESSAGES: true,
ADD_REACTIONS: true,
BAN_MEMBERS: false,
...
}
*/
```

### Converting permission numbers

Some methods and properties in discord.js return permission decimals rather than a Permissions object, making it hard to manipulate or read them if you don't want to use bitwise operations.
However, you can pass these decimals to the Permissions constructor to convert them, as shown below.

```js
const { Permissions } = require('discord.js');
const permissions = new Permissions(268550160);
```

You can also use this approach for other <DocsLink path="typedef/PermissionResolvable">PermissionResolvable</DocsLink>s like flag arrays or flags.

```js
const { Permissions } = require('discord.js');
const flags = [
	'MANAGE_CHANNELS',
	'EMBED_LINKS',
	'ATTACH_FILES',
	'READ_MESSAGE_HISTORY',
	'MANAGE_ROLES',
];

const permissions = new Permissions(flags);
```

### Checking for permissions

The Permissions object features the `.has()` method, allowing an easy way to check flags in a Permissions bit field.
The `.has()` method takes two parameters: the first being either a permission number, single flag, or an array of permission numbers and flags, the second being a boolean, indicating if you want to allow the `ADMINISTRATOR` permission to override (defaults to `true`).

Let's say you want to know if the decimal bit field representation `268550160` has `MANAGE_CHANNELS` referenced:

```js
const { Permissions } = require('discord.js');

const bitPermissions = new Permissions(268550160);

console.log(bitPermissions.has('MANAGE_CHANNELS'));
// output: true

console.log(bitPermissions.has(['MANAGE_CHANNELS', 'EMBED_LINKS']));
// output: true

console.log(bitPermissions.has(['MANAGE_CHANNELS', 'KICK_MEMBERS']));
// output: false

const flagsPermissions = new Permissions([
	'MANAGE_CHANNELS',
	'EMBED_LINKS',
	'ATTACH_FILES',
	'READ_MESSAGE_HISTORY',
	'MANAGE_ROLES',
]);

console.log(flagsPermissions.has('MANAGE_CHANNELS'));
// output: true

console.log(flagsPermissions.has(['MANAGE_CHANNELS', 'EMBED_LINKS']));
// output: true

console.log(flagsPermissions.has(['MANAGE_CHANNELS', 'KICK_MEMBERS']));
// output: false

const adminPermissions = new Permissions('ADMINISTRATOR');

console.log(adminPermissions.has('MANAGE_CHANNELS'));
// output: true

console.log(adminPermissions.has('MANAGE_CHANNELS', true));
// output: true

console.log(adminPermissions.has('MANAGE_CHANNELS', false));
// output: false
```

### Manipulating permissions

The Permissions object enables you to easily add or remove individual permissions from an existing bit field without worrying about bitwise operations. Both `.add()` and `.remove()` can take a single permission flag or number, an array of permission flags or numbers, or multiple permission flags or numbers as multiple parameters.

```js
const { Permissions } = require('discord.js');

const permissions = new Permissions([
	'MANAGE_CHANNELS',
	'EMBED_LINKS',
	'ATTACH_FILES',
	'READ_MESSAGE_HISTORY',
	'MANAGE_ROLES',
]);

console.log(permissions.has('KICK_MEMBERS'));
// output: false

permissions.add('KICK_MEMBERS');
console.log(permissions.has('KICK_MEMBERS'));
// output: true

permissions.remove('KICK_MEMBERS');
console.log(permissions.has('KICK_MEMBERS'));
// output : false
```

You can utilize these methods to adapt permissions or overwrites without touching the other flags. To achieve this, you can get the existing permissions for a role, manipulating the bit field as described above and passing the changed bit field to `role.setPermissions()`.

## Resulting code

<ResultingCode />
