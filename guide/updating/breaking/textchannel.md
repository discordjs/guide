---
forceTheme: red
---

# TextChannel

## TextChannel#acknowledge

Has been removed entirely, along with all other user account-only methods and properties.

## TextChannel#\*\*\*position

See the [GuildChannel](/additional-info/changes-in-v12.md#guildchannel) section for changes to positions.

## TextChannel#clone

All parameters have been removed and reconfigured into a single object.

```diff
- channel.clone(undefined, true, false, 'Needed a clone');
+ channel.clone({ name: undefined, reason: 'Needed a clone' });
```

## TextChannel#createCollector

`textChannel.createCollector()` has been removed entirely in favor of `textChannel.createMessageCollector()`.

See [this section](/additional-info/changes-in-v12.md#messagecollector) for changes to the `MessageCollector` class.

```diff
- channel.createCollector(filterFunction, { maxMatches: 2, max: 10, time: 15000 });
+ channel.createMessageCollector(filterFunction, { max: 2, maxProcessed: 10, time: 15000 });
```

## TextChannel#memberPermissions

This method is now private.

## TextChannel#rolePermissions

This method is now private.

## TextChannel#search

This method has been removed, along with all other user account-only methods.

## TextChannel#send\*\*\*

All the `.send***()` methods have been removed in favor of one general `.send()` method.

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

```diff
- channel.sendFile('./file.png');
- channel.sendFiles(['./file-one.png', './file-two.png']);
+ channel.send({
	files: [{
		attachment: 'entire/path/to/file.jpg',
		name: 'file.jpg',
	}]
+ channel.send({
	files: ['https://cdn.discordapp.com/icons/222078108977594368/6e1019b3179d71046e463a75915e7244.png?size=2048']
});
```

```diff
- channel.sendFiles(['./file-one.png', './file-two.png']);
+ channel.send({ files: [{ attachment: './file-one.png' }, { attachment: './file-two.png' }] });
+ channel.send({ files: [new MessageAttachment('./file-one.png'), new MessageAttachment('./file-two.png')] });
```

## TextChannel#fetch(Pinned)Message(s)

`channel.fetchMessage()`, `channel.fetchMessages()`, and `channel.fetchPinnedMessages()` were all removed and transformed in the shape of DataStores.

```diff
- channel.fetchMessage('123456789012345678');
+ channel.messages.fetch('123456789012345678');
```

```diff
- channel.fetchMessages({ limit: 100 });
+ channel.messages.fetch({ limit: 100 });
```

```diff
- channel.fetchPinnedMessages();
+ channel.messages.fetchPinned();
```