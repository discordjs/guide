# Threads

Threads can be thought of as temporary sub-channels inside an existing channel, to help better organize conversation in a busy channel.

## Thread related gateway events

::: tip
You can use the `isThread()` typeguard to make sure the channel you're working with is a ThreadChannel!
:::

Threads introduce a number of new gateway events, which are listed below:

- `Client#threadCreate`: Emitted whenever a thread is created or when the client user is added to a thread.
- `Client#threadDelete`: Emitted whenever a thread is deleted.
- `Client#threadUpdate`: Emitted whenever a thread is updated - e.g. name change, archive state change, locked state change.
- `Client#threadListSync`: Emitted whenever the client user gains access to a text or news channel that contains threads.
- `Client#threadMembersUpdate`: Emitted whenever members are added or removed from a thread. Requires `GUILD_MEMBERS` privileged intent.
- `Client#threadMemberUpdate`: Emitted whenever the client user's thread member is updated.

## Creating and deleting threads

Threads are created and deleted using the `ThreadManager` of a text or news channel.
To create a thread you call the `ThreadManager#create()` method:

```js {2-8}
client.on('messageCreate', async message => {
	const thread = await message.channel.threads
		.create({
			name: 'food-talk',
			autoArchiveDuration: 60,
			reason: 'Needed a separate thread for food',
		});
	console.log(`Created thread: ${thread.name}`);
});
```

To delete a thread you call the `ThreadChannel#delete()` method:

```js {2,3}
client.on('messageCreate', async message => {
	const thread = message.channel.threads.cache.find(x => x.name === 'food-talk');
	await thread.delete();
});
```

## Joining and leaving threads

To join your Client to a ThreadChannel you make use of the `ThreadChannel#join()` method:

```js {3}
client.on('messageCreate', async message => {
	const thread = message.channel.threads.cache.find(x => x.name === 'food-talk');
	if (thread.joinable) await thread.join();
});
```

And to leave one you call `ThreadChannel#leave()`;

```js {3}
client.on('messageCreate', async message => {
	const thread = message.channel.threads.cache.find(x => x.name === 'food-talk');
	await thread.leave();
});
```

## Archiving, unarchiving and locking threads

Every thread can be either active or archived. Changing a thread from archived to active is referred to as unarchiving the thread. Threads that have `locked` set to true can only be unarchived by a member with the `MANAGE_THREADS` permission.

Threads automatically archive after inactivity. 'Activity' is defined as sending a message, unarchiving a thread, or changing the auto-archive time.

To archive a thread you use the `ThreadChannel#setArchived()` method and pass `true` as parameter:

```js {3}
client.on('messageCreate', async message => {
	const thread = message.channel.threads.cache.find(x => x.name === 'food-talk');
	await thread.setArchived(true);
});
```

And to unarchive it one you pass `false ` to one and the same method:

```js {3}
client.on('messageCreate', async message => {
	const thread = message.channel.threads.cache.find(x => x.name === 'food-talk');
	await thread.setArchived(false);
});
```

This same principle applies to locking and unlocking a thread via the `ThreadChannel#setLocked()` method:

Locking a thread:

```js {3}
client.on('messageCreate', async message => {
	const thread = message.channel.threads.cache.find(x => x.name === 'food-talk');
	await thread.setLocked(true);
});
```

::: warning
Archived threads can't be locked!
:::

Unlocking a thread:

```js {3}
client.on('messageCreate', async message => {
	const thread = message.channel.threads.cache.find(x => x.name === 'food-talk');
	await thread.setLocked(false);
});
```

## Public and private threads

Public threads are viewable by everyone who can view the parent channel of the thread. Public threads must be created from an existing message, but can be 'orphaned' if that message is deleted. The created thread and the message it was started from will share the same id. The type of thread created matches the type of the parent channel.

Private threads behave similar to Group DMs, but in a Guild. Private threads can only be created on text channels.

To create a private thread you use `ThreadManager#create()` as above, but pass `private_thread` as `type`, like so:

```js {6}
client.on('messageCreate', async message => {
	const thread = await message.channel.threads
		.create({
			name: 'mod-talk',
			autoArchiveDuration: 60,
			type: 'private_thread',
			reason: 'Needed a separate thread for moderation',
		});
	console.log(`Created thread: ${thread.name}`);
});
```

## Adding and removing members

You can add and remove members to and from a thread channel.

To add a member to a thread you can use the `ThreadMemberManager#add()` method like shown below:

```js {3}
client.on('messageCreate', async message => {
	const thread = message.channel.threads.cache.find(x => x.name === 'food-talk');
	await thread.members.add('140214425276776449');
});
```

And to remove a member from a thread, you repeat this procedure using `ThreadMemberManager#remove()`:

```js {3}
client.on('messageCreate', async message => {
	const thread = message.channel.threads.cache.find(x => x.name === 'food-talk');
	await thread.members.remove('140214425276776449');
});
```

And that's it! Now you know all there is to know on working with threads using discord.js!