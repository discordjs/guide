## Using the D.js Raw event

The first thing to understand about the raw event is that it is the event triggered and sent by the discord API itself, it doesn't interact with the d.js library directly. As such it has some benefits, but also some drawbacks which we will explore later.

The complete documentation for the raw event is available [here](https://discordapp.com/developers/docs/topics/gateway#events).

It is important to realize that the raw event will trigger for every single one of these events, therefor to make any sense of it one must first filter it to only show what is desired.

For example, if one wished only to see events emitted for the GUILD_MEMBER_UPDATE event, the first part of the listener would probably look similar to: 

```js
client.on('raw', async event => {
	if (event.t !== 'GUILD_MEMBER_UPDATE') return;

	// ...
});
```

### The good

Since the raw event doesn't depend on the djs cache to trigger, this event will occur on every trigger, whether the object is cached by d.js or not (for example the member, or message cache). 

Using this raw event thus allows you to not have to worry about the d.js cache being incomplete for your code to work.

### The bad

What makes this event great is also what brings it down, the lack of the d.js cache. If we continue with the example of GUILD_MEMBER_UPDATE, using the raw event, we will get ONLY the new guild member object. That is, it is possible to know that _something_ changed, but not what changed. If the guild member object had been in the d.js cache, we would have had access to the oldMember and newMember object.

Now before the question is asked, no it is not possible to cache the oldMember object as the raw event is triggered. Once that event is triggered, the guildMember has already been updated, the old information, if not cached, is gone.

### Why use this event?

In many cases, this event won't be necessary for bot coders. The options to fetch members and messages will often cover all cases needed. There will be however moments when depending on the d.js cache is simply not realistic. A clear example is given in the [reacting to old messages](https://discordjs.guide/#/additional-info/reactions?id=listening-for-reactions-on-old-messages) guide, where one does not want to have the entirety of the channel messages cached simply to track reactions.

Similarly, one could want to track a guildMember update event, even if the details of the update are not available. 

In some cases, the raw event will contain sufficient information to be able to cleanly emit a regular d.js event, in other cases this might not be the case (taking the example of message reaction add versus guild member update).