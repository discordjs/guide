## File and folder restructuring

As mentioned in a previous chapter, unless your bot project is a small one, it's not a very good idea to have a single file with a giant if/else if chain for commands. If you want to implement features into your bot and make your development process a lot less painful, you'll definitely want to use (or in our case, create) a command handler. Let's get started on that!

### Individual command files

Before anything, you may want to create a backup of your current bot file. If you followed along so far, your entire foler structure should look something like this:

![Current folder structure](https://i.imgur.com/BmS09fY.png)

In the same folder, create a new folder and name it `commands`. This is where you'll store all of your commands, of course. Open up your main file, go to your ping command, and copy the entire command's code. Head over to your `commands` folder, create a new file named `ping.js`, and copy & paste in the following code:

```js
module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute: (message, args) => {
		message.channel.send('Pong.');
	},
};
```

You can go ahead and do the same for the rest of your commands as well. If you've been using the same code as the guide thus far, you can copy and paste your commands into their own files now just fine without any issue, as long as you follow the format above. The `description` property is optional, but will be useful for the dynamic help command we'll be covering later.

<p class="tip">If you've set up ESLint for your editor and start receiving errors like `'args' is defined but never used` in your command files, there are a couple ways to go about this:<br />1. Apply the `// eslint-disable-line no-unused-vars` rule-disabling comment on the same line as `execute(message, args) {`.<br />2. If you know for a fact that you won't be using the `args` variable in that command at all (i.e. in your ping command), you can remove it entirely so that you only have a `message` variable in the parameter.</p>

#### module.exports vs regular exports

In the codeblock a bit above this paragraph, you'll notice the `module.exports` syntax that is an object and has 2 keys - the `name` and `execute` keys. In regards to the `execute` key, the codeblock we have above is the same as using `exports.execute = (message, args) => { ... }`. For example:

```js
// this...
module.exports = {
	title: 'Some title here',
	active: true,
	getAmount: () => {
		// create an `amount` variable, some logic here, etc.
		return amount;
	},
};

// ... is essentially the same as this
exports.title = 'Some title here';
exports.active = true;
exports.getAmount = () => {
	// create an `amount` variable, some logic here, etc.
	return amount;
};
```

If you prefer that syntax, feel free to use it! More keys will be added later, so we'll be sticking to the `module.exports` syntax, as it's a bit easier to understand what's going on.

On that note, if you continue to use the `module.exports` syntax, you can benefit from more ES6 syntax. Here's what I mean:

```js
// regular functions, ES5
module.exports = {
	someFunc: function() {
		// ...
	},
};

// arrow functions
module.exports = {
	someFunc: () => {
		// ...
	},
};

// regular functions, ES6
module.exports = {
	someFunc() {
		// ...
	},
}
```

The last piece of code is what will be used for the rest of the guide. Aside from the reduced amount of characters you have to type out, the only difference between regular functions and arrow functions in this case is the `this` context in them, which may or not matter in your code. If you aren't sure what that means, don't worry about it! It's unrelated to the guide, so we won't be going in-depth about it; you can Google the difference between them if you're curious.

### Dynamically reading command files

At the very top of your main file, add this:

```js
// require node's file system API - https://nodejs.org/api/fs.html
const fs = require('fs');
```

And after your `const client = ...` line, add this:

```js
// create a new Collection
client.commands = new Discord.Collection();
```

<p class="tip">If you aren't exactly sure what Collections are, they're a class that extend JS' native Map class and include more extensive, useful functionality. You can read about Maps [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), and see all the available Collection methods [here](https://discord.js.org/#/docs/main/stable/class/Collection).</p>

This next step is how you'll dynamically retreive all your (soon to be) newly created command files.

```js
// this'll return an array of all the file names in that directory
// e.g. `['ping.js', 'beep.js', 'server.js']`
const commandFiles = fs.readdirSync('./commands');
```

Now that you have an array of all your file names, you can loop over it and dynamically set your commands to the Collection you made above.

```js
// loop over the array with a `for ... of` loop
// if you're more comfortable or familiar with it,
// you can even use a `.forEach()` here instead
for (const file of commandFiles) {
	// require the command file
	const command = require(`./commands/${file}`);

	// use the `Map.set()` method to add a new item to your Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}
```

By this point, your code should look something like this:

```js
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands');

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

/* `client.on('...')` events and such below this point */
```

As for setting up your files, that's it for now. In the next chapter, you'll learn how to make your commands execute dynamically!
