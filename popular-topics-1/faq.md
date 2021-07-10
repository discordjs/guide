# Frequently asked Questions

## Legend

* `<client>` is a placeholder for the Client object, such as `const client = new Discord.Client();`.
* `<message>` is a placeholder for the Message object, such as `client.on('message', message => { ... });`.
* `<guild>` is a placeholder for the Guild object, such as `<message>.guild` or `<client>.guilds.cache.get('<id>')`.
* `<voiceChannel>` is a placeholder for the VoiceChannel object, such as `<message>.member.voice.channel`

For a more detailed explanation of the notations commonly used in this guide, the docs, and the support server, see [here](https://github.com/zachjmurphy/guide/tree/9925b2dac70a223dd2dbb549ce57ddb5515bcbc0/additional-info/notation.md).

## Administrative

### How do I ban a user?

```javascript
const user = <message>.mentions.users.first();
<guild>.members.ban(user);
```

### How do I unban a user?

```javascript
const id = args[0];
<guild>.members.unban(id);
```

::: tip Because you cannot ping a user who isn't in the server, you have to pass in the user id. To do this, we use arguments, represented by `args` \(see [Commands with user input](https://github.com/zachjmurphy/guide/tree/9925b2dac70a223dd2dbb549ce57ddb5515bcbc0/creating-your-bot/commands-with-user-input/README.md) for more details on this topic\). :::

### How do I kick a user?

```javascript
const member = <message>.mentions.members.first();
member.kick();
```

### How do I add a role to a guild member?

```javascript
const role = <guild>.roles.cache.find(role => role.name === '<role name>');
const member = <message>.mentions.members.first();
member.roles.add(role);
```

### How do I check if a guild member has a specific role?

```javascript
const member = <message>.mentions.members.first();
if (member.roles.cache.some(role => role.name === '<role name>')) {
    // ...
}
```

### How do I limit a command to a single user?

```javascript
if (<message>.author.id === '<id>') {
    // ...
}
```

## Bot Configuration and Utility

### How do I set my bot's username?

```javascript
<client>.user.setUsername('<username>');
```

### How do I set my bot's avatar?

```javascript
<client>.user.setAvatar('<url or path>');
```

### How do I set my playing status?

```javascript
<client>.user.setActivity('<activity>');
```

### How do I set my status to "Watching ..." or "Listening to ..."?

```javascript
<client>.user.setActivity('<activity>', { type: 'WATCHING' });
<client>.user.setActivity('<activity>', { type: 'LISTENING' });
```

::: tip If you would like to set your activity upon startup, you can use the `ClientOptions` object to set the appropriate `Presence` data. :::

### How do I make my bot display online/idle/dnd/invisible?

```javascript
<client>.user.setStatus('online');
<client>.user.setStatus('idle');
<client>.user.setStatus('dnd');
<client>.user.setStatus('invisible');
```

### How do I set both status and activity in one go?

```javascript
<client>.user.setPresence({ activity: { name: '<activity>' }, status: 'idle' });
```

### How do I add a mention prefix to my bot?

```javascript
const Discord = require('discord.js');

const client = new Discord.Client();
const prefix = '!';

const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

client.on('message', message => {
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        message.channel.send('Pong!');
    } else if (command === 'prefix') {
        message.reply(`you can either ping me or use \`${prefix}\` as my prefix.`);
    }
});

client.login('your-token-goes-here');
```

::: tip The `escapeRegex` function converts special characters into literal characters by escaping them to not terminate the pattern within the [Regular Expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)! :::

::: tip If you aren't familiar with the syntax used on the `const [, matchedPrefix] = ...` line, that's called "array destructuring". Feel free to read more about it in the [ES6 syntax](https://github.com/zachjmurphy/guide/tree/9925b2dac70a223dd2dbb549ce57ddb5515bcbc0/additional-info/es6-syntax.md#array-destructuring) guide! :::

## Miscellaneous

### How do I send a message to a specific channel?

```javascript
const channel = <client>.channels.cache.get('<id>');
channel.send('<content>');
```

### How do I DM a specific user?

```javascript
const user = <client>.users.cache.get('<id>');
user.send('<content>');
```

::: tip If you want to DM the user who sent the message, you can use `<message>.author.send()`. :::

### How do I mention a specific user in a message?

```javascript
const user = <message>.mentions.users.first();
<message>.channel.send(`Hi, ${user}.`);
<message>.channel.send('Hi, <@user id>.');
```

::: tip Mentions in embeds may resolve correctly in embed description and field values but will never notify the user. Other areas do not support mentions at all. :::

### How do I control which users and/or roles are mentioned in a message?

Controlling which mentions will send a ping is done via the `allowedMentions` option, which replaces `disableMentions`.

This can be set as a default in `ClientOptions`, and controlled per-message sent by your bot.

```diff
- new Discord.Client({ disableMentions: 'everyone' });
+ new Discord.Client({ allowedMentions: { parse: ['users', 'roles'] });
```

Even more control can be achieved by listing specific `users` or `roles` to be mentioned by ID, e.g.:

```javascript
message.channel.send('<@123456789012345678> <@987654321098765432>', {
    allowedMentions: { users: ['123456789012345678'] },
});
```

### How do I prompt the user for additional input?

```javascript
<message>.channel.send('Please enter more input.').then(() => {
    const filter = m => <message>.author.id === m.author.id;

    <message>.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] })
        .then(messages => {
            <message>.channel.send(`You've entered: ${messages.first().content}`);
        })
        .catch(() => {
            <message>.channel.send('You did not enter any input!');
        });
});
```

::: tip If you want to learn more about this syntax or reaction collectors, check out [this dedicated guide page for collectors](https://github.com/zachjmurphy/guide/tree/9925b2dac70a223dd2dbb549ce57ddb5515bcbc0/popular-topics/collectors.md)! :::

### How do I block a user from using my bot?

```javascript
const blockedUsers = [ 'id1', 'id2' ];
<client>.on('message', message => {
    if (blockedUsers.includes(message.author.id)) return;
});
```

::: tip You do not need to have a constant local variable like `blockedUsers` above. If you have a database system that you use to store IDs of blocked users, you can query the database instead: ::: 

```javascript
<client>.on('message', async message => {
    const blockedUsers = await database.query('SELECT user_id FROM blocked_users;');
    if (blockedUsers.includes(message.author.id)) return;
});
```

Note that this is just a showcase of how you could do such a check.

### How do I react to the message my bot sent?

```javascript
<message>.channel.send('My message to react to.').then(sentMessage => {
    sentMessage.react('👍');
    sentMessage.react('<emoji id>');
});
```

::: tip If you want to learn more about reactions, check out [this dedicated guide on reactions](https://github.com/zachjmurphy/guide/tree/9925b2dac70a223dd2dbb549ce57ddb5515bcbc0/popular-topics/reactions.md)! :::

### How do I restart my bot with a command?

```javascript
process.exit();
```

::: tip `process.exit()` will only kill your Node process, but when using [PM2](http://pm2.keymetrics.io/), it will restart the process whenever it gets killed. You can read our guide on PM2 [here](https://github.com/zachjmurphy/guide/tree/9925b2dac70a223dd2dbb549ce57ddb5515bcbc0/improving-dev-environment/pm2.md). :::

### What is the difference between a User and a GuildMember?

A User represents a global Discord user, and a GuildMember represents a Discord user on a specific server. That means only GuildMembers can have permissions, roles, and nicknames, for example, because all of these things are server-bound information that could be different on each server that the user is in.

### How do I find all online members of a guild?

```javascript
// First use guild.members.fetch to make sure all members are cached
<guild>.members.fetch().then(fetchedMembers => {
    const totalOnline = fetchedMembers.filter(member => member.presence.status === 'online');
    // Now you have a collection with all online member objects in the totalOnline variable
    console.log(`There are currently ${totalOnline.size} members online in this guild!`)
});
```

### How do I check which role was added/removed and for which member?

```javascript
// Start by declaring a guildMemberUpdate listener
// This code should be placed outside of any other listener callbacks to prevent listener nesting
<client>.on('guildMemberUpdate', (oldMember, newMember) => {
    // If the role(s) are present on the old member object but no longer on the new one (i.e role(s) were removed)
    const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
    if (removedRoles.size > 0) console.log(`The roles ${removedRoles.map(r => r.name)} were removed from ${oldMember.displayName}.`);
    // If the role(s) are present on the new member object but are not on the old one (i.e role(s) were added)
    const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
    if (addedRoles.size > 0) console.log(`The roles ${addedRoles.map(r => r.name)} were added to ${oldMember.displayName}.`);
});
```

### How do I check the bot's ping?

There are two common measurements for bot pings. The first, **Websocket heartbeat**, is the average interval of a regularly sent signal indicating the healthy operation of the WebSocket connection the library receives events over:

```javascript
<message>.channel.send(`Websocket heartbeat: ${<client>.ws.ping}ms.`);
```

::: tip A specific shards heartbeat can be found on the WebSocketShard instance, accessible at `<client>.ws.shards` &gt; `.ping`. :::

The second, **Roundtrip Latency**, describes the amount of time a full API roundtrip \(from the creation of the command message to the creation of the response message\) takes. You then edit the response to the respective value to avoid needing to send yet another message:

```javascript
<message>.channel.send('Pinging...').then(sent => {
    sent.edit(`Roundtrip latency: ${sent.createdTimestamp - <message>.createdTimestamp}ms`);
});
```

### How do I play music from YouTube?

For this to work, you need to have `ytdl-core` installed.

```bash
npm install --save ytdl-core
```

Additionally, you may need the following:

```bash
npm install --save @discordjs/opus # opus engine (if missing)
sudo apt-get install ffmpeg # ffmpeg debian/ubuntu
npm install ffmpeg-static # ffmpeg windows
```

```javascript
// ...
const ytdl = require('ytdl-core');

<voiceChannel>.join().then(connection => {
    const stream = ytdl('<youtubelink>', { filter: 'audioonly' });
    const dispatcher = connection.play(stream);

    dispatcher.on('finish', () => voiceChannel.leave());
})
```

### Why do some emojis behave weirdly?

If you've tried using [the usual method of retrieving unicode emojis](https://github.com/zachjmurphy/guide/tree/9925b2dac70a223dd2dbb549ce57ddb5515bcbc0/popular-topics/reactions.md#unicode-emojis), you may have noticed that some characters don't provide the expected results. Here's a short snippet that'll help with that issue. You can toss this into a file of its own and use it anywhere you need! Alternatively feel free to simply copy-paste the characters from below:

```javascript
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

```javascript
// index.js
const emojiCharacters = require('./emojiCharacters');

console.log(emojiCharacters.a); // 🇦
console.log(emojiCharacters[10]); // 🔟
console.log(emojiCharacters['!']); // ❗
```

::: tip On Windows, you may be able to use the `Win + .` keyboard shortcut to open up an emoji picker that can be used for quick, easy access to all the Unicode emojis available to you. Some of the emojis listed above may not be represented there, though \(e.g., the 0-9 emojis\). :::

