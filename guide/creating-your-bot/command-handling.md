# Command handling

Unless your bot project is a small one, it's not a very good idea to have a single file with a giant `if`/`else if` chain for commands. If you want to implement features into your bot and make your development process a lot less painful, you'll want to implement a command handler. Let's get started on that!

Here are the base files and code we'll be using:

:::: code-group
::: code-group-item index.js
```js
const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'beep') {
		await interaction.reply('Boop!');
	}
});

client.login(token);
```
:::
::: code-group-item deploy-commands.js
```js
const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

const commands = [];

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(data => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);
```
:::
::: code-group-item config.json
```json
{
	"clientId": "123456789012345678",
	"guildId": "876543210987654321",
	"token": "your-token-goes-here"
}
```
:::
::::

## Individual command files

Your project directory should look something like this:

```:no-line-numbers
discord-bot/
├── node_modules
├── config.json
├── deploy-commands.js
├── index.js
├── package-lock.json
└── package.json
```

Create a new folder named `commands`, which is where you'll store all of your commands.

We'll be using utility methods of the library to build the slash command data.

First, create a commands/ping.js file for your ping command:

```js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
```

You can go ahead and do the same for the rest of your commands, putting their respective blocks of code inside the `execute()` function.

::: tip
[`module.exports`](https://nodejs.org/api/modules.html#modules_module_exports) is how you export data in Node.js so that you can [`require()`](https://nodejs.org/api/modules.html#modules_require_id) it in other files.

If you need to access your client instance from inside a command file, you can access it via `interaction.client`. If you need to access external files, packages, etc., you should `require()` them at the top of the file.
:::

## Reading command files

In your `index.js` file, make these additions:

```js {1-2,8}
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
```

We recommend attaching a `.commands` property to your client instance so that you can access your commands in other files. The rest of the examples in this guide will follow this convention.

::: tip
[`fs`](https://nodejs.org/api/fs.html) is Node's native file system module. <DocsLink section="collection" path="class/Collection" /> is a class that extends JavaScript's native [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) class, and includes more extensive, useful functionality.
:::

::: tip
[`path`](https://nodejs.org/api/path.html) is Node's native path utility module. It helps construct paths to access files and directories. Instead of manually writing `'./currentDirectory/fileYouWant'` everywhere, one can instead use `path.join()` and pass each path segment as an argument. Note however, you should omit `'/'` or other path segment joiners as these may be different depending on the operating system running your code. One of the advantages of the `path` module is that it automatically detects the operating system and uses the appropriate joiners.
:::

Next you will learn how to dynamically retrieve your command files. First you'll need to get the path to the directory that stores your command files. The node core module ['path'](https://nodejs.org/api/path.html) and it's `join()` method will help to construct a path and store it in a constant so you can reference it later. Following that, the [`fs.readdirSync()`](https://nodejs.org/api/fs.html#fs_fs_readdirsync_path_options) method will return an array of all the file names in the directory, e.g. `['ping.js', 'beep.js']`. To ensure only command files get returned, use `Array.filter()` to leave out any non-JavaScript files from the array. With that array, loop over it and dynamically set your commands to the `client.commands` Collection.

```js {2,4-9}

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}
```

Use the same approach for your `deploy-commands.js` file, but instead `.push()` to the `commands` array with the JSON data for each command.

```js {1,7,9-12}
const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}
```

## Dynamically executing commands

You can use the `client.commands` Collection setup to retrieve and execute your commands! Inside the `interactionCreate` event, delete the `if`/`else if` chain of commands and replace it with this:

```js {4-13}
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});
```

First, fetch the command in the Collection with that name and assign it to the variable `command`. If the command doesn't exist, it will return `undefined`, so exit early with `return`. If it does exist, call the command's `.execute()` method, and pass in the `interaction` variable as its argument. In case something goes wrong, log the error and report back to the member to let them know.

And that's it! Whenever you want to add a new command, make a new file in your `commands` directory, name it the same as the slash command, and then do what you did for the other commands. Remember to run `node deploy-commands.js` to register your commands!

## Resulting code

<ResultingCode />
