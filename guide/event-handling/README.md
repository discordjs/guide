# Event handling

Nodejs uses an event-driven architecture. This makes it possible to execute a certain piece of code only when a certain event occurs. The `discord.js` library takes full advantage of this architecture. You have already used two of these events i.e. `ready` and `message`. The `ready` event emits when the `Client` becomes ready for use and the `message` event emits when someone sends a message. You can visit the [documentation](https://discord.js.org/#/docs/main/stable/class/Client) site for `discord.js` to see the full list of all the client events.

So far you have been listening to these events in your main `index.js` file. This is fine for small bots that do only a few things, but if you want your bot to do a lot of things, you'll have to listen for more than just the above two events. If you went to the documentation site, you would have seen that there are a lot of events that the bot can listen for. Writing code for these events in the `index.js` file will make this file bigger and messy. This is bad for project maintenance. Therefore, you'll have to take your code for each event from `index.js` and keep them in their own separate file inside an `events` folder. This is somewhat similar to what you did with commands while making the Command Handler.

## Individual event files

If you have followed along so far, your entire project structure should look something like this:

![Project structure before events folder](~@/images/project-structure-before-events-folder.png)

Create a new `events` folder in the directory where your `index.js` file is kept. This is how your project structure should look like after that:

![Project structure after events folder](~@/images/project-structure-after-events-folder.png)

Now, you'll move the existing code you have written for the events in `index.js` to their individual files inside `events` folders.

::: danger
Always name your event file after the name of the event. For example, if you want to create a file for `guildMemberAdd` event, then it should be named `guildMemberAdd.js`
:::

The first event file you'll create will be for the `ready` event. Create a new file in the `events` folder and name it `ready.js`. After doing that, this is what you would write inside it:

```js
module.exports = () => {
	console.log('Ready!');
};
```

We are doing the same thing we did earlier for command files. However, instead of exporting an object, we are exporting an arrow function here. This function will execute when the `ready` event will emit. But for that to happen, you will have to make some changes in the `index.js` file.

::: tip
You can read more about arrow functions [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
:::

Since code for each event will be in its respective event file, you don't need the code for `ready` and `message` events in the `index.js` file. Head back to the `index.js` and remove the following code from there:

```diff
const cooldowns = new Discord.Collection();

- client.once('ready', () => {
-	console.log('Ready!');
- });

- client.on('message', message => {
-	// ...
- });

client.login(token);
```

After removing the above code, you'll dynamically retrieve all the event files. Add this below your `const cooldowns` line:

```diff
const cooldowns = new Discord.Collection();

+ const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
```

You have already learned about this in the Command Handling section. The `fs.readdirSync()` method will return an array of all the file names in that directory. Here, the directory is `events` therefore if you do `console.log(eventFiles)` at this point, it will print: `[ 'ready.js' ]`. Since we are only looking for JavaScript files, we filtered out all the files that don't end with `.js` extension. Right now you have a single file in the `events` folder but you'll create more once you have made the necessary changes in `index.js`.

Add the following code after the above line in `index.js`:

```js
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	const eventName = file.slice(0, -3);
	client.on(eventName, (...args) => event(...args));
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

Each event file that you will create will have an arrow function that it exports.  You'll retrieve that exported arrow function in the `index.js` file and then assign it to the `event` variable.

```js
const eventName = file.slice(0, -3);
```

In this line, you're storing the name of the current file without the extension part in `eventName` variable. Remember, when we told you to make sure your event file's name should match with the name of its event. Now you know the reason for it. The `file` variable here is one of the filenames from the `eventFiles` array. Since it's a string, we can use the slice method on it that starts from the first character and ends just before the third character from the end. Doing this returns a new string which doesn't have the last three character i.e. `.js` in it.

::: tip
You can learn more about the `slice` method [here](https://javascript.info/string#getting-a-substring)
:::

There are two things that you'll have to learn in order to understand what's happening in the last line:

```js
client.on(eventName, (...args) => event(...args));
```

Those two things are `event registeration` and `rest & spread`.

In order to listen for events, we have to register them first. In other words, we have to tell nodejs what is the name of the event that we want to listen for and what function should be called, when that event emits. This is done by using the `on` method of an `EventEmitter`.

::: tip
You can learn more about `EventEmitter` [here](https://nodejs.org/api/events.html#events_class_eventemitter)
:::

The `Client` class in `discord.js` extends this `EventEmitter` class. Therefore, the `client` object also have this `on` method that you can use to register events. The `on` method takes two arguments: name of the event and a callback function. You already have the name of the event in the `eventName` variable. So that is what you'll pass as the first argument to the `on` method. The second argument should be a function. That's why you'll pass an arrow function to it. Since this function gets called when an event emits, we say it's a [callback function](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function).

The callback function you've passed to the `on` method takes argument(s) returned by the events you've registered, collects them in an `args` array using the `...` rest parameter, passes the individual elements in the `args` array to the `event` function using the `...` spread syntax and then calls it. This must be a bit confusing to you, as both the `rest` and `spread` look same, while their functionality is exactly opposite of each other. For now, just understand that you have to use these two because different types of events in `discord.js` return different number of arguments. So, you collect these arguments returned by the events without caring about their numbers in the `args` array using`rest` parameter and pass it on to the arrow function of the respective event file using the `spread` syntax. The arrow functions in the event files will always get the correct number of arguments due to this.

::: tip
Learn more about `rest` parameter and `spread` syntax [here](https://javascript.info/rest-parameters-spread)
:::

Before you go any further you should check the event handler is working or not. Open your terminal, type `node index.js` and press enter. If you see `Ready!` gets printed, then congratulations, you've made an event handler. After this listening for other events is as easy as creating a new event file in the `events` folder. The event handler will automatically retrieve this new event file and register the respective event whenever you restart the bot.

## Message event

You created an event file for the `ready` event above. That module was somewhat short and easy to write, as you were only logging `Ready!` in it. The `ready` event doesn't return any argument and you don't do much when that event emits. This section teaches you how to write an event file for an event that returns at least one argument and how to do lots of stuff in it. You'll also learn how to retrieve things that are not available in the event file but can be required either from other files or accessed through the arguments returned by the event.

Create a new event file in the `events` folder. Since you're creating this file for the `message` event, you should name it `message.js`. After that,  write the following lines of code in it:

```js
module.exports = message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);

	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName);

	if (!command) return;

	command.execute(message, args);
};
```

You can see the code in the `message.js` event file looks almost similar to what you wrote earlier for the `message` event in `index.js`. All the additional feature you learned earlier have been dropped for the sake of simplicity. You can add those again later. Even though the code looks similar but it won't work until you make some necessary changes.

The first thing that needs attention is the `prefix`. You can see, you're checking for the `prefix` in the first line, but you haven't defined it anywhere in this event file. You can fix this by retrieving it from `config.json`, just like you did in `index.js` file. Add this line above the `module.exports` line:

```diff
+ const { prefix } = require('../config.json');

module.exports = message => {...
```

::: warning
In `index.js` you used `./` while here you have to use `../` while specifying the path for the `config.json` file. Don't forget to keep this in mind. You can read more about `require` [here](https://nodejs.org/api/modules.html#modules_require_id)
:::

Your next step would be to define the `client` object. In the `index.js` file, you defined it by calling its constructor. What you have to do here is to get hold of that `client` so that you can use it in this file too. Most of the structures in `discord.js` have the `client` as their property. This makes it possible to get hold of the client through these structures. The `message` object returned by the `message` event is one of those structures. Therefore you can define the `client` by adding the following line after checking for the `prefix`:

```diff
if (!message.content.startsWith(prefix) || message.author.bot) return;
+ const client = message.client;
```

Now run your bot and check whether it's working or not. If you encounter any error, go back and check you haven't made any mistake.

You can add back all the additional features in the `message.js` event file. Just make sure you take care of the things that we talked about above.

## Passing client to event files

You must have noticed how important `Client` class is in `discord.js`. You created a `client` instance of this class in the `index.js` file. Most of the time you can use this `client` in other files by either obtaining it from one of the `discord.js` structures or from function parameters. You did the former in the above section by using `<Message>.client`. When you don't have access to any of the structures that have `client` as one of their property, you'll have to use the latter method. The perfect example of this is the `ready.js` event file.

The `ready` event does not return anything, this means that `args` will be an empty array, thus nothing will be passed to the arrow function in the `ready.js` event file. Now to obtain the `client` you'll have to pass it as an argument along with the `args` array in the event-handler. So, head back to the `index.js` file and make the following changes in it:

```diff
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    const eventName = file.slice(0, -3);
-	client.on(eventName, (...args) => event(...args));
+   client.on(eventName, (...args) => event(...args, client));
}
```

Now, `client` will be available as the last argument to the arrow function in every event file you'll create. Since, `ready` event doesn't return anything, `client` will be the only argument to the arrow function of `ready.js` event file. You can make use of `client` in `ready.js` by logging your bot's name in the console when it becomes ready. Head back to `ready.js` and make the following changes to it:

```diff
+ module.exports = (client) => {
-	console.log('Ready!');
+	console.log(`Logged in as ${client.user.tag}`);
}
```

You can omit the `client` argument from the arrow function definition in an event file if you either obtain it from some other `discord.js` structure or don't need the `client` in it at all. For example, the `message.js` event file will still work if you don't take `client` as an argument in the arrow function, but if you want you can make the following changes, and it will work just like earlier: 

```diff
+ module.exports = (message, client) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
-	const client = message.client;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	// ...
}
```

::: warning
Always, make sure that you take all the valid arguments returned by an event first and then take the `client` as the last argument.
:::

It is worth to note that the position of `client` argument matters. For example `messageUpdate` event returns `oldMessage` and `newMessage` objects. Your event file for this event should look something like this:

```js
// This will work
module.exports = (oldMessage, newMessage, client) => {
	// ...
};
```

If you aren't using `client` in an event file, you can omit it from the function arguments, and it will still work without any errors:

```js
// This will work too
module.exports = (oldMessage, newMessage) => {
	// ...
};
```

What you cannot do is pass the `client` argument at the wrong position, like this:

```js
// This will create problems :(
module.exports = (newMessage, client) => {
	// ...
};
```