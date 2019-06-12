---
forceTheme: red
---

# Send

All the `.send***()` methods have been removed in favor of one general `.send()` method.

```diff
- channel.sendMessage('Hey!');
+ channel.send('Hey!');

- channel.sendEmbed(embedVariable);
+ channel.send(embedVariable);
+ channel.send({ embed: embedVariable });
```

`channel.send(embedVariable)` will only work if that variable is an instance of the `MessageEmbed` class; object literals won't give you the expected result unless your embed data is inside an `embed` key.

```diff
- channel.sendCode('js', 'const version = 11;');
+ channel.send('const version = 12;', { code: 'js' });

- channel.sendFile('./file.png');
- channel.sendFiles(['./file-one.png', './file-two.png']);
+ channel.send({
	files: [{
		attachment: 'entire/path/to/file.jpg',
		name: 'file.jpg'
	}]
+ channel.send({
	files: ['https://cdn.discordapp.com/icons/222078108977594368/6e1019b3179d71046e463a75915e7244.png?size=2048']
});
```