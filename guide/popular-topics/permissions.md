## Introduction

Permissions are Discords primary feature enabling users to customize the workings of their server to their liking.
To break it down to essentials: Permissions and permission overwrites tell Discord who is allowed to do what and where.
When first confronted with them they can be quite confusing, but no worries we are here to take care of that, so let's dive in!

### Roles as bot permissions

If you want to keep your bots permission checks simple you might find it sufficient to just check if the member executing the command has a certain role.
In case you know its ID you can simply check the role collection of the GuildMember object to include it with the `.has()` method Collection inherits from the [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) class.

Should you not know the ID and want to go with a named Role like "Mod" you can use the `.some()` method of the [Collection](https://discord.js.org/#/docs/main/stable/class/Collection) class.

```js
member.roles.has('role-id-here');
// returns true if the member has the role

member.roles.some(thisRole => thisRole.name === 'Mod');
// returns true if any of the members roles return true for the provided function
```

If you want to enhance this system slightly you can include the guild owner by comparing the executing members ID with `message.guild.ownerID`. 

To include permission checks like `ADMINISTRATOR` or `MANAGE_GUILD` keep reading as we will cover Discord Permissions and all their intricacies in the following sections.

### Terminology

* Permission: The ability to execute a certain action in Discord
* Overwrite: Rule on a channel to modify the permissions for a member or role
* Bit field: Binary representation of Discord permissions 
* Flag: Human readable string in MACRO_CASE, for example `'KICK_MEMBERS'`, refers to a position in the permission bit field. You can find a list of all valid flags in the [Discord.js documentation](https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS)
* Base Permissions: Permissions for roles the member has, set on the guild level
* Final Permissions: Permissions for a member or role, after all overwrites are applied

## Discord's permission system

Discord permissions are stored in a 53-bit integer and calculated using bitwise operations, if you want to dive deeper into what's happening behind the curtains check the [wikipedia](https://en.wikipedia.org/wiki/Bit_field) and [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators) articles on the topic.

In Discord.js permission bit fields are represented as either the decimal value of said bit field or its referenced flags.
Every position in a permissions bit field represents one of these flags and its state (either referenced `1` or not referenced `0`).

The flag `KICK_MEMBERS` for example corresponds to the position 2¹,`00000000000000000000000000000010` or `2` as decimal value.
`MANAGE_MESSAGES` corresponds to the position 2¹³ and a bit field with both flags referenced looks like this: `00000000000000000010000000000010` or `8194` as decimal value.

Before we get into actually assigning permissions let's quickly go over the method Discord uses to determine a guild members final permissions:

1. Take all permissions for all roles the guild member has and add them up.
2. Apply all denies for the default role (@everyone).
3. Apply all allows for the default role (@everyone ).
4. Apply all denies for all additional roles the guild member has at once.
5. Apply all allows for all additional roles the guild member has at once.
6. Apply all denies for the specific guild member if they exist.
7. Apply all allows for the specific guild member if they exist.

Due to this system you can not deny base permissions. If you grant @everyone `SEND_MESSAGES` and don't grant it for a role @muted muted members will still be able to send messages unless you specify channel based overwrites.

All additional roles allow overwrites are applied after all additional roles denies! If any of a members roles has an overwrite to explicitly allow a permission the member will be able to execute the associated actions in this channel regardless of role hierarchy. 

Placing an overwrite to allow `SEND_MESSAGES` on a role will result in members with this role to not be mutable via role assignment in this channel. 

### Elevated permissions

If the guild owner enables the servers two-factor authentication option everyone executing a certain subset of actions will need to have 2FA enabled on their account. As bots do not have 2FA themselves you as the application owner will need to enable it on your account for your bot to work on those servers.
Check out [Discords help article](https://support.discordapp.com/hc/en-us/articles/219576828-Setting-up-Two-Factor-Authentication) if you need assistance with this.

The permissions assigned to these actions are called "elevated permissions" and are: 
`KICK_MEMBERS`, `BAN_MEMBERS`, `ADMINISTRATOR`, `MANAGE_CHANNELS`, `MANAGE_GUILD`, `MANAGE_MESSAGES`, `MANAGE_ROLES`, `MANAGE_WEBHOOKS` and `MANAGE_EMOJIS`.

### Implicit permissions

Some Discord permissions apply implicitly based on logical use which can cause unwanted behavior if you are not aware of this fact.

The prime example for implicit permissions is `VIEW_CHANNEL`. If this flag is missing in the final permissions you can't do anything on that channel, makes sense, right? If you can't view the channel you can't read or send messages in it, set the topic or change its name.
The library does not handle implicit permissions for you, so understanding how the system works is vital for you as a bot developer.

Let's say you want to send a message in a channel. To prevent unnecessary API calls you want to make sure your bots permissions in this channel include `SEND_MESSAGES` (more on how to achieve this down below). The check passes, but you still can't actually send the message and are greeted with `DiscordAPIError: Missing Access`.

This means your bot is missing `VIEW_CHANNEL` and as such can't send messages either.

One possible scenario causing this: The channel has permission overwrites for the default role @everyone to grant `SEND_MESSAGES` so everyone who can see the channel can also write in it, but at the same time has an overwrite to deny `VIEW_CHANNEL` to make it only accessible to a subset of members.

As you only check for `SEND_MESSAGES` the bot will try to execute the send, but since `VIEW_CHANNEL` is missing, the request is denied by the API.

### Limitations and oddities

- Your bot needs `MANAGE_ROLES` in its base permissions to change base permissions.
- It needs `MANAGE_ROLES` in its final permissions to change permission overwrites.
- It can not edit permissions for roles that are higher than or equal to its highest role.
- It can not grant permissions it doesn't have.
- It can manage overwrites for roles or users with higher roles than its own highest role.
- It can manage overwrites for permissions it doesn't have.
- Members with the `ADMINISTRATOR` permission are not affected by overwrites at all.

### Missing permissions

During your tests you will likely run into `DiscordAPIError: Missing Permissions` at some point. This error can be caused by one of the following:

- Your bot is missing the needed permission to execute this action in it's calculated base or final permissions (requirement changes based on the type of action you are trying to execute).
- It is trying to execute an action on a guild member with a role higher than or equal to your bots highest role.
- It is trying to modify a role that is higher than or equal to its highest role.
- It is trying to execute a forbidden action on the server owner.
- It is trying to execute an action based on another unfulfilled factor (for example reserved for partnered guilds). 

<tip>The `ADMINISTRATOR` permission being granted does not skip any hierarchical check!</tip>

## Base permissions

Permissions are set on roles, not the guild member itself. To change them you access the Role object (for example via `guild.roles`) and use the `.setPermissions()` method.
Let's change the base permissions for @everyone so you can see it in action:

```js
// permission flag array
guild.defaultRole.setPermissions(['SEND_MESSAGES', 'VIEW_CHANNEL']);

// permission bit field in decimal representation
guild.defaultRole.setPermissions(3072);
```

Any permission not referenced in the flag array or bit field are not granted to the role. 

Note that flag names are literal. Although `VIEW_CHANNEL` grants access to view multiple channels the permission flag is still called `VIEW_CHANNEL` in singular.

Alternatively you can provide permissions as a property of RoleData objects during role creation as an array of flag strings or a permission number:

```js
// permission bit field in decimal representation
guild.createRole({ name: 'Mod', permissions: 8194 });

// permission bit field in binary representation
guild.createRole({ name: 'Mod', permissions: 0b10000000000010 });

// permission flag array
guild.createRole({ name: 'Mod', permissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS'] });
```

## Channel overwrites

Permission overwrites control the abilities of members for this specific channel or a set of channels if applied to a category with synchronized child channels.

As you have likely already seen in your desktop client, channel overwrites have three states: 

- explicit allow `true` (green ✓)
- explicit deny `false` (red X) 
- default `null` (gray /)

### Adding overwrites

To add a permission overwrite for a role or user you access the channel object and use the `.overwritePermissions()` method. The first parameter is the target of the overwrite, either a Role or User object or their respective resolvable, the second is a PermissionOverwriteOptions object.

Let's add an overwrite to lock everyone out of the channel. The guild ID doubles as the role id for the default role @everyone as demonstrated below:

```js
channel.overwritePermissions(channel.guild.id, { VIEW_CHANNEL: false });
```

Any permission flags not specified get neither an explicit allow nor deny overwrite and will use the base permission unless another role has an explicit overwrite set.

You can also provide an array of overwrites during channel creation as shown below:

```js
guild.createChannel('new-channel', 'text', [{
	id: guild.id,
	deny: ['VIEW_CHANNEL'] },
{
	id: user,
	allow: ['VIEW_CHANNEL'] }]);
```

These objects are ChannelCreationOverwrites and differ from PermissionOverwriteOptions, take care to not mix them up!

<tip>On the master branch the functionality of `GuildChannel#overwritePermissions` is changed to replacing all overwrites. `GuildChannel#updateOverwrite` is introduced to take its place in updating a single overwrite while keeping all others intact.</tip>

### Replacing overwrites

To replace all permission overwrites on the channel with a provided set of new overwrites you can use the `.replacePermissionOverwrites()` function. This is extremely handy if you want to copy a channels full set of overwrites to another one as this method allows passing an array or collection of PermissionOverwrites as well as ChannelCreationOverwrites.

```js
// copying overwrites from another channel
channel.replacePermissionOverwrites({ overwrites: otherChannel.permissionOverwrites });

// replacing Overwrites with PermissionOverwriteOptions
channel.replacePermissionOverwrites({ overwrites: [{
	id: guild.id,
	deny: ['VIEW_CHANNEL'] },
{
	id: user,
	allow: ['VIEW_CHANNEL'] }] });
```

<tip>On the master branch the functionality of `GuildChannel#overwritePermissions` is changed to replace overwrites</tip>

### Removing overwrites

To remove the overwrite for a specific member or role you can get it from the channels permissionOverwrites collection and call the `.delete()` method on it. Since the collection is keyed by the targets ID (either role ID or user ID) the respective overwrite is very easy to access.

```js
// deletes the channels overwrite for the message author
channel.permissionOverwrites.get(message.author.id).delete();
```

## The Permissions object

The [Permissions object](https://discord.js.org/#/docs/main/stable/class/Permissions) is a Discord.js class containing a permissions bit field and a bunch of utility methods to manipulate it easily.
Remember that using these methods will not manipulate permissions, but create a new instance representing the changed bit field.

### Converting permission numbers to Objects

Some methods and properties in Discord.js return permission decimals rather than a Permissions object, making it hard to manipulate or read them if you don't want to use bitwise operations.
You can however pass these decimals to the Permissions constructor to convert them.

```js
const { Permissions } = require('discord.js');

// constructing a Permissions Object from a permission number
const permissions = new Permissions(268550160);
// constructing a Permissions Object from an array of PermissionResolvables
const flags = ['MANAGE_CHANNELS', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MANAGE_ROLES'];
const permissions2 = new Permissions(flags);
```

### Checking for permissions

The Permissions object features the `.has()` method allowing an easy way to check flags in a Permissions bit field.
The `.has()` method takes two parameters. The first being either a permission number, single flag or an array of permission numbers and flags, the second being a boolean (true or false) indicating if you want to allow the `ADMINISTRATOR` permission to override (defaults to true).

Let's say you want to know if the decimal bit field representation `268550160` has `MANAGE_CHANNELS` referenced:

```js
const { Permissions } = require('discord.js');

const permissions = new Permissions(268550160);
console.log(permissions.has('MANAGE_CHANNELS'));
// output: true
console.log(permissions.has(['MANAGE_CHANNELS', 'EMBED_LINKS']));
// output: true
console.log(permissions.has(['MANAGE_CHANNELS', 'KICK_MEMBERS']));
// output: false

const adminPermissions = new Permissions('ADMINISTRATOR');
console.log(adminperms.has('MANAGE_CHANNELS'));
// output: true
console.log(adminperms.has('MANAGE_CHANNELS'), true);
// output: true
console.log(adminperms.has('MANAGE_CHANNELS'), false);
// output: false
```

### Manipulating permissions

The Permissions object enables you to easily add or remove certain permissions from an existing bit field without having to worry about bitwise operations. Both `.add()` and `.remove()` can take a single permission flag or number, an array of permission flags or numbers or multiple permission flags or numbers as multiple parameters.

```js
const { Permissions } = require('discord.js');

const permissions = new Permissions(268550160);
console.log(permissions.has('KICK_MEMBERS'));
// output: false
permissions.add('KICK_MEMBERS');
console.log(permissions.has('KICK_MEMBERS'));
// output: true
permissions.remove(2);
console.log(permissions.has('KICK_MEMBERS'));
// output : false
```

You can utilize these methods to adapt permissions or overwrites without touching the other flags. To achieve this you can get the existing permissions for a role, manipulating the bit field as described above and passing the changed bit field to `role.setPermissions()`.

<tip>In the stable branch `role.permissions` returns a number which needs to be converted to a Permissions object for this to work as described here, we covered how to achieve this in the section "Converting permission numbers to Objects"</tip>

## Final permissions

Discord.js features two utility functions to easily determine the final permissions for a guild member or role in a specific channel: `.permissionsFor()` on the [GuildChannel](https://discord.js.org/#/docs/main/stable/class/GuildChannel?scrollTo=permissionsFor) class and `.permissionsIn()` on the [GuildMember](https://discord.js.org/#/docs/main/stable/class/GuildMember?scrollTo=permissionsIn) class (Note that the Role class does not yet feature a `.permissionsIn()` function on stable). Both return a Permissions object.

To check your bots permissions in the channel the command was used in you could use something like this:

```js
// Final permissions for a guild member using permissionsFor
if (message.channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'VIEW_CHANNEL'])) {
	return console.log('I can send a message here');
}

// Final permissions for a guild member using permissionsIn

if (message.guild.me.permissionsIn(message.channel).has(['SEND_MESSAGES', 'VIEW_CHANNEL'])) {
	return console.log('I can send a message here');
}

// Final permissions for a role
if (channel.permissionsFor(myRole).has(['SEND_MESSAGES', 'VIEW_CHANNEL'])) {
	channel.send('This role can send a message here');
}
```
As you will generally want to allow `ADMINISTRATOR` to override you don't need to specify a second parameter here. It defaults to true.

## Syncing permissions with a category

If the permission overwrites on a channel under a category match with the parent (category) the channel is considered to be synchronized. This means that any changes in the categories overwrites will now also change the channels overwrites. Changing the child channels overwrites will not effect the parent. 

To easily synchronize permissions with the parent channel you can call the `.lockPermissions()` method on the respective child channel.  

```js
if (!channel.parent) {
	console.log('This channel is not listed under a category');
}

channel.lockPermissions()
	.then(() => console.log('Successfully synchronized permissions with parent channel'))
	.catch(console.error);
```

## Resulting code

If you want to check a working implementation for all methods and functionalities explained in this guide, you can look at a boilerplate bot over on the GitHub repository [here](https://github.com/discordjs/guide/tree/master/code-samples/popular-topics/permissions/).
