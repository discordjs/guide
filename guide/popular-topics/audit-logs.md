# Working with Audit Logs

## Some quick background
Audit logs are a great moderation tool offered by discord to know what happened in a server, and usually by whom. There are quite a few cases where audit logs may be used, this guide will limit itself to the most common use cases. For more information on audit logs, feel free to consult the [relevant discord api page](https://discordapp.com/developers/docs/resources/audit-log).

::: warning
It is crucial that you first understand two details about audit logs:
1) They are not guaranteed to arrive when you expect them (if at all).
2) There is no event which triggers when an audit log is created.
:::

Let us start by looking quickly at the `fetchAuditLogs` method and how we want to work with it. Similarly to many djs methods, it returns a promise containing what we really want, the GuildAuditLogs object. In most cases, only the `entries` property will be of interest, as that is where a collection of GuildAuditLogsEntry objects are held, and consequently the information we usually want. You can always take a look at the options [in the djs docs](https://discord.js.org/#/docs/main/stable/class/Guild?scrollTo=fetchAuditLogs).

## Who Deleted a Message?
Let us dive right into it with probably the most common use of audit logs; understanding who deleted any given message in a discord server.

::: warning
At the moment of writing this, discord does not emit an audit log if the person who deleted the message is a bot, or is the author of the message itself.
:::

For now we will look only at the `messageDelete` event. Let us start off with defining a basic trial code for this task.

```js
const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('messageDelete', message => {
	console.log(`A message by ${message.author.tag} was deleted, but we don't know by who yet.`);
});

client.login('your-token-goes-here');
```

So far nothing should seem new or complicated, we get the message deleted event, and log that a message was removed from a channel. We could make use of more information from the message object, but that is left as an exercise for the student.

For our interests we are going to set a fetch limit of 1, and only care about the type `MESSAGE_DELETE`.

Placing this into the previous code, we get the following. Note that we will also make the function async to make use of `await`. As well we will make sure to ignore DMs.

```js
client.on('messageDelete', async message => {
	const fetchedLogs = await message.guild.fetchAuditLogs({
			limit: 1,
			type: 'MESSAGE_DELETE',
	});
	// Since we only have 1 audit log entry in this collection, we can simply grab the first one
	const deletionLog = fetchedLogs.entries.first();

	// Let's perform a sanity check here and make sure we got *something*
	if(!deletionLog) return console.log(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`)

	// We now grab the user object of the person who deleted the message
	const executor = deletionLog.executor;

	// Let us also grab the target of this action to double check things
	const target = deletionLog.target;

	// And now we can update our output with a bit more information
	// We will also run a check to make sure the log we got was for the same author's message
	if(target.id === message.author.id) {
		console.log(`A message by ${message.author.tag} was deleted by ${executor.tag}.`);
	}
	else {
		console.log(`A message by ${message.author.tag} was deleted, but we don't know by who.`);
	}
});
```

With this we now have a very simple logger telling us who deleted a message authored by another person.

## Who Kicked a User?

Similarly to the `messageDelete` case, we will start with a bare-bones bot looking, this time, at the `guildMemberRemove` event.

```js
const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('guildMemberRemove', member => {
	console.log(`${member.user.tag} left the guild... but was it of their own free will?`);
});

client.login('your-token-goes-here');
```

We will again fetchAuditLogs while limiting ourselves to 1 entry, and looking at the `MEMBER_KICK` type.

```js
client.on('guildMemberRemove', async message => {
	const fetchedLogs = await message.guild.fetchAuditLogs({
			limit: 1,
			type: 'MEMBER_KICK',
	});
	// Since we only have 1 audit log entry in this collection, we can simply grab the first one
	const kickLog = fetchedLogs.entries.first();

	// We now grab the user object of the person who kicked our member
	const executor = kickLog.executor;

	// Let us also grab the target of this action to double check things
	const target = kickLog.target;

	// And now we can update our output with a bit more information
	// We will also run a check to make sure the log we got was for the same kicked member
	if(target.id === member.id) {
		console.log(`${member.user.tag} left the guild; kicked by ${executor.tag}?`);
	}
	else {
		console.log(`${member.user.tag} left the guild... perhaps by a ghost.`);
	}
});
```
