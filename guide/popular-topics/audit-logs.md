# Working with Audit Logs

## A Quick Background

Audit logs are an excellent moderation tool offered by Discord to know what happened in a server and usually by whom. Audit logs may be fetched on a server, or they may be received via the gateway event `guildAuditLogEntryCreate`.

There are quite a few cases where you may use audit logs. This guide will limit itself to the most common use cases. Feel free to consult the [relevant Discord API page](https://discord.com/developers/docs/resources/audit-log) for more information.

Keep in mind that these examples explore a straightforward case and are no means foolproof. Their purpose is to teach how audit logs work, and expansion of these examples is likely needed to suit your needs.

## Fetching Audit Logs

Let's start by glancing at the <DocsLink path="class/Guild?scrollTo=fetchAuditLogs" type="method" /> method and how to work with it. Like many discord.js methods, it returns a `Promise` containing the <DocsLink path="class/GuildAuditLogs" /> object. In this object is a sole `entries` property which holds a collection of <DocsLink path="class/GuildAuditLogsEntry" /> objects, and consequently, the information you usually want.

Here is the most basic fetch to look at some entries.

```js
const fetchedLogs = await guild.fetchAuditLogs();
const firstEntry = fetchedLogs.entries.first();
```

Simple, right? Now, let's look at utilizing it's options:

```js
const { AuditLogEvent } = require('discord.js');

const fetchedLogs = await guild.fetchAuditLogs({
	type: AuditLogEvent.InviteCreate,
	limit: 1,
});

const firstEntry = fetchedLogs.entries.first();
```

This will return the first entry where an invite was created. We used `limit: 1` here to specify only one entry.

## Receiving Audit Logs

Audit logs may be received via the gateway event `guildAuditLogEntryCreate`. This is the best way to receive audit logs if you are monitoring them. As soon as a message is deleted, or an invite is created, or an emoji is created, you can listen to this event to check information about said occurrence. A common functionality is to find out _who_ did something that generated an audit log event.

### Who deleted a message?

One of the most common use cases for audit logs would be understanding who deleted any given message in a Discord server. If another user deleted another user's message, you can find out who did that as soon as you receive the event.

```js
const { AuditLogEvent, Events } = require('discord.js');

client.on(Events.GuildAuditLogEntryCreate, async auditLog => {
	// Define our variables.
	const { action, executor, target } = auditLog;

	// Check only for deleted messages.
	if (action !== AuditLogEvent.MessageDelete) return;

	// Our executor is a user object and our target is a message object.
	// Now we can log the output!
	console.log(`A message by ${target.author.tag} was deleted by ${executor.tag}.`);
});
```

With this, you now have a very simple logger telling you who deleted a message authored by another person.

### Who kicked a user?

This is very similar to the example above.

```js
const { AuditLogEvent, Events } = require('discord.js');

client.on(Events.GuildAuditLogEntryCreate, async auditLog => {
	// Define our variables.
	const { action, executor, target } = auditLog;

	// Check only for kicked users.
	if (action !== AuditLogEvent.MemberKick) return;

	// Our executor is a user object and our target is a user object.
	// Now we can log the output!
	console.log(`${target.author.tag} was kicked by ${executor.tag}.`);
});
```

If you want to check who banned a user, it's actually the same example as above except you should check for the `AuditLogEvent.MemberBanAdd` `action`.
