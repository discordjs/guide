# Command handling

As we add more commands to our bot, the `index.js` and `deploy-commands.js` files will get bigger and bigger. To solve this, we can move each command into its own file, and implement a *command handler* in our `index.js` and `deploy-commands.js`.

If you've been following the guide, here are the base files and code we have so far:

:::: code-group
::: code-group-item index.js
```js
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (interaction.commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	} else if (interaction.commandName === 'user') {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	}
});

client.login(token);
```
:::
::: code-group-item deploy-commands.js
```js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();
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
## Command handler for deploy-commands.js

Remember that the goal of a command handler is to move each command into its own file, so we can dynamically import them. In the case of the `deploy-commands.js` file, we built the structure of our three slash commands inside the `deploy-commands.js` file. We want to move these structures into their own separate file.
:::: code-group
::: code-group-item deploy-commands.js
```js :no-line-numbers {2-4}
const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
].map(command => command.toJSON());
```
:::
::::

Right now, your project directory should look something like this:

```:no-line-numbers
discord-bot/
├── node_modules
├── config.json
├── deploy-commands.js
├── index.js
├── package-lock.json
└── package.json
```

Create a new folder named `commands`, and inside of it, create 3 files for your 3 commands:

```:no-line-numbers {3-6}
discord-bot/
├── node_modules
├── commands
│   ├── ping.js
│ 	├── server.js
│   └── user.js
├── config.json
├── deploy-commands.js
├── index.js
├── package-lock.json
└── package.json
```

Next, in your `commands/ping.js` file, create the same structure for the `ping` command that we have in `deploy-commands.js`, and then export it:

:::: code-group
::: code-group-item commands/ping.js
```js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with pong!'),
};
```
:::
::::

Go ahead and do the same for `commands/server.js` and `commands/user.js`.

::: tip
[`module.exports`](https://nodejs.org/api/modules.html#modules_module_exports) is how you export data in Node.js so that you can [`require()`](https://nodejs.org/api/modules.html#modules_require_id) (import) it in other files.

If you need to access your client instance from inside a command file, you can access it via `interaction.client`. If you need to access external files, packages, etc., you should `require()` them at the top of the file.
:::

Now that each command is in its own file, we can implement the command handler for our deployment script. (Notice that we got rid of the `SlashCommandBuilder` import here, because we don't need it in the deployment script anymore)

:::: code-group
::: code-group-item deploy-commands.js
```js {4,6-10}
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');
const { readdirSync } = require('fs')

const commands = [];
for (const file of readdirSync('./commands').filter(f => f.endsWith('.js'))) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();
```
:::
::::

The [`fs.readdirSync()`](https://nodejs.org/api/fs.html#fs_fs_readdirsync_path_options) method will return an array of all the file names in a given directory, e.g. `['ping.js', 'server.js', 'user.js']`. To ensure only command files get returned, use [`Array.filter()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) to leave out any non-JavaScript files from the array. With that array, we loop over it and populate the `commands` variable with [`Array.push()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push). Finally, just like before, the `commands` variable gets passed to `rest.put()` to register our commands.

## Command handler for index.js

Now let's try to implement the command handler for the `index.js` file. 

Again, remember that the goal of the command handler is to move each command into its own file, so we can dynamically import them. In the case of the `index.js` file, we want to move these replies into their respective command file.

:::: code-group
::: code-group-item index.js
```js :no-line-numbers {6-12}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	} else if (commandName === 'user') {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	}
});
```
:::
::::

Let's go back to our `commands/ping.js` and implement the following code:

:::: code-group
::: code-group-item commands/ping.js
```js {8-10}
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with pong!'),

	async execute(interaction) {
		await interaction.reply('Pong!');
	}
};
```
:::
::::

Go ahead and do the same for `commands/server.js` and `commands/user.js`.

Now let's try to implement the command handler in the `index.js` file.

::: warning
Make sure to import the [`Collection`](https://discord.js.org/#/docs/collection/main/class/Collection) class from the `discord.js` module. (line 2)
:::

:::: code-group
::: code-group-item index.js
```js {1,2,7,9-14,23-32}
const { readdirSync } = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();

for (const file of readdirSync('./commands').filter(f => f.endsWith('.js')) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

	if (!command) return await interaction.reply({ content: 'Command file to handle this command was not found!', ephemeral: true });

	try {
		command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);
```
:::
::::

First, we create a new property called `commands` for our `client` object, and initialize it as an empty `Collection`. (line 7)

Next, just like in our `deploy-commands.js` file, we will also make use of `readdirSync()` to import all of our command files. However, this time we will call [`Collection.set()`](https://discord.js.org/#/docs/collection/main/class/Collection?scrollTo=set) to populate the `client.commands`, with the command's name as the key, and the command file itself as the value.

Next, we can go to the callback of the `interactionCreate` event, and call `.get()` on the `client.commands` Collection, to retrieve the corresponding command file by its command name. (line 23)

Finally, we call the `.execute()` function of the command file, which will effectively reply to the command.

::: tip
The <DocsLink section="collection" path="class/Collection" /> from `discord.js` is a class that extends JavaScript's native [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) class, and includes more extensive, useful functionality.
:::

## Summary

The goal of a *command handler* is to allow each command to be in its own separate file. Not only will this keep the `deploy-commands.js` and `index.js` files cleaner, but it will also allow each command to have its "`data`" (structure) and "`execute`" in the same file; making it easier to develop the `execute` function.

Take the `commands/ping.js` file as example:

:::: code-group
::: code-group-item commands/ping.js
```js {4-6,8-10}
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with pong!'),

	async execute(interaction) {
		await interaction.reply('Pong!');
	}
};
```
:::
::::
We have the `data` of our `ping` command, which defines the "structure" of the command. It defines how the command will look when a user tries to use the command in Discord.

Below it, we have the `execute` of our `ping` command, which defines how we want our bot to reply to the `ping` command.

The `deploy-commands.js` file will import the `data` (structure) of the command for registration:

:::: code-group
::: code-group-item deploy-commands.js
```js :no-line-numbers {2}
const command = require(`./commands/${file}`);
commands.push(command.data.toJSON());
```
:::
::::

while the `index.js` file will import the file and then call the `execute()` of the command:

:::: code-group
::: code-group-item index.js
```js :no-line-numbers {2,4,6}
const command = require(`./commands/${file}`);
client.commands.set(command.data.name, command);
...
const command = client.commands.get(interaction.commandName);
...
command.execute(interaction);
```
:::
::::

And that's it! Whenever you want to add a new command, make a new file in your `commands` directory, and then do what you did for the other commands. 

::: warning
If you create a new command file, edit an existing command's `data` (structure), or delete a command file from the `commands` folder, **REMEMBER TO RUN `node deploy-commands.js` AGAIN TO REGISTER THEM!**

Our deployment script will **overwrite** ALL the previously registered commands with the array of commands that you provide in `rest.put()`.
:::: code-group
::: code-group-item deploy-commands.js
```js:no-line-numbers {3}
await rest.put(
	Routes.applicationGuildCommands(clientId, guildId),
	{ body: commands }, // <-- the variable "commands" is the array of commands in the deployment script
);
```
:::

## Resulting code

<ResultingCode />
