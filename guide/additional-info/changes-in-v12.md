# Changes in v12

If you weren't already aware, v12 is constantly in development, and you can even start using it by running `npm install hydrabolt/discord.js` (as opposed to `npm install discord.js`). However, there are many breaking changes from v11 to v12; you'll almost definitely need to change your code in a few places. This section of the guide is here to let you know what those changes are and how you can change your code accordingly.

The section headers will be named after the v11 classes/methods/properties and will be in alphabetical order, so that you can easily find what you're looking for. "Difference" codeblocks will be used to show you the old methods vs the newer ones—the red being what's been removed and the green being its replacement. Some bits may have more than one version of being handled.

<p class="danger">This next bit is for me (Sanc) to keep track of the classes I've gone through and checked for breaking changes. Remove before making the PR.</p>

* ClientUser
* Guild
* Invite

## Breaking changes

<p class="danger">Before anything, it is important to note that discord.js v12 (and so forth) requires a **minimum** Node version of v8. If you aren't sure what Node version you're on, run `node -v` in your console and update if necessary.</p>

### Attachment

The `Attachment` class has been renamed to `MessageAttachment`.

### Channel#send\*\*\*

All the `.send***()` methods were removed in favor of one general `.send()` method.

```diff
- channel.sendMessage('Hey!');
+ channel.send('Hey!');
```

```diff
- channel.sendEmbed(embedVariable);
+ channel.send(embedVariable);
+ channel.send({ embed: embedVariable });
```

<p class="warning">`channel.send(embedVariable)` will only work if that variable is an instance of the `MessageEmbed` class; object literals won't give you the expected result unless your embed data is inside an `embed` key.</p>

```diff
- channel.sendCode('js', 'const version = 11;');
+ channel.send('const version = 12;', { code: 'js' });
```

<p class="tip">Assuming you have the `MessageAttachment` class required somewhere in your file, e.g. `const { MessageAttachment } = require('discord.js')`.</p>

```diff
- channel.sendFile('./file.png', 'file-name.png');
+ channel.send({ files: [{ attachment: './file.png', name: 'file-name.png' }] });
+ channel.send(new MessageAttachment('./file.png', 'file-name.png'));

- channel.sendFile('./file.png', 'file-name.png', 'With a message attached');
+ channel.send('With a message attached', { files: [new MessageAttachment('./file.png', 'file-name.png')] });
```

```diff
- channel.sendFiles(['./file-one.png', './file-two.png']);
+ channel.send({ files: [{ attachment: './file-one.png' }, { attachment: './file-one.png' }] });
+ channel.send({ files: [new MessageAttachment('./file-one.png'), new MessageAttachment('./file-two.png')] });
```

### Channel#fetchMessage(s)

`channel.fetchMessage()` and `channel.fetchMessages()` were both removed and transformed in the shape of DataStores.

```diff
- channel.fetchMessage('123456789012345678');
+ channel.messages.fetch('123456789012345678');
```

```diff
- channel.fetchMessages({ limit: 100 });
+ channel.messages.fetch({ limit: 100 });
```

### Client#fetchUser

`client.fetchUser()` has been removed and transformed in the shape of a DataStore.

```diff
- client.fetchUser('123456789012345678');
+ client.users.fetch('123456789012345678');
```

### ClientUser#acceptInvite

`clientUser.acceptInvite()` has been removed entirely.

### ClientUser#addFriend

`clientUser.addFriend()` has been removed entirely.

### ClientUser#block

`clientUser.block()` has been removed entirely.

### ClientUser#avatarURL

`clientUser.avatarURL` is now a method as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- clientUser.avatarURL;
+ clientUser.avatarURL();
+ clientUser.avatarURL({ format: 'png', size: 1024 });
```

### ClientUser#createGuild

The second and third parameters in `clienrUser.createGuild()` have been changed/removed, leaving it with a total of two parameters. The `region` and `icon` parameters from v11 have been merged into an object as the second parameter.

```diff
- clientUser.createGuild('New server', 'us-east', './path/to/file.png');
+ clientUser.createGuild('New server', { region: 'us-east', icon: './path/to/file.png' });
```

### ClientUser#displayAvatarURL

`clientUser.displayAvatarURL` is now a method as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- clientUser.displayAvatarURL;
+ clientUser.displayAvatarURL();
+ clientUser.displayAvatarURL({ format: 'png', size: 1024 });
```

### ClientUser#removeFriend

`clientUser.removeFriend()` has been removed entirely.

### ClientUser#send\*\*\*

Just like the `Channel#send***` methods, all the `.send***()` methods were removed in favor of one general `.send()` method. Read through the [Channel#send\*\*\*](/additional-info/changes-in-v12?id=channelsend) section for more information.

### ClientUser#setGame

`clientUser.setGame()` has been changed to `clientUser.setActivity()`. The second parameter is no longer for providing a streaming URL, but rather an object that allows you to provide the URL and activity type.

```diff
- clientUser.setGame('with my bot friends!');
+ clientUser.setActivity('with my bot friends!');

- clientUser.setGame('with my bot friends!', 'https://twitch.tv/your/stream/here');
+ clientUser.setActivity('with my bot friends!', { url: 'https://twitch.tv/your/stream/here', type: 'STREAMING' });
```

### ClientUser#setPassword

The second parameter in `clientUser.setPassword()` has been changed. The `oldPassword` parameter from v11 has been changed into an object as the second parameter.

```diff
- clientUser.setPassword('newpassword', 'oldpassword');
+ clientUser.setPassword('newpassword', { oldPassword: 'oldpassword', mfaCode: '123456' });
```

### ClientUser#unblock

`clientUser.unblock()` has been removed entirely.

### Guild#createChannel

The third and fourth parameters in `guild.createChannel()` have been changed/removed, leaving it with a total of three parameters. The `overwrites` and `reason` parameters from v11 have been merged into an object as the third parameter.

```diff
- guild.createChannel('new-channel', 'text', permissionOverwriteArray, 'New channel');
+ guild.createChannel('new-channel', 'text', { overwrites: permissionOverwriteArray, reason: 'New channel' });
```

### Guild#createEmoji

The third and fourth parameters in `guild.createEmoji()` have been changed/removed, leaving it with a total of three parameters. The `roles` and `reason` parameters from v11 have been merged into an object as the third parameter.

```diff
- guild.createEmoji('./path/to/file.png', 'NewEmoji', collectionOfRoles, 'New emoji added for fun!');
+ guild.createEmoji('./path/to/file.png', 'NewEmoji', { roles: collectionOfRoles, reason: 'New emoji added for fun!' });
```

### Guild#createRole

The first and second parameters in `guild.createRole()` have been changed/removed, leaving it with a total of one parameter. The `data` and `reason` parameters from v11 have been moved into an object as the first parameter.

```diff
- guild.createRole(roleData, 'New staff role');
+ guild.createRole({ data: roleData, reason: 'New staff role' });
```

### Guild#deleteEmoji

`Guild.deleteEmoji()` has been removed and transformed in the shape of a DataStore.

```diff
- guild.deleteEmoji('123456789012345678');
+ guild.emojis.resolve('123456789012345678').delete();
```

### Guild#defaultChannel

Unfortunately, "default" channels don't exist in Discord anymore, and as such, the `guild.defaultChannel` property has been removed with no alternative.

**Q:** "I previously had a welcome message system (or something similar) set up using that property. What can I do now?"

**A:** There are a few ways to tackle this. Using the example of a welcome message system, inside the `guildMemberAdd` event, you can:

1. Make a new command that creates a `welcome-messages` channel, set up a database, store the channel ID in a column, and use `client.channels.get('id')` to send to that channel. This is the most reliable method and gives server staff freedom to rename the channel as they please.
2. Make a new command that creates a `welcome-messages` channel and use `guild.channels.find('name', 'welcome-messages')`. This method will work nearly the same as the one above, but will break if someone on that server decides to rename the channel. This may also give you unexpected results, due to Discord allowing multiple channels to have the same name.

<p class="tip">Not sure how to set up a database? Check out [this page](/sequelize/)!</p>

### Guild#defaultRole

`guild.defaultRole` has been removed entirely. As an alternative, you can use `.get()` with the Guild's ID on the `guild.roles` Collection.

```diff
- guild.defaultRole;
+ guild.roles.get(guild.id);
```

### Guild#fetchMember(s)

`guild.fetchMember()` and `guild.fetchMembers()` were both removed and transformed in the shape of DataStores. In addition, `guild.members.fetch()` will return a `Collection` of `GuildMember`s in v12, where as v11 would return a `Guild` object.

```diff
- guild.fetchMember('123456789012345678');
+ guild.members.fetch('123456789012345678');
```

```diff
- guild.fetchMembers();
+ guild.members.fetch();
```

### Guild#iconURL

`guild.iconURL` is now a method as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- guild.iconURL;
+ guild.iconURL();
+ guild.iconURL({ format: 'png', size: 1024 });
```

### Guild#pruneMembers

The first, second, and third parameters in `guild.createEmoji()` have been changed/removed, leaving it with a total of one parameter. The `dry` and `reason` parameters from v11 have been merged into an object as the first parameter.

```diff
- guild.pruneMembers(7, true, 'Scheduled pruning');
+ guild.pruneMembers({ days: 7, dry: true, reason: 'Scheduled pruning' });
```

### Guild#setChannelPosition

`guild.setChannelPosition()` has been removed entirely. As an alternative, you can use `channel.setPosition()`.

### Guild#setRolePosition

`guild.setRolePosition()` has been removed entirely. As an alternative, you can use `role.setPosition()`.

### Guild#splashURL

`guild.splashURL` is now a method as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- guild.splashURL;
+ guild.splashURL();
+ guild.splashURL({ format: 'png', size: 1024 });
```

### GuildChannel#createInvite

`channel.createInvite()` no longer takes a second parameter. The `reason` parameter has been moved inside the first parameter's object as a `reason` property.

```diff
- channel.createInvite({ temporary: true }, 'Just testing');
+ channel.createInvite({ temporary: true, reason: 'Just testing' });
```

### GuildMember#hasPermissions

`member.hasPermissions()` has been removed, but `member.hasPermission()` now takes either a string or an array.

```diff
- member.hasPermissions(['MANAGE_MESSAGES', 'MANAGE_ROLES']);
+ member.hasPermission(['MANAGE_MESSAGES', 'MANAGE_ROLES']);
```

### Message#delete

The first parameter in `message.delete()` has been changed from a number to an object, also allowing you to set the reason for deleting that message.

```diff
- message.delete(5000);
+ message.delete({ timeout: 5000 });
+ message.delete({ timeout: 5000, reason: 'Very bad message' });
```

### Message#editCode

In the same sense that the `.send*()` methods were removed, `.editCode()` was also removed entirely.

```diff
- message.editCode('js', 'const version = 11;');
+ message.edit('const version = 12;', { code: 'js' });
```

### Message#is(Member)Mentioned

`message.isMentioned()` and `message.isMemberMentioned()` have been removed in favor of `message.mentions.has()`.

```diff
- message.isMentioned('123456789012345678');
- message.isMemberMentioned('123456789012345678');
+ message.mentions.has('123456789012345678');
```

### MessageCollector#max(Matches)

The `max` and `maxMatches` properties of the `MessageCollector` class have been renamed and repurposed.

```diff
- `max`: The The maximum amount of messages to process.
+ `maxProcessed`: The maximum amount of messages to process.

- `maxMatches`: The maximum amount of messages to collect.
+ `max`: The maximum amount of messages to collect.
```

### MessageEmbed#client

`embed.client` has been removed entirely.

### MessageEmbed#message

`embed.message` has been removed entirely.

### OAuth2Application

The `OAuth2Application` class has been renamed to `ClientApplication`.

### OAuth2Application#reset

`application.reset()` has been renamed to `application.resetSecret()`.

### OAuth2Application#iconURL

`application.iconURL` is now a method as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- user.iconURL;
+ user.iconURL();
+ user.iconURL({ format: 'png', size: 1024 });
```

### Permissions#flags

The following permission flag names have been renamed:

* `READ_MESSAGES` -> `VIEW_CHANNEL`
* `EXTERNAL_EMOJIS` -> `USE_EXTERNAL_EMOJIS`
* `MANAGE_ROLES_OR_PERMISSIONS` -> `MANAGE_ROLES`

### Permissions#member

`permissions.member` has been removed entirely with no alternative.

### Permissions#missingPermissions

`permissions.missingPermissions()` has been renamed to `permissions.missing()` and refactored a bit. The second parameter in v11 was named `explicit`, described as "Whether to require the user to explicitly have the exact permissions", defaulting to `false`. However, the second parameter in v11 is named `checkAdmin`, described as "Whether to allow the administrator permission to override", and defaulting to `true`.

```diff
- permissions.missingPermissions(['MANAGE_SERVER']);
+ permissions.missing(['MANAGE_SERVER']);
```

### Permissions#raw

`permissions.raw` has been removed. Should you need to use this, you can use `permissions.bitfield` instead.

### RichEmbeds

The `MessageEmbed` class is the new and improved `RichEmbed`. In most cases, all you'll need to do is find & replace `RichEmbed` with `MessageEmbed` in your code. However, there are some small differences.

```diff
- new RichEmbed().attachFile('attachment://file-namme.png');
+ new MessageEmbed().attachFiles(['attachment://file-namme.png']);

- new RichEmbed().attachFile({ attachment: './file-name.png' });
+ new MessageEmbed().attachFiles([{ attachment: './file-name.png' }]);

- new RichEmbed().attachFile(new Attachment('./file-name.png'));
+ new MessageEmbed().attachFiles([new MessageAttachment('./file-name.png')]);
```

### Role#hasPermission(s)

`role.hasPermission()` and `role.hasPermissions()` were both removed, but `Role` objects still have a `.permissions` property, in which you can use the `.has()` method on.

```diff
- role.hasPermission('MANAGE_MESSAGES');
+ role.permissions.has('MANAGE_MESSAGES');
```

```diff
- role.hasPermissions(['MANAGE_MESSAGES', 'MANAGE_SERVER']);
+ role.permissions.has(['MANAGE_MESSAGES', 'MANAGE_SERVER']);
```

### TextChannel#createCollector

`channel.createCollector()` has now been removed in favor of `channel.createMessageCollector()` (which was already available in v11.1). In addition, the `max` and `maxMatches` properties were renamed and repurposed. You can read more about that [here](/additional-info/changes-in-v12?id=messagecollectormaxmatches).

```diff
- channel.createCollector(filterFunction, { maxMatches: 2, max: 10, time: 15000 });
+ channel.createMessageCollector(filterFunction, { max: 2, maxProcessed: 10, time: 15000 });
```

### User#avatarURL

`user.avatarURL` is now a method as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- user.avatarURL;
+ user.avatarURL();
+ user.avatarURL({ format: 'png', size: 1024 });
```

### User#displayAvatarURL

`user.displayAvatarURL` is now a method as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- user.displayAvatarURL;
+ user.displayAvatarURL();
+ user.displayAvatarURL({ format: 'png', size: 1024 });
```

### Webhook#send\*\*\*

Just like the `Channel#send***` methods, all the `.send***()` methods were removed in favor of one general `.send()` method. Read through the [Channel#send\*\*\*](/additional-info/changes-in-v12?id=channelsend) section for more information.

