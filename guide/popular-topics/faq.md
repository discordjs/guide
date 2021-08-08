# Frequently asked Questions

## Legend

* `<client>` is a placeholder for the Client object, such as `const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });`.
* `<interaction>` is a placeholder for the Interaction object, such as `client.on('interactionCreate', interaction => { ... });`.
* `<guild>` is a placeholder for the Guild object, such as `<interaction>.guild` or `<client>.guilds.cache.get('<id>')`.
* `<voiceChannel>` is a placeholder for the VoiceChannel object, such as `<message>.member.voice.channel`

For a more detailed explanation of the notations commonly used in this guide, the docs, and the support server, see [here](/additional-info/notation.md).

## Administrative

### How do I ban a user?

<!-- eslint-skip -->

```js
const user = <interaction>.options.getUser('target');
<guild>.members.ban(user);
```

### How do I unban a user?

<!-- eslint-skip -->

```js
const id = <interaction>.options.get('target')?.value;
<guild>.members.unban(id);
```

::: tip
Because you cannot ping a user who isn't in the server, you have to pass in the user id. To do this, we use a <DocsLink path="typedef/CommandInteractionOption">`CommandInteractionOption`</DocsLink>. See [here](/interactions/replying-to-slash-commands.html#parsing-options) for more information on this topic.
:::

### How do I kick a user?

<!-- eslint-skip -->

```js
const member = <interaction>.options.getMember('target');
member.kick();
```

### How do I add a role to a guild member?

<!-- eslint-skip -->

```js
const role = <interaction>.options.getRole('role');
const member = <interaction>.options.getMember('target');
member.roles.add(role);
```

### How do I check if a guild member has a specific role?

<!-- eslint-skip -->

```js
const member = <interaction>.options.getMember('target');
if (member.roles.cache.some(role => role.name === '<role name>')) {
	// ...
}
```

### How do I limit a command to a single user?

<!-- eslint-skip -->

```js
if (<interaction>.user.id === '<id>') {
	// ...
}
```

## Bot Configuration and Utility

### How do I set my bot's username?

<!-- eslint-skip -->

```js
<client>.user.setUsername('<username>');
```

### How do I set my bot's avatar?

<!-- eslint-skip -->

```js
<client>.user.setAvatar('<url or path>');
```

### How do I set my playing status?

<!-- eslint-skip -->

```js
<client>.user.setActivity('<activity>');
```

### How do I set my status to "Watching/Listening to/Competing in ..."?

<!-- eslint-skip -->

```js
<client>.user.setActivity('<activity>', { type: 'WATCHING' });
<client>.user.setActivity('<activity>', { type: 'LISTENING' });
<client>.user.setActivity('<activity>', { type: 'COMPETING' });
```

::: tip
If you would like to set your activity upon startup, you can use the `ClientOptions` object to set the appropriate `Presence` data.
:::

### How do I make my bot display online/idle/dnd/invisible?

<!-- eslint-skip -->

```js
<client>.user.setStatus('online');
<client>.user.setStatus('idle');
<client>.user.setStatus('dnd');
<client>.user.setStatus('invisible');
```

### How do I set both status and activity in one go?

<!-- eslint-skip -->

```js
<client>.user.setPresence({ activities: [{ name: '<activity>' }], status: 'idle' });
```

## Miscellaneous

### How do I send a message to a specific channel?

<!-- eslint-skip -->

```js
const channel = <client>.channels.cache.get('<id>');
channel.send('<content>');
```

### How do I DM a specific user?

<!-- eslint-skip -->

```js
const user = <client>.users.cache.get('<id>');
user.send('<content>');
```

::: tip
If you want to DM the user who sent the interaction, you can use `<interaction>.user.send()`.
:::

### How do I mention a specific user in a message?

<!-- eslint-skip -->

```js
const user = <interaction>.options.getUser('target');
await <interaction>.reply(`Hi, ${user}.`);
await <interaction>.followUp('Hi, <@user id>.');
```

::: tip
Mentions in embeds may resolve correctly in embed description and field values but will never notify the user. Other areas do not support mentions at all.
:::

### How do I control which users and/or roles are mentioned in a message?

Controlling which mentions will send a ping is done via the `allowedMentions` option, which replaces `disableMentions`.

This can be set as a default in `ClientOptions`, and controlled per-message sent by your bot.
```js
new Client({ allowedMentions: { parse: ['users', 'roles'] } });
```

Even more control can be achieved by listing specific `users` or `roles` to be mentioned by ID, e.g.:
```js
channel.send({
	content: '<@123456789012345678> <@987654321098765432> <@&102938475665748392>',
	allowedMentions: { users: ['123456789012345678'], roles: ['102938475665748392'] },
});
```

### How do I prompt the user for additional input?

<!-- eslint-skip -->

```js
<interaction>.reply('Please enter more input.').then(() => {
	const filter = m => <interaction>.user.id === m.author.id;

	<interaction>.channel.awaitMessages({ filter, time: 60000, max: 1, errors: ['time'] })
		.then(messages => {
			<interaction>.followUp(`You've entered: ${messages.first().content}`);
		})
		.catch(() => {
			<interaction>.followUp('You did not enter any input!');
		});
});
```

::: tip
If you want to learn more about this syntax or other types of collectors, check out [this dedicated guide page for collectors](/popular-topics/collectors.md)!
:::

### How do I block a user from using my bot?

<!-- eslint-skip -->

```js
const blockedUsers = ['id1', 'id2'];
<client>.on('interactionCreate', interaction => {
	if (blockedUsers.includes(interaction.user.id)) return;
});
```

::: tip
You do not need to have a constant local variable like `blockedUsers` above. If you have a database system that you use to store IDs of blocked users, you can query the database instead:

<!-- eslint-skip -->

```js
<client>.on('interactionCreate', async interaction => {
	const blockedUsers = await database.query('SELECT user_id FROM blocked_users;');
	if (blockedUsers.includes(interaction.user.id)) return;
});
```

Note that this is just a showcase of how you could do such a check.
:::

### How do I react to the message my bot sent?

<!-- eslint-skip -->

```js
<interaction>.channel.send('My message to react to.').then(sentMessage => {
	// Unicode emoji
	sentMessage.react('👍');

	// Custom emoji
	sentMessage.react('123456789012345678');
	sentMessage.react('<emoji:123456789012345678>');
	sentMessage.react('<a:emoji:123456789012345678>');
	sentMessage.react('emoji:123456789012345678');
	sentMessage.react('a:emoji:123456789012345678');
});
```

::: tip
If you want to learn more about reactions, check out [this dedicated guide on reactions](/popular-topics/reactions.md)!
:::

### How do I restart my bot with a command?

```js
process.exit();
```

::: danger
`process.exit()` will only kill your Node process, but when using [PM2](http://pm2.keymetrics.io/), it will restart the process whenever it gets killed. You can read our guide on PM2 [here](/improving-dev-environment/pm2.md).
:::

### What is the difference between a User and a GuildMember?

A User represents a global Discord user, and a GuildMember represents a Discord user on a specific server. That means only GuildMembers can have permissions, roles, and nicknames, for example, because all of these things are server-bound information that could be different on each server that the user is in.

### How do I find all online members of a guild?

<!-- eslint-skip -->

```js
// First use guild.members.fetch to make sure all members are cached
<guild>.members.fetch().then(fetchedMembers => {
	const totalOnline = fetchedMembers.filter(member => member.presence.status === 'online');
	// Now you have a collection with all online member objects in the totalOnline variable
	console.log(`There are currently ${totalOnline.size} members online in this guild!`)
});
```

::: warning
This only works correctly if you have the `GUILD_PRESENCES` intent enabled for your application and client.
If you want to learn more about intents, check out [this dedicated guide on intents](/popular-topics/intents.md)!
:::

### How do I check which role was added/removed and for which member?

<!-- eslint-skip -->

```js
// Start by declaring a guildMemberUpdate listener
// This code should be placed outside of any other listener callbacks to prevent listener nesting
client.on('guildMemberUpdate', (oldMember, newMember) => {
	// If the role(s) are present on the old member object but no longer on the new one (i.e role(s) were removed)
	const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
	if (removedRoles.size > 0) {
		console.log(`The roles ${removedRoles.map(r => r.name)} were removed from ${oldMember.displayName}.`);
	}

	// If the role(s) are present on the new member object but are not on the old one (i.e role(s) were added)
	const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
	if (addedRoles.size > 0) {
		console.log(`The roles ${addedRoles.map(r => r.name)} were added to ${oldMember.displayName}.`);
	}
});
```

### How do I check the bot's ping?

There are two common measurements for bot pings. The first, **Websocket heartbeat**, is the average interval of a regularly sent signal indicating the healthy operation of the WebSocket connection the library receives events over:

<!-- eslint-skip -->

```js
<interaction>.reply(`Websocket heartbeat: ${<client>.ws.ping}ms.`);
```

::: tip
A specific shards heartbeat can be found on the WebSocketShard instance, accessible at `<client>.ws.shards` > `.ping`.
:::

The second, **Roundtrip Latency**, describes the amount of time a full API roundtrip (from the creation of the command message to the creation of the response message) takes. You then edit the response to the respective value to avoid needing to send yet another message:

<!-- eslint-skip -->

```js
<interaction>.reply('Pinging...', { fetchReply: true })
	.then(sent => {
		sent.edit(`Roundtrip latency: ${sent.createdTimestamp - <interaction>.createdTimestamp}ms`);
	});
```

### How do I play music from YouTube?

For this to work, you need to have `ytdl-core` and `@discordjs/voice` installed.

```bash
npm install ytdl-core @discordjs/voice
```

Additionally, you may need the following:

```bash
npm install --save @discordjs/opus # opus engine (if missing)
sudo apt-get install ffmpeg # ffmpeg debian/ubuntu
npm install ffmpeg-static # ffmpeg windows
```

<!-- eslint-skip -->

```js
const ytdl = require('ytdl-core');
const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');

// ...

const connection = joinVoiceChannel({
	channelId: <voiceChannel>.id,
	guildId: <guild>.id,
	adapterCreator: <guild>.voiceAdapterCreator,
});

const stream = ytdl('<youtubelink>', { filter: 'audioonly' });
const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
const player = createAudioPlayer();

player.play(resource);
connection.subscribe(player);

player.on(AudioPlayerStatus.Idle, () => connection.destroy());
```

::: tip
You can learn more about these methods in the [voice section of this guide](/voice)!
:::

### Why do some emojis behave weirdly?

If you've tried using [the usual method of retrieving unicode emojis](/popular-topics/reactions.md#unicode-emojis), you may have noticed that some characters don't provide the expected results. Here's a short snippet that'll help with that issue. You can toss this into a file of its own and use it anywhere you need! Alternatively feel free to simply copy-paste the characters from below:

```js
// emojiCharacters.js
module.exports = {
	a: '🇦', b: '🇧', c: '🇨', d: '🇩',
	e: '🇪', f: '🇫', g: '🇬', h: '🇭',
	i: '🇮', j: '🇯', k: '🇰', l: '🇱',
	m: '🇲', n: '🇳', o: '🇴', p: '🇵',
	q: '🇶', r: '🇷', s: '🇸', t: '🇹',
	u: '🇺', v: '🇻', w: '🇼', x: '🇽',
	y: '🇾', z: '🇿', 0: '0️⃣', 1: '1️⃣',
	2: '2️⃣', 3: '3️⃣', 4: '4️⃣', 5: '5️⃣',
	6: '6️⃣', 7: '7️⃣', 8: '8️⃣', 9: '9️⃣',
	10: '🔟', '#': '#️⃣', '*': '*️⃣',
	'!': '❗', '?': '❓',
};
```

<!-- eslint-skip -->

```js
// index.js
const emojiCharacters = require('./emojiCharacters.js');

console.log(emojiCharacters.a); // 🇦
console.log(emojiCharacters[10]); // 🔟
console.log(emojiCharacters['!']); // ❗
```

::: tip
On Windows, you may be able to use the `Win + .` keyboard shortcut to open up an emoji picker that can be used for quick, easy access to all the Unicode emojis available to you. Some of the emojis listed above may not be represented there, though (e.g., the 0-9 emojis).
:::
