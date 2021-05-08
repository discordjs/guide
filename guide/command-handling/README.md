# Command handling

Unless your bot project is a small one, it's not a very good idea to have a single file with a giant if/else if chain for commands. If you want to implement features into your bot and make your development process a lot less painful, you'll want to implement a command handler. Let's get started on that!

Here's the base code we'll be using:

```js
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'ping') {
		message.channel.send('Pong.');
	} else if (command === 'beep') {
		message.channel.send('Boop.');
	}
	// ...
});

client.login(token);
```

::: tip
We'll be moving over the commands created in [the previous page](/creating-your-bot/commands-with-user-input.md) as well, but for the sake of keeping the base code short, the code block above omits those commands.
:::

## Individual command files

Before anything, you may want to create a backup of your current bot file. If you've followed along so far, your entire folder structure should look something like this:

![Current folder structure](./images/folder-structure.png)

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

You can go ahead and do the same for the rest of your commands and put their respective blocks of code inside the `execute()` function. If you've been using the same code as the guide thus far, you can copy & paste your commands into their own files now, following the format above. The `description` property is optional but will be useful for the dynamic help command we'll be covering later.

::: tip
`module.exports` is how you export data in Node.js so that you can `require()` it in other files. If you're unfamiliar with it and want to read more, you can look at [the documentation](https://nodejs.org/api/modules.html#modules_module_exports) for more info.
:::

::: tip
If you need to access your client instance from inside one of your command files, you can access it via `message.client`. If you need to access external files, modules, etc., you should re-require them at the top of the file.
:::

## Reading command files

Back in your main file, make these two additions:

```js {1,6}
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
```

::: tip
`fs` is Node's native file system module. You can read the docs about it [here](https://nodejs.org/api/fs.html).
:::

::: tip
If you aren't exactly sure what Collections are, they're a class that extend JavaScript's native Map class and include more extensive, useful functionality. You can read about Maps [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), and see all the available Collection methods <branch version="11.x" inline><docs-link path="class/Collection">here</docs-link></branch><branch version="12.x" inline><docs-link section="collection" path="class/Collection">here</docs-link></branch>.
:::

This next step is how you'll dynamically retrieve all your newly created command files. The [`fs.readdirSync()`](https://nodejs.org/api/fs.html#fs_fs_readdirsync_path_options) method will return an array of all the file names in a directory, e.g. `['ping.js', 'beep.js']`. To ensure only command files get returned, use `Array.filter()` to leave out any non-JavaScript files from the array. With that array, you can loop over it and dynamically set your commands to the Collection you made above.

```js {3,5-10}
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}
```

## Dynamically executing commands

With your `client.commands` Collection setup, you can use it to retrieve and execute your commands! Inside your `message` event, delete your `if`/`else if` chain of commands and replace it with this:

```js {7-14}
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});
```

If there isn't a command with that name, you don't need to do anything further, so exit early with `return`. If there is, `.get()` the command, call its `.execute()` method, and pass in your `message` and `args` variables as its arguments. In case something goes wrong, log the error and report back to the member to let them know.

And that's it! Whenever you want to add a new command, you make a new file in your `commands` directory, name it what you want, and then do what you did for the other commands.

In the next chapter, we'll be going through how to implement some basic features into your brand new command handler. Currently, it's hardly a command "handler" at this point; it's a command loader and executor if you wish to see it that way. You'll learn how to implement some new features and the logic behind them, such as:

* Command aliases
* Cooldowns
* Guild only commands
* A dynamic help message

## Resulting code

<resulting-code path="command-handling/file-setup" />
