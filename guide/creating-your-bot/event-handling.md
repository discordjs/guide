# Event handling

Node.js uses an event-driven architecture, making it possible to execute code when a specific event occurs. The discord.js library takes full advantage of this. You can visit the <DocsLink path="class/Client" /> documentation to see the full list of events.

Here's the base code we'll be using:

```js
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', interaction => {
	console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
});

client.login(token);
```

Currently, the event listeners are in the `index.js` file. The `ready` event emits once when the `Client` becomes ready for use, and the `interactionCreate` event emits whenever an interaction is received. Moving the event listener code into individual files is simple, and we'll be taking a similar approach to the [command handler](/creating-your-bot/command-handling.md). 

## Individual event files

Your folder structure should look something like this:

```:no-line-numbers
discord-bot/
├── node_modules
├── config.json
├── index.js
├── package-lock.json
└── package.json
```

Create an `events` folder in the same directory. You can now take your existing events code in `index.js` and move them to individual files inside the `events` folders. Create a `ready.js` and an `interactionCreate.js` file in the `events` folder and place in the code for the respective files:

:::: code-group
::: code-group-item events/ready.js
```js
module.exports = {
	name: 'ready',
	once: true,
	execute() {
		console.log('Ready!');
	},
};
```
:::
::: code-group-item events/interactionCreate.js
```js
module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
	},
};
```
:::
::::

The `name` property states which event this file is for, the `once` property is a boolean and specifies if the event should run only once, and the `execute` function is for your event logic. The event handler will call this function whenever the event emits.

## Reading event files

Next, let's write the code for dynamically retrieving all the event files in the `events` folder. We'll be taking a similar approach to our [command handler](/creating-your-bot/command-handling.md).

`fs.readdirSync().filter()` returns an array of all the file names in the given directory and filters for only `.js` files, i.e. `['ready.js', 'interactionCreate.js']`.

```js {3,5-12}
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

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

The <DocsLink path="class/Client" /> class in discord.js extends the [`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter) class. Therefore, the `client` object exposes the [`.on()`](https://nodejs.org/api/events.html#events_emitter_on_eventname_listener) and [`.once()`](https://nodejs.org/api/events.html#events_emitter_once_eventname_listener) methods that you can use to register event listeners. These methods take two arguments: the event name and a callback function.

The callback function passed takes argument(s) returned by its respective event, collects them in an `args` array using the `...` [rest parameter syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters), then calls `event.execute()` while passing in the `args` array using the `...` [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax). They are used here because different events in discord.js have different numbers of arguments. The rest parameter collects these variable number of arguments into a single array, and the spread syntax then takes these elements and passes them to the `execute` function.

After this, listening for other events is as easy as creating a new file in the `events` folder. The event handler will automatically retrieve and register it whenever you restart your bot.

## Passing `Client` to event files

You may have noticed how important the <DocsLink path="class/Client" /> class is. You created a `client` instance of this class in the `index.js` file. Most of the time, you can use this `client` instance in other files by obtaining it from one of the other discord.js structures. In the `interactionCreate` event, you can use `interaction.client`.

However, not all events will expose a structure with the `.client` property attached. A prime example of this is the `ready` event.

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

This allows `client` to be available as the **last** argument of the `execute` function in each event file. You can make use of `client` in `ready.js` by logging your bot's tag:

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
You can omit the `client` argument from the `execute` function in files where you don't need it. For example, it isn't required in the `interactionCreate.js` file because its first argument is an <DocsLink path="class/Interaction" /> instance, meaning you can use `interaction.client`.
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

<ResultingCode path="creating-your-bot/event-handling" />
