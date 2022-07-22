# Working with Audit Logs

## Some quick background
Audit logs are an excellent moderation tool offered by Discord to know what happened in a server and usually by whom. At the moment, these are the only method to help you determine who the executor of a mod action was on the server. Relevant events such as `messageDelete` and `guildMemberRemove` unfortunately do not provide info on the moderation actions having triggered them, making the fetch for audit logs a necessity.

There are quite a few cases where you may use audit logs. This guide will limit itself to the most common use cases. Feel free to consult the [relevant Discord API page](https://discord.com/developers/docs/resources/audit-log) for more information.

::: warning
It is crucial that you first understand two details about audit logs:
1) They are not guaranteed to arrive when you expect them (if at all).
2) There is no event which triggers when an audit log is created.
:::

Let's start by glancing at the <DocsLink path="class/Guild?scrollTo=fetchAuditLogs" type="method" /> method and how to work with it. Like many discord.js methods, it returns a Promise containing the <DocsLink path="class/GuildAuditLogs" /> object. In most cases, only the `entries` property will be of interest, as it holds a collection of <DocsLink path="class/GuildAuditLogsEntry" /> objects, and consequently, the information you usually want. You can always take a look at the options 

The following examples will explore a straightforward case for some auditLog types. Some basic error handling is performed, but these code segments are by no means foolproof and are meant to teach you how fetching audit logs work. You will most likely need to expand on the examples based on your own goals for a rigorous system.

## Who deleted a message?
One of the most common use cases for audit logs would be understanding who deleted any given message in a Discord server.

::: warning
At the time of writing, Discord does not emit an audit log if the person who deleted the message is a bot deleting a single message or is the author of the message itself.
:::

For now, we'll focus on the `messageDelete` event.

```js
client.on('messageDelete', message => {
	console.log(`A message by ${message.author.tag} was deleted, but we don't know by who yet.`);
});
```

So far, nothing should seem new or complicated. You get the message deleted event and log that a message was removed from a channel. More information from the message object can be extracted, but that is left as an exercise for the reader.

For simplicity, set a fetch limit of 1 and accept only the `MessageDelete` type.

Placing this into the previous code, you get the following. Note that this also makes the function async to make use of `await`. In addition, make sure to ignore DMs.

```js {2-9,11-12,14-16,18-25}
const { AuditLogEvent } = require('discord.js');

client.on('messageDelete', async message => {
	// Ignore direct messages
	if (!message.guild) return;
	const fetchedLogs = await message.guild.fetchAuditLogs({
		limit: 1,
		type: AuditLogEvent.MessageDelete,
	});
	// Since there's only 1 audit log entry in this collection, grab the first one
	const deletionLog = fetchedLogs.entries.first();

	// Perform a coherence check to make sure that there's *something*
	if (!deletionLog) return console.log(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`);

	// Now grab the user object of the person who deleted the message
	// Also grab the target of this action to double-check things
	const { executor, target } = deletionLog;

	// Update the output with a bit more information
	// Also run a check to make sure that the log returned was for the same author's message
	if (target.id === message.author.id) {
		console.log(`A message by ${message.author.tag} was deleted by ${executor.tag}.`);
	} else {
		console.log(`A message by ${message.author.tag} was deleted, but we don't know by who.`);
	}
});
```

With this, you now have a very simple logger telling you who deleted a message authored by another person.

## Who kicked a user?

Similar to the `messageDelete` case, let's look at the `guildMemberRemove` event.

```js
client.on('guildMemberRemove', member => {
	console.log(`${member.user.tag} left the guild... but was it of their own free will?`);
});
```

The same as before: set the fetch limit to 1 and accept only the `MemberKick` type.

```js {2-7,9-10,12-14,16-22}
client.on('guildMemberRemove', async member => {
	const fetchedLogs = await member.guild.fetchAuditLogs({
		limit: 1,
		type: AuditLogEvent.MemberKick,
	});
	// Since there's only 1 audit log entry in this collection, grab the first one
	const kickLog = fetchedLogs.entries.first();

	// Perform a coherence check to make sure that there's *something*
	if (!kickLog) return console.log(`${member.user.tag} left the guild, most likely of their own will.`);

	// Now grab the user object of the person who kicked the member
	// Also grab the target of this action to double-check things
	const { executor, target } = kickLog;

	// Update the output with a bit more information
	// Also run a check to make sure that the log returned was for the same kicked member
	if (target.id === member.id) {
		console.log(`${member.user.tag} left the guild; kicked by ${executor.tag}?`);
	} else {
		console.log(`${member.user.tag} left the guild, audit log fetch was inconclusive.`);
	}
});
```

## Who banned a user?

The logic for this will be very similar to the above kick example, except that this time, the `guildBanAdd` event will be used.

```js
client.on('guildBanAdd', async ban => {
	console.log(`${ban.user.tag} got hit with the swift hammer of justice in the guild ${ban.guild.name}.`);
});
```

As was the case in the previous examples, you can see what happened, to whom it happened, but not who executed the action. Enter once again audit logs fetching limited to 1 entry and only the `MemberBanAdd` type. The `guildBanAdd` listener then becomes:

```js {2-7,9-10,12-14,16-22}
client.on('guildBanAdd', async ban => {
	const fetchedLogs = await ban.guild.fetchAuditLogs({
		limit: 1,
		type: AuditLogEvent.MemberBanAdd,
	});
	// Since there's only 1 audit log entry in this collection, grab the first one
	const banLog = fetchedLogs.entries.first();

	// Perform a coherence check to make sure that there's *something*
	if (!banLog) return console.log(`${ban.user.tag} was banned from ${ban.guild.name} but no audit log could be found.`);

	// Now grab the user object of the person who banned the member
	// Also grab the target of this action to double-check things
	const { executor, target } = banLog;

	// Update the output with a bit more information
	// Also run a check to make sure that the log returned was for the same banned member
	if (target.id === ban.user.id) {
		console.log(`${ban.user.tag} got hit with the swift hammer of justice in the guild ${ban.guild.name}, wielded by the mighty ${executor.tag}`);
	} else {
		console.log(`${ban.user.tag} got hit with the swift hammer of justice in the guild ${ban.guild.name}, audit log fetch was inconclusive.`);
	}
});
```
