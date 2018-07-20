## Introduction

Permissions are Discords primary feature enabling users to customize the workings of their server to their liking.
To break it down to essentials: Permissions and permission overwrites tell Discord who is allowed to do what and where.
When first confronted with them they can be quite confusing, but no worries we are here to take care of that, so let's dive in!

### Roles as permission system

If you want to keep your bots permission system simple you might find it sufficient to just check if the member has a certain role. To achieve this you can use the `.has()` method of the [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) class or `.some()`of [Collection](https://discord.js.org/#/docs/main/stable/class/Collection). The first is possible because the Discord.js Collection extends the Map class and inherits all its methods.

If you know the ID you should always use the `.get()` method since it's a lot faster  than `.find()` and `.some()` which both require iteration.

```js
member.roles.has('role-id-here');
// returns true if the member has the role
member.roles.some(thisRole => thisRole.name === 'Mod');
// returns true if any of the members roles pass the provided validating function
```

<p class = "tip">`message.member` can be uncached on large guilds if the respective member was not online, dnd or idle during the uptime of your bot. If this is the case you need to fetch the member with [`guild.fetchMember(msg.author)`](https://discord.js.org/#/docs/main/stable/class/Guild?scrollTo=fetchMember)</p>

### Terminology

* Permission: The ability to execute a certain action in Discord
* Overwrite: Rule on a channel to modify the permissions for a member or role
* Bitfield: Binary representation of Discord permissions 
* Flag: Readable string in MACRO_CASE, for example `'KICK_MEMBERS'`, refers to a position in the permission bitfield. You can find a list of all valid flags in the [Discord.js documentation](https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS)
* Base Permissions: Permissions for all roles a member has, added up
* Final Permissions: Permissions for a member, after all overwrites are applied

### Discords Permission System

Discord permissions are stored in a 53-bit integer and calculated using bitwise operations, if you want to dive deeper into what's happening behind the curtains check the [wikipedia](https://en.wikipedia.org/wiki/Bit_field) and [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators) articles on the topic.

In Discord.js permission bitfields are represented with either the decimal value of said bitfield or the according flags.
Every position in a permissions bitfield represents one of these flags and its state (either referenced `1` or not referenced `0`).

The flag `KICK_MEMBERS` for example corresponds to the position 2¹,`00000000000000000000000000000010` or `2` as decimal value.
`MANAGE_MESSAGES` corresponds to the position 2¹³ and a bitfield with both flags referenced looks like this: `00000000000000000010000000000010` or `8194` as decimal value.
The Discord API documentation features a [handy calculator to convert permission flags into decimals](https://discordapp.com/developers/tools/permissions-calculator) if you are interested.

Before we get into actually assigning permissions let's quickly go over the method Discord uses to determine a guildmembers final permissions:

1. Take all permissions for all roles the GuildMember has and add them up.
2. Apply all denies for the default role (@everyone).
3. Apply all allows for the default role (@everyone ).
4. Apply all denies for all roles the GuildMember has at once.
5. Apply all allows for all roles the GuildMember has at once.
6. Apply all denies for the specific GuildMember if they exist.
7. Apply all allows for the specific GuildMember if they exist.

Due to the way base permissions apply, if you grant `SEND_MESSAGES` for @everyone but don't enable it for your muterole @muted, members with the muterole will still be able to send messages unless you specifically add overwrites.

All roles allows are applied after all roles denies! If any of a members roles has an overwrite to explicitly allow a permission the member will be able to execute the specified action in this channel even if a higher role has an overwrite to explicitly deny the same permission. So placing an overwrite to allow `SEND_MESSAGES` on a role will result in members with this role to not be muteable via role assignment in this channel.

## Elevated permissions

If the guild owner enables the servers two-factor authentication option everyone executing a certain subset of actions will need to have 2FA enabled on their account. As bots do not have 2FA themselves you as the bot owner will need to enable it on your account for your bot to work on those servers.
Check out [Discords help article](https://support.discordapp.com/hc/en-us/articles/219576828-Setting-up-Two-Factor-Authentication) if you need assistance with this.

The permissions assigned to these actions are called "elevated permissions" and are: 
`KICK_MEMBERS`, `BAN_MEMBERS`, `ADMINISTRATOR`, `MANAGE_CHANNELS`, `MANAGE_GUILD`, `MANAGE_MESSAGES`, `MANAGE_ROLES`, `MANAGE_WEBHOOKS` and `MANAGE_EMOJIS`

## Implicit permissions

Some Discord permissions apply implicitly based on logical use which can cause some unwanted behaviour if you are not aware of it. The prime example is `VIEW_CHANNEL`. If this flag is missing in the final permissions you can't do anything on that channel, makes sense, right? If you can't view the channel you can't read or send messages in it, set overwrites or change its name.
The library does not handle implicit permissions for you so understanding how the system works is vital for you as bot developer.

Let's say you want to send a message in a channel. To prevent unnecessary APIcalls you get the idea to check your bots permissions in this channel to include `SEND_MESSAGES` (more on how to achieve this down below). The check passes, but you still can't actually send the message and are greeted with `DiscordAPIError: Missing Access`.

There is a multitude of possible causes for this behaviour, the channel could have a permissions overwrite for the default role @everyone to grant `SEND_MESSAGES` so everyone that can see the channel can also write in it, but at the same time has an overwrite to deny `VIEW_CHANNEL` to make it only accessible to a subset of members.

As you only check for `SEND_MESSAGES` the bot will try to execute the send, but since `VIEW_CHANNEL` is missing, the request is denied by the API.

## Limitations and oddities

If you play around with permissions you will soon run into a few curious behaviours:

- You need `MANAGE_ROLES` in your base permissions to change base permissions
- You need `MANAGE_ROLES` in your final permissions to change permission overwrites
- You can not edit permissions for roles that are higher than or equal to your highest role
- You can not grant base permissions you do not have
- (Bot only) You can remove base permissions you do not have by setting permissions you do have
- You can manage overwrites for users or roles higher than your highest role
- You can apply overwrites for permissions you do not have
- Members with the `ADMINISTRATOR` permission are not affected by overwrites

## Base permissions

Permissions are set on roles, not the guildmember itself so to change them we access the Role object and use the `setPermissions` method.
Let's change the base permissions for @everyone:

```js
guild.defaultRole.setPermissions(['SEND_MESSAGES', 'VIEW_CHANNEL']);
```

Any permission flags not specified in this array are not granted to the role! They are also not denied, just not granted.
Note that although `VIEW_CHANNEL` grants access to view multiple channels the permission flag is still called `VIEW_CHANNEL` in singular!
You can also provide the permissions when creating a role as part of RoleData as either numeral representation of the permission bitfield or an array of permission flags:

```js
// permission bitfield in decimal representation
guild.createRole({ name: 'Mod', permissions: 8194 });
// permission bitfield in binary representation
guild.createRole({ name: 'Mod', permissions: 0b10000000000010 });
// permission flag array
guild.createRole({ name: 'Mod', permissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS'] });
```

## Channel overwrites

As you probably have already seen in your Discord client, channel overwrites have three states: 

- explicit allow `true` (green ✓)
- explicit deny `false` (red X) 
- default `null` (gray /).

### Adding overwrites

To add a permission overwrite for a role or user we access the GuildChannel object and use the `overwritePermissions` method.
Let's add an overwrite to lock everyone out of the channel (the guild ID is at the same time the ID for the default Role @everyone)

```js
channel.overwritePermissions(channel.guild.id, { VIEW_CHANNEL: false });
```

Any permissionflags not specified in this PermissionOverwriteOptions object (the second parameter) do not get an explicit allow or explicit deny overwrite.
You can also provide an array of overwrites during channel creation:

```js
guild.createChannel('new-channel', 'text', [{
	id: guild.id,
	deny: ['VIEW_CHANNEL'] },
{
	id: user,
	allow: ['VIEW_CHANNEL'] }]);
```

These are ChannelCreationOverwrites and differ from PermissionOverwriteOptions in syntax, take care to not mix them up!

<p class = "tip">The masterbranch changes the functionality of `GuildChannel#overwritePermissions` to be able to set multiple overwrites and introduces `GuildChannel#updateOverwrite` with the prior functionality (updating overwrites for one target specifically whilst keeping all others intact)</p>

### Removing overwrites

To remove an overwrite for a specific member or role you get it from the channels permissionOverwrites collection and call the `.delete()` method on it. Since the collection is keyed by the targets ID (either role ID or user ID) the respective overwrite is very easy to access.

```js
channel.permissionOverwrites.get(message.author.id).delete();
// deletes the channels overwrite for the message author
```

## Permissions object

The [Permissions object](https://discord.js.org/#/docs/main/stable/class/Permissions) is a Discord.js class with a permissions bitfield and a bunch of utility methods to manipulate it easily.
Remember that using these methods will not manipulate permissions, but just return a modified version of the bitfield.

### Converting permission numbers to Objects

Some methods and properties in Discord.js return permission decimals rather than a Permissions object, making it hard to manipulate or read them.
You can however pass these decimals to the Permissions constructor to convert them.

```js
const Discord = require('discord.js');
// constructing a Permissions Object from a permission number
const permissions = new Discord.Permissions(268550160);
// constructing a Permissions Object from an array of PermissionResolvables
const flags = ['MANAGE_CHANNELS', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MANAGE_ROLES'];
const permissions2 = new Discord.Permissions(flags);
```

### Checking for permissions

The Permissions object features the `.has()` method allowing an easy way to check flags in a Permissions bitfield.
The `.has()` method takes two parameters. The first being either a permission number, single flag or an array of permission numbers and flags, the second being a boolean (true or false) indicating if you want to allow the `ADMINISTRATOR` permission to override (defaults to true).

Let's say you want to know if the decimal bitfield representation `268550160` has `MANAGE_CHANNELS` referenced:

```js
const Discord = require('discord.js');
const permissions = new Discord.Permissions(268550160);
console.log(permissions.has('MANAGE_CHANNELS'));
// output: true
console.log(permissions.has(['MANAGE_CHANNELS', 'EMBED_LINKS']));
// output: true
console.log(permissions.has(['MANAGE_CHANNELS', 'KICK_MEMBERS']));
// output: false

const adminPermissions = new Discord.Permissions('ADMINISTRATOR');
console.log(adminperms.has('MANAGE_CHANNELS'));
// output: true
console.log(adminperms.has('MANAGE_CHANNELS'), true);
// output: true
console.log(adminperms.has('MANAGE_CHANNELS'), false);
// output: false
```

### Manipulating permissions

The Permissions object enables you to easily add or remove certain permissions from an existing bitfield without having to worry about bitwise operations. Both `.add()` and `.remove()` can take a single permission flag or number, an array of permissionflags or numbers or multiple permissionflags or numbers as multiple parameters.

```js
const Discord = require('discord.js');
const permissions = new Discord.Permissions(268550160);
console.log(permissions.has('KICK_MEMBERS'));
// output: false
permissions.add('KICK_MEMBERS');
console.log(permissions.has('KICK_MEMBERS'));
// output: true
permissions.remove(2);
console.log(permissions.has('KICK_MEMBERS'));
// output : false
```

You can utilize these methods to adapt permissions or overwrites without touching the other flags. To achieve this you can get the existing permissions for a role, manipulating the bitfield as described above and passing the changed bitfield to `role.setPermissions()`.

<p class = "tip">In the stable branch `role.permissions` returns a number which needs to be converted to a Permissions object for this to work as described here, we covered how to achieve this in the section "Converting permission numbers to Objects"</p>

## Final permissions

Discord.js features two utility functions to easily determine the final permissions for a guildmember in a specific channel: `.permissionsFor()` on the [GuildChannel](https://discord.js.org/#/docs/main/stable/class/GuildChannel?scrollTo=permissionsFor) class and `permissionsIn()` on the [GuildMember](https://discord.js.org/#/docs/main/stable/class/GuildMember?scrollTo=permissionsIn) class. Both return a Permissions object.

To check your bots permissions in the channel the command was used in you could use something like

```js
if (message.channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'VIEW_CHANNEL'])) {
	return console.log('I can send a message here');
}

// or

if (message.guild.me.permissionsIn(message.channel).has(['SEND_MESSAGES', 'VIEW_CHANNEL'])) {
	return console.log('I can send a message here');
}
```
For normal permission checks you won't need to specify a second parameter, as it is optional and you will generally want to allow `ADMINISTRATOR` to override.

## Syncing permissions with a category

If the permission overwrites on a channel under a category match with the parent (category) the channel is considered to be synchronized. This means that any changes in the categories overwrites will now also change the channels overwrites. Changing the child channels overwrites will not effect the parent overwrites. 

Because of this you will never need to check the categories permissions manually. 
While the concept sounds really simple this is relatively hard to achieve as you can not simply get the collection of PermissionOverwrites and pass it to `channel.overwritePermissions` due to the different structure of [PermissionOverwrites](https://discord.js.org/#/docs/main/stable/class/PermissionOverwrites) and [PermissionOverwriteOptions](https://discord.js.org/#/docs/main/stable/typedef/PermissionOverwriteOptions). 

```js
// Anatomy of PermissionOverwriteOptions objects
// Object mapping flags to booleans, the target is specified in the .overwritePermissions method
const permissionOverwriteOptions = {
	SEND_MESSAGES: true,
	ATTACH_FILES: false,
};
// Anatomy of PermissionOverwrites objects
const permissionOverwrites = {
	// target id
	id: 'someid',
	// role or user depending on the target
	type: 'role',
	// bitfield in decimal representation
	deny: 268435456,
	// bitfield in decimal representation
	allow: 0,
};
```

To solve this we need to construct our own PermissionOverwriteOptions object for each overwrite in the PermissionOverwrites collection of the parent (category) and apply them individually to the child channel with the specified target id.
In order to easily check for flags we will construct Permissions objects for both overwrites and utilize the `.has()` function of the Permissions class as described above.

```js
const Discord = require('discord.js');
// return if the channel has no parent (channel is not under a category)
if (!channel.parent) return;
// iterate over overwrites of the channel and delete any that are not on the parent
for (const overwrite of channel.permissionOverwrites.values()) {
	if (!channel.parent.permissionOverwrites.has(overwrite.id)) {
		overwrite.delete();
	}
}
// iterate over the overwrites of the parent
for (const overwrite of channel.parent.permissionOverwrites.values()) {
	// initialize an empty object
	const options = {};
	// convert allow and deny to Permissions objects so we can easily check flags later with .has()
	const allow = new Discord.Permissions(overwrite.allow);
	const deny = new Discord.Permissions(overwrite.deny);
	// iterate over all possible permission flags
	for (const flag of Object.keys(Discord.Permissions.FLAGS)) {
		// if present in the allow part of the overwrite
		// assign a property with the name of the flag and set the value to true
		if (allow.has(flag)) options[flag] = true;
		// if not present in allow, check deny
		// assign a property with the name of the flag and set the value to false
		// since allow overwrites deny you only need to check deny if the permission is not in allow
		else if (deny.has(flag)) options[flag] = false;
		// if not referenced in either of the two
		// assign a property with the name of the flag and set the value to null
		// to overwrite existing allow/deny overwrites in the child channel
		else options[flag] = null;
	}
	// apply overwrites
	channel.overwritePermissions(overwrite.id, options);
}
```
<p class = "tip">The masterbranch introduces `channel.lockPermissions` to easily sync permission with the parent channel. You can also pass PermissionOverwrites to `channel.overwritePermissions` in master to adopt permissions from other channels</p>

## Final permissions for a role    

Discord.js stable branch does not yet allow a RoleResolvable to be passed to `channel.permissionsFor()`, if you want to know if a certain role has access to a channel you will need to compute the final permissions yourself. 

The following snippet uses [bitwise operations](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators) to apply permissions and overwrites as explained on the [Discord API documentation](https://discordapp.com/developers/docs/topics/permissions#permission-overwrites).

```js
const getRoleFinalPermissions = (channel, role) => {
	// compute base permissions by combining the role permissions with @everyone permissions
	let permissions = role.permissions | role.guild.defaultRole.permissions;
	// if permissions include ADMINISTRATOR return a Permissions object with base permissions
	if (permissions & 1 << 3) {
		return new Discord.Permissions(permissions);
	}
	// get overwrite for role and @everyone
	const roleOverwrites = channel.permissionOverwrites.get(role.id);
	const everyoneOverwrites = channel.permissionOverwrites.get(role.guild.id);
	// apply overwrites for @everyone
	if (everyoneOverwrites) {
		permissions &= ~everyoneOverwrites.deny;
		permissions |= everyoneOverwrites.allow;
	}
	// apply overwrites for role
	if (roleOverwrites) {
		permissions &= ~roleOverwrites.deny;
		permissions |= roleOverwrites.allow;
	}
	// return final permissions
	return new Discord.Permissions(permissions);
};
```

<p class = "tip">On the masterbranch `channel.permissionsFor()` accepts a RoleResolvable as parameter making this entirely redundant</p>

## Resulting code

If you want to check a working implementation for all methods and functionalities in this guide, you can look at a boilerplate bot over on the GitHub repository [here](https://github.com/discordjs/guide/tree/master/code-samples/popular-topics/permissions/).