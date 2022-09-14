# Event handling

Node.js uses an event-driven architecture, making it possible to execute code when a specific event occurs. The discord.js library takes full advantage of this. You can visit the <DocsLink path="class/Client" /> documentation to see the full list of events.

Here's the base code we'll be using:

```js
const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('interactionCreate', interaction => {
	console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
});

client.login(token);
```

Currently, the event listeners are in the `index.js` file. <DocsLink path="class/Client?scrollTo=e-ready" /> emits once when the `Client` becomes ready for use, and <DocsLink path="class/Client?scrollTo=e-interactionCreate" /> emits whenever an interaction is received. Moving the event listener code into individual files is simple, and we'll be taking a similar approach to the [command handler](/creating-your-bot/command-handling.md).

## Individual event files

Your project directory should look something like this:

```:no-line-numbers
discord-bot/
├── commands
├── node_modules
├── config.json
├── deploy-commands.js
├── index.js
├── package-lock.json
└── package.json
```

Create an `events` folder in the same directory. You can then take your existing events code in `index.js` and move them to `events/ready.js` and `events/interactionCreate.js` files.

:::: code-group
::: code-group-item events/ready.js
```js
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
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

The `name` property states which event this file is for, and the `once` property is a boolean that specifies if the event should run only once. The `execute` function is for your event logic, which will be called by the event handler whenever the event emits.

## Reading event files

Next, let's write the code for dynamically retrieving all the event files in the `events` folder. We'll be taking a similar approach to our [command handler](/creating-your-bot/command-handling.md).

`fs.readdirSync().filter()` returns an array of all the file names in the given directory and filters for only `.js` files, i.e. `['ready.js', 'interactionCreate.js']`.

```js {3,5-12}
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
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

::: tip
In most cases, you can access your `client` instance in other files by obtaining it from one of the other discord.js structures, e.g. `interaction.client` in the `interactionCreate` event.
:::

## Resulting code

<ResultingCode />
