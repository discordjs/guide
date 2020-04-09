# Permissions (extended)

## Discord's permission system

Discord permissions are stored in a 53-bit integer and calculated using bitwise operations. If you want to dive deeper into what's happening behind the curtains, check the [Wikipedia](https://en.wikipedia.org/wiki/Bit_field) and [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators) articles on the topic.

In discord.js, permission bit fields are represented as either the decimal value of said bit field or its referenced flags.
Every position in a permissions bit field represents one of these flags and its state (either referenced `1` or not referenced `0`).

Before we get into actually assigning permissions, let's quickly go over the method Discord uses to determine a guild members final permissions:

1. Take all permissions for all roles the guild member has and add them up.
2. Apply all denies for the default role (@everyone).
3. Apply all allows for the default role (@everyone ).
4. Apply all denies for all additional roles the guild member has at once.
5. Apply all allows for all additional roles the guild member has at once.
6. Apply all denies for the specific guild member if they exist.
7. Apply all allows for the specific guild member if they exist.

Due to this system, you cannot deny base permissions. If you grant @everyone `SEND_MESSAGES` and don't grant it for a muted members role, muted members will still be able to send messages unless you specify channel-based overwrites.

All additional roles allow overwrites are applied after all additional roles denies! If any of a member's roles has an overwrite to explicitly allow a permission, the member will be able to execute the associated actions in this channel regardless of role hierarchy. 

Placing an overwrite to allow `SEND_MESSAGES` on a role will result in members with this role to not be mutable via role assignment in this channel. 

## Elevated permissions

If the guild owner enables the servers two-factor authentication option, everyone executing a certain subset of actions will need to have 2FA enabled on their account. As bots do not have 2FA themselves, you, as the application owner, will need to enable it on your account for your bot to work on those servers.
Check out [Discords help article](https://support.discordapp.com/hc/en-us/articles/219576828-Setting-up-Two-Factor-Authentication) if you need assistance with this.

The permissions assigned to these actions are called "elevated permissions" and are: 
`KICK_MEMBERS`, `BAN_MEMBERS`, `ADMINISTRATOR`, `MANAGE_CHANNELS`, `MANAGE_GUILD`, `MANAGE_MESSAGES`, `MANAGE_ROLES`, `MANAGE_WEBHOOKS` and `MANAGE_EMOJIS`.

## Implicit permissions

Some Discord permissions apply implicitly based on logical use, which can cause unwanted behavior if you are not aware of this fact.

The prime example for implicit permissions is `VIEW_CHANNEL`. If this flag is missing in the final permissions, you can't do anything on that channel. Makes sense, right? If you can't view the channel, you can't read or send messages in it, set the topic, or change its name.
The library does not handle implicit permissions for you, so understanding how the system works is vital for you as a bot developer.

Let's say you want to send a message in a channel. To prevent unnecessary API calls, you want to make sure your bots permissions in this channel include `SEND_MESSAGES` (more on how to achieve this [here](/popular-topics/permissions.md#checking-for-permissions)). The check passes, but you still can't actually send the message and are greeted with `DiscordAPIError: Missing Access`.

This means your bot is missing `VIEW_CHANNEL`, and as such, can't send messages either.

One possible scenario causing this: the channel has permission overwrites for the default role @everyone to grant `SEND_MESSAGES` so everyone who can see the channel can also write in it, but at the same time has an overwrite to deny `VIEW_CHANNEL` to make it only accessible to a subset of members.

As you only check for `SEND_MESSAGES` the bot will try to execute the send, but since `VIEW_CHANNEL` is missing, the request is denied by the API.

::: tip
Causes for "Missing Access":
- Text Channels require `VIEW_CHANNEL` as detailed above.
- Voice Channels require `CONNECT` in the same way.
- Reacting on a message requires `READ_MESSAGE_HISTORY` in the channel the message was posted in.
:::

## Limitations and oddities

- Your bot needs `MANAGE_ROLES` in its base permissions to change base permissions.
- It needs `MANAGE_ROLES` in its final permissions to change permission overwrites.
- It can not edit permissions for roles that are higher than or equal to its highest role.
- It can not grant permissions it doesn't have.
- It can manage overwrites for roles or users with higher roles than its own highest role.
- It can manage overwrites for permissions it doesn't have.
- Members with the `ADMINISTRATOR` permission are not affected by overwrites at all.

## Missing permissions

During your development you will likely run into `DiscordAPIError: Missing Permissions` at some point. This error can be caused by one of the following:

- Your bot is missing the needed permission to execute this action in it's calculated base or final permissions (requirement changes based on the type of action you are trying to execute).
- You provided an invalid permission number while trying to create overwrites. (The calculator on the apps page returns decimal values while the developer documentation lists the flags in hex. Make sure you are not mixing the two and don't use the hex prefix `0x` where not applicable)
- It is trying to execute an action on a guild member with a role higher than or equal to your bots highest role.
- It is trying to modify or assign a role that is higher than or equal to its highest role.
- It is trying to execute a forbidden action on the server owner.
- It is trying to execute an action based on another unfulfilled factor (for example reserved for partnered guilds).
- It is trying to execute an action on a voice channel without the `VIEW_CHANNEL` permission.

::: warning
The `ADMINISTRATOR` permission being granted does not skip any hierarchical check!
:::
