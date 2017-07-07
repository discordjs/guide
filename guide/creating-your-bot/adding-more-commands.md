## Adding more commands

A bot with nothing but a single command would be really boring, and you probably have a bunch of command ideas floating around in your head already, right? Let's begin, then.

Currently, here's what your message event should look like:

```js
client.on('message', (message) => {
	if (message.content === '!ping') {
		message.channel.send('Pong.');
	}
});
```

Before anything, you should set up a prefix to reflect the one in your config.json file. You'll need to do something like the following:

```js
const prefix = config.prefix;

client.on('message', (message) => {
	if (message.content === prefix + 'ping') {
		message.channel.send('Pong.');
	}
});
```

// TODO (Sanc's section, will finish later)