## File and folder restructuring

As mentioned in a previous chapter, unless your bot project is a small one, it's not a very good idea to have a single file with a giant if/else if chain for commands. If you want to implement features into your bot and make your development process a lot less painful, you'll definitely want to use (or in this case, create) a command handler. Let's get started on that!

### Individual command files

Before anything, you may want to create a backup of your current bot file. If you followed along so far, your entire foler structure should look something like this:

![Current folder structure](assets/img/BmS09fY.png)

In the same folder, create a new folder and name it `commands`. This is where you'll store all of your commands, of course. Head over to your `commands` folder, create a new file named `ping.js`, and copy & paste in the following code:

```js
module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message, args) {
		message.channel.send('Pong.');
	},
};
```

You can go ahead and do the same for the rest of your commands as well, putting their respective blocks of code inside the `execute()` function. If you've been using the same code as the guide thus far, you can copy and paste your commands into their own files now just fine without any issue, as long as you follow the format above. The `description` property is optional, but will be useful for the dynamic help command we'll be covering later.

<p class="warning">If you've set up ESLint for your editor and start receiving errors like `'args' is defined but never used` in your command files, this means that (as it currently is), you don't need that variable in your code. Since it's not being used, you can remove it entirely so that you only have a `message` variable in the function parameters. If you realize that you need it later, you can add it back.</p>

<p class="tip">`module.exports` is how you export data in Node.js so that you can `require()` it in other files. If you're unfamiliar with it and want to read more, you can take a look at [the documentation](https://nodejs.org/api/modules.html#modules_module_exports) for more info.</p>

### Dynamically reading command files

At the very top of your main file, add this:

```js
// require node's file system module - https://nodejs.org/api/fs.html
const fs = require('fs');
```

And after your `const client = ...` line, add this:

```js
client.commands = new Discord.Collection();
```

<p class="tip">If you aren't exactly sure what Collections are, they're a class that extend JS's native Map class and include more extensive, useful functionality. You can read about Maps [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), and see all the available Collection methods [here](https://discord.js.org/#/docs/main/stable/class/Collection).</p>

This next step is how you'll dynamically retreive all your (soon to be) newly created command files.

```js
const commandFiles = fs.readdirSync('./commands');
```

The `fs.readdirSync()` method will return an array of all the file names in that directory, i.e. `['ping.js', 'beep.js', 'server.js']`. With that array, you can loop over it and dynamically set your commands to the Collection you made above.

```js
for (const file of commandFiles) {
	// require the command file
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
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

## Resulting code

If you want to compare your code to the code we've constructed so far, you can review it over on the GitHub repository [here](https://github.com/Danktuary/Making-Bots-with-Discord.js/tree/master/code_samples/command-handling/file-setup).
