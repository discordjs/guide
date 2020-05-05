# Command handling

As mentioned in a previous chapter, unless your bot project is a small one, it's not a very good idea to have a single file with a giant if/else if chain for commands. If you want to implement features into your bot and make your development process a lot less painful, you'll definitely want to use (or in this case, create) a command handler. Let's get started on that!

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

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'ping') {
		message.channel.send('Pong.');
	} else if (command === 'beep') {
		message.channel.send('Boop.');
	}
	// other commands...
});

client.login(token);
```

::: tip
We'll be moving over the commands created in [the previous page](/creating-your-bot/commands-with-user-input.md) as well, but for the sake of keeping the base code short, those commands have been omitted from the codeblock above.
:::

## Individual command files

Before anything, you may want to create a backup of your current bot file. If you've followed along so far, your entire folder structure should look something like this:

![Current folder structure](~@/images/BmS09fY.png)

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

You can go ahead and do the same for the rest of your commands as well, putting their respective blocks of code inside the `execute()` function. If you've been using the same code as the guide thus far, you can copy & paste your commands into their own files now just fine without any issue, as long as you follow the format above. The `description` property is optional, but will be useful for the dynamic help command we'll be covering later.

::: tip
`module.exports` is how you export data in Node.js so that you can `require()` it in other files. If you're unfamiliar with it and want to read more, you can take a look at [the documentation](https://nodejs.org/api/modules.html#modules_module_exports) for more info.
:::

::: tip
If you need to access your client instance from inside one of your command files, you can access it via `message.client`. If you need to access things such as external files or modules, you should re-require them at the top of the file.
:::

## Dynamically reading command files

Back in your main file, make these two additions:

```diff
+ const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
+ client.commands = new Discord.Collection();
```

::: tip
`fs` is Node's native file system module. You can read the docs about it [here](https://nodejs.org/api/fs.html).
:::

::: tip
If you aren't exactly sure what Collections are, they're a class that extend JS's native Map class and include more extensive, useful functionality. You can read about Maps [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), and see all the available Collection methods <branch version="11.x" inline>[here](https://discord.js.org/#/docs/main/v11/class/Collection)</branch><branch version="12.x" inline>[here](https://discord.js.org/#/docs/collection/master/class/Collection)</branch>.
:::

This next step is how you'll dynamically retrieve all your newly created command files. Add this below your `client.commands` line:

```js
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
```

The `fs.readdirSync()` method will return an array of all the file names in that directory, e.g. `['ping.js', 'beep.js']`. The filter is there to make sure any non-JS files are left out of the array. With that array, you can loop over it and dynamically set your commands to the Collection you made above.

```js
for (const file of commandFiles) {
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

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// `client.on('...')` events and such below this point
```

As for setting up your files, that's it for now. In the next chapter, you'll learn how to make your commands execute dynamically!

## Resulting code

<resulting-code path="command-handling/file-setup" />
