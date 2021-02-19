# Event handling

Node.js uses an event-driven architecture. This makes it possible to execute code when a certain event occurs. The discord.js library takes full advantage of this. You can visit the [discord.js documentation site](https://discord.js.org/#/docs/main/stable/class/Client) to see the full list of `Client` events.

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

Currently, the event listeners are placed in the `index.js` file. The `ready` event emits once when the `Client` becomes ready for use and the `message` event emits whenever a message is received. Moving the event listener code into individual files is simple and we'll be taking a similar approach to the [command handler](/command-handling/). 

## Individual event files

Your project structure should look something like this:

![Project structure before events folder](./images/project-structure-before-events-folder.png)

Create an `events` folder in the directory where your `index.js` file is kept. This is how your project structure should look after that:

![Project structure after events folder](./images/project-structure-after-events-folder.png)

Now, you'll take your existing events code in `index.js` and move them to individual files inside the `events` folders. Create a `ready.js` and a `message.js` file in the `events` folder and place in the code for the respective files:

` ``js
module.exports = {
	name: 'ready',
	once: true,
	execute() {
		console.log('Ready!');
	},
};
` ``

` ``js
module.exports = {
	name: 'message',
	execute(message) {
		console.log(`${message.author.tag} in #${message.channel.name} sent: ${message.content}`);
	},
};
` ``

The `name` property states which event this file is for, the `once` property is a boolean and specifies if the the event should run only once, and the `execute` function is for your event logic. The event handler will call this function whenever the event emits.

Now, you'll write the code for dynamically retrieving all the event files in the `events` folder. Add this below the `const client` line in `index.js`:

```diff
const client = new Discord.Client();

+ const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
```

You have already learned about this in the [command handler](/command-handling/) section. The `fs.readdirSync()` method returns an array of all the file names in a given directory. Here, the directory is `events`, therefore if you log `eventFiles` it will print: `[ 'ready.js' ]`. Since you only need JavaScript files, you filtered out all the files that do not end with `.js` extension. Currently, you have a single file in the `events` folder but you'll create more once you have made the necessary changes in `index.js`.

Add the following code after the above line in `index.js`:

```js
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
```

Don't be afraid we'll go through each line one by one to teach you what's happening here.

```js
for (const file of eventFiles) {
	// ...
}
```

In the first line, you have a loop, that iterates over each element of the `eventFiles` array and executes the code inside it for that element. You already know the elements in the `eventFiles` array are just names of the javascript files that are inside the `events` folder.

```js
const event = require(`./events/${file}`);
```

Each event file that you will create will export an object. You'll retrieve that exported object in the `index.js` file and then assign it to the `event` variable.

You'll have to learn `event registeration` and `rest & spread` before you understand what's happening in the last few lines.

In order to listen for events, we have to register them first. In other words, we have to tell nodejs what is the name of the event that we want to listen for and what function should be called, when that event emits. Since this function gets called when an event emits, we say it's a [callback function](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function). This is done by using the `on` or `once` method of an `EventEmitter`. The `on` method is used to register callback function for events that can emit multiple times, while functions registered using `once` method get unregistered after a single event.

::: tip
You can learn more about `EventEmitter` [here](https://nodejs.org/api/events.html#events_class_eventemitter)
:::

The `Client` class in discord.js extends this `EventEmitter` class. Therefore, the `client` object also has these `on` and `once` methods that you can use to register events. These methods take two arguments: name of the event and a callback function. You get the name of the event from `event.name`.

The callback function you passed, takes argument(s) returned by its respective event, collects them in an `args` array using the `...` rest parameter, then passes the elements in the `args` array to the `event.execute` function using the `...` spread syntax and then finally calls it. Even though `rest` and `spread` look the same, their functionality is exactly opposite of each other. You have to use them here because different types of events in discord.js return different number of arguments. The `rest` parameter collects these unknown number of arguments into a single array, the `spread` operator then takes each element from this `args` array and passes it to the `execute` function.

::: tip
Learn more about `rest` and `spread` [here](https://javascript.info/rest-parameters-spread)
:::

Now, lets come back to the event-handler and see what's happening in its last few lines:

```js
if (event.once) {
	client.once(event.name, (...args) => event.execute(...args));
} else {
	client.on(event.name, (...args) => event.execute(...args));
}
```

You can listen for an event either only once or multiple times by registering it using `once` or `on` respectively. In both of the above conditions, you are registering a callback function that will be called when its respective event emits, but for events that have their `once` property set to `true`, you will register them using the `once` method, so that it gets unregistered after a single event.

Before you go any further you should check the event handler is working or not. Open your terminal, type `node index.js` and press enter. If you see `Ready!` gets printed, then congratulations, you've made an event handler. After this, listening for other events is as easy as creating a new event file in the `events` folder. The event handler will automatically retrieve this new event file and register the respective event whenever you restart the bot.

## Message event

You created an event file for the `ready` event above. That module was somewhat short and easy to write, as you were only logging `Ready!` in it. The `ready` event doesn't return any argument and you don't do much when that event emits. This section teaches you how to write an event file for an event that returns at least one argument and how to do lots of stuff in it. You'll also learn how to retrieve things that are not available in the event file but can be required either from other files or accessed through the arguments returned by the event.

Create a new event file in the `events` folder. Since you're creating this file for the `message` event, you should name it `message.js`. After that,  write the following lines of code in it:

```js
module.exports = {
	name: 'message',
	once: false,
	execute(message) {
		if (!message.content.startsWith(prefix) || message.author.bot) return;

		const args = message.content.slice(prefix.length).trim().split(/ +/);

		const commandName = args.shift().toLowerCase();
		const command = client.commands.get(commandName);

		if (!command) return;

		command.execute(message, args);
	},
};
```

You can see the code in the `message.js` event file looks almost similar to what you wrote earlier for the `message` event in `index.js`. All the additional feature you learned earlier have been dropped for the sake of simplicity. You can add those again later. Even though the code looks similar but it won't work until you make some necessary changes.

The first thing that needs attention is the `prefix`. You can see, you're checking for the `prefix` in the first line, but you haven't defined it anywhere in this event file. You can fix this by retrieving it from `config.json`, just like you did in `index.js` file. Add this line above the `module.exports` line:

```diff
+ const { prefix } = require('../config.json');

module.exports = {
	// ...
}
```

::: warning
In `index.js` you used `./` while here you have to use `../` while specifying the path for the `config.json` file. Don't forget to keep this in mind. You can read more about `require` [here](https://nodejs.org/api/modules.html#modules_require_id)
:::

Your next step would be to define the `client` object. In the `index.js` file, you defined it by calling its constructor. What you have to do here is to get hold of that `client` so that you can use it in this file too. Most of the structures in discord.js have the `client` as their property. This makes it possible to get hold of the client through these structures. The `message` object returned by the `message` event is one of those structures. Therefore you can define the `client` by adding the following line after checking for the `prefix`:

```diff
if (!message.content.startsWith(prefix) || message.author.bot) return;
+ const client = message.client;
```

Now run your bot and check whether it's working or not. If you encounter any error, go back and check you haven't made any mistake.

You can add back all the additional features in the `message.js` event file. Just make sure you take care of the things that we talked about above.

## Passing `Client` to event files

You must have noticed how important `Client` class is in discord.js. You created a `client` instance of this class in the `index.js` file. Most of the time you can use this `client` in other files by either obtaining it from one of the `discord.js` structures or from function parameters. You did the former in the above section by using `<Message>.client`. When you don't have access to any of the structures that have `client` as one of their properties, you'll have to use the latter method. The perfect example of this is the `ready.js` event file.

The `ready` event does not return anything, this means that `args` will be an empty array, thus nothing will be passed to the `execute` function in the `ready.js` event file. Now to obtain the `client` you'll have to pass it as an argument along with the `args` array in the event-handler. So, head back to the `index.js` file and make the following changes in it:

```diff
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
-		client.once(event.name, (...args) => event.execute(...args));
+		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
-		client.on(event.name, (...args) => event.execute(...args));
+		client.on(event.name, (...args) => event.execute(...args, client));
	}
}
```

Now, `client` will be available as the last argument to the `execute` function in every event file you'll create. Since, `ready` event doesn't return anything, `client` will be the only argument to the `execute` function of `ready.js` event file. You can make use of `client` in `ready.js` by logging your bot's name in the console when it becomes ready. Head back to `ready.js` and make the following changes to it:

```diff
module.exports = {
	name: 'ready',
    once: true,
+	execute(client) {
-		console.log('Ready!');
+		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
```

You can omit the `client` argument from the `execute` function in an event file if you either obtain it from some other discord.js structure or don't need the `client` in it at all. For example, the `message.js` event file will still work if you don't take `client` as an argument in the `execute` function, but if you want you can make the following changes, and it will work just like earlier: 

```diff
module.exports = {
	name: 'message',
	once: false,
+	execute(message, client) {
		if (!message.content.startsWith(prefix) || message.author.bot) return;
-		const client = message.client;
		// ...
	},
};
```

::: warning
Always, make sure that you take all the valid arguments returned by an event first and then take the `client` as the last argument.
:::

It is worth to note that the position of `client` argument matters. For example `messageUpdate` event returns `oldMessage` and `newMessage` objects. Your event file for this event should look something like this:

```js
// This will work
module.exports = {
	name: 'messageUpdate',
	once: false,
	execute(oldMessage, newMessage, client) {
		// ...
	},
};
```

If you aren't using `client` in an event file, you can omit it from the function arguments, and it will still work without any errors:

```js
// This will work too
module.exports = {
	name: 'messageUpdate',
	once: false,
	execute(oldMessage, newMessage) {
		// ...
	},
};
```

What you cannot do is pass the `client` argument at the wrong position, like this:

```js
// This will create problems :(
module.exports = {
	name: 'messageUpdate',
	once: false,
	execute(newMessage, client) {
		// ...
	},
};
```

## Resulting code

<resulting-code path="event-handling/file-setup" />
