# Event handling

Node.js uses an event-driven architecture, making it possible to execute code when a specific event occurs. The discord.js library takes full advantage of this. You can visit <docs-link path="class/Client">the discord.js documentation site</docs-link> to see the full list of `Client` events.

Here's the base code we'll be using:

```js
const Discord = require('discord.js');
const { token } = require('./config.json');

const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	console.log(`${message.author.tag} in #${message.channel.name} sent: ${message.content}`);
});

client.login(token);
```

Currently, the event listeners are in the `index.js` file. The `ready` event emits once when the `Client` becomes ready for use, and the `message` event emits whenever a message is received. Moving the event listener code into individual files is simple, and we'll be taking a similar approach to the [command handler](/command-handling/). 

## Individual event files

Your folder structure should look something like this:

![Folder structure](./images/folder-structure.png)

Create an `events` folder in the same directory. You can now take your existing events code in `index.js` and move them to individual files inside the `events` folders. Create a `ready.js` and a `message.js` file in the `events` folder and place in the code for the respective files:

```js
module.exports = {
	name: 'ready',
	once: true,
	execute() {
		console.log('Ready!');
	},
};
```

```js
module.exports = {
	name: 'message',
	execute(message) {
		console.log(`${message.author.tag} in #${message.channel.name} sent: ${message.content}`);
	},
};
```

The `name` property states which event this file is for, the `once` property is a boolean and specifies if the event should run only once, and the `execute` function is for your event logic. The event handler will call this function whenever the event emits.

Now, you'll write the code for dynamically retrieving all the event files in the `events` folder. Add this below the `const client` line in `index.js`:

```js {3}
const client = new Discord.Client();

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
```

This same method is used in our [command handler](/command-handling/) section. The `fs.readdirSync().filter()` calls return an array of all the file names in the given directory and filter for only `.js` files, i.e. `['ready.js', 'message.js']`.

```js {3-10}
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
```


To listen for events, you have to register an event listener. This is done using the `on` or `once` methods of an `EventEmitter` instance. The `on` method for events can emit multiple times, while `once` will run once and unregister the listener after a single emit.

::: tip
You can learn more about `EventEmitter` [here](https://nodejs.org/api/events.html#events_class_eventemitter).
:::

The `Client` class in discord.js extends the `EventEmitter` class. Therefore, the `client` object also has these `on` and `once` methods that you can use to register events. These methods take two arguments: the name of the event and a callback function.

The callback function passed takes argument(s) returned by its respective event, collects them in an `args` array using the `...` [rest parameter syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters), then calls `event.execute` function while passing in the `args` array using the `...` [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax). They are used here because different events in discord.js have different numbers of arguments. The rest parameter collects these variable number of arguments into a single array, and the spread syntax then takes these elements and passes them to the `execute` function.

After this, listening for other events is as easy as creating a new file in the `events` folder. The event handler will automatically retrieve and register it whenever you restart your bot.

## Passing `Client` to event files

You may have noticed how important the `Client` class is. You created a `client` instance of this class in the `index.js` file. Most of the time, you can use this `client` instance in other files by either obtaining it from one of the other discord.js structures or function parameters. In your `message` event, you can use `message.client`. When you don't have access to any of the structures with the `client` property, you'll have to use the latter method. A prime example of this is the `ready` event.

The `ready` event does not have arguments, meaning that `args` will be an empty array, thus nothing will be passed to the `execute` function in `ready.js`. To obtain the `client` instance, you'll have to pass it as an argument along with the `args` array in the event handler. Back in `index.js`, make the following changes:

```js {4,6}
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}
```

This allows `client` to be available as the **last** argument to the `execute` function in each event file. You can make use of `client` in `ready.js` by logging your bot's tag in the console when it becomes ready:

```js {4-6}
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
```

::: tip
You can omit the `client` argument from the `execute` function in files where you don't need it. For example, it isn't required in the `message.js` file because its first argument is a `Message` instance, meaning you can use `message.client`.
:::

It is worth noting that the position of `client` argument matters. For example, the `messageUpdate` event has two arguments: `oldMessage` and `newMessage`. Events like this should be handled as:

```js {3}
module.exports = {
	name: 'messageUpdate',
	execute(oldMessage, newMessage, client) {
		// ...
	},
};
```

If you were to try `execute(newMessage, client)`, this would mean that `newMessage` is an `oldMessage` object and `client` is a `newMessage` object.

## Resulting code

<resulting-code path="event-handling/file-setup" />
