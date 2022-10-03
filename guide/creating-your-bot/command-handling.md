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
You need at least one slash command created in a `commands` folder to continue with the instructions on this page. If you haven't done that yet, refer to [the previous pages in this section](/creating-your-bot/slash-commands.md).
:::

## Loading command files

Now that your command files have been created, your bot needs to load these files on startup. 

In your `index.js` file, make these additions to the base template:

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
The [`fs`](https://nodejs.org/api/fs.html) module is Node's native file system module. `fs` is used to read the `commands` directory and identify our command files.

The [`path`](https://nodejs.org/api/path.html) is Node's native path utility module. `path` helps construct paths to access files and directories. One of the advantages of the `path` module is that it automatically detects the operating system and uses the appropriate joiners.

The <DocsLink section="collection" path="class/Collection" /> class extends JavaScript's native [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) class, and includes more extensive, useful functionality. `Collection` is used to store and efficiently retrieve our commands for execution.
:::

Next, using the modules imported above, dynamically retrieve your command files with a few more additions to our `index.js` file:

```js
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
```

First, [`path.join()`](https://nodejs.org/api/path.html) helps to construct a path to the `commands` directory. The [`fs.readdirSync()`](https://nodejs.org/api/fs.html#fs_fs_readdirsync_path_options) method then reads the path to the directory and returns an array of all the file names it contains, currently just `['ping.js']`. To ensure only command files get processed, `Array.filter()` removes any non-JavaScript files from the array. 

With the correct files identified, the last step is to loop over the array and dynamically set each command into the `client.commands` Collection. In addition to the filter to remove non-JavaScript files, here it also checks that the files being loaded all have at least the `data` and `execute` properties. This helps to prevent errors resulting from loading empty, unfinished or otherwise incorrect command files while you're still developing.

## Receiving command interactions

Every slash command is an `interaction`, so to respond to a command, you need to create a listener for the `interactionCreate` event that will execute code when your application receives an interaction. Place the code below in the `index.js` file we created earlier.

```js
client.on('interactionCreate', interaction => {
	console.log(interaction);
});
```

However, not every interaction is a slash command (e.g. `MessageComponent`s). Make sure to only receive and handle slash commands in this function by making use of the `BaseInteraction#isChatInputCommand()` method to exit if another type is encountered:

```js {2}
client.on('interactionCreate', interaction => {
	if (!interaction.isChatInputCommand()) return;
	console.log(interaction);
});
```

## Executing commands

::: tip
This section assumes you're using the `client.commands` convention from the [loading commands](/creating-your-bot/loading-commands.md) page of this guide. Please carefully read those first so that you can understand the methods used in this section.
:::

When your bot receives an `interactionCreate` event, the interaction object contains all the information you need to dynamically retrieve and execute your commands!

Let's take a look at our `ping` command. Note the `execute` method that will reply to the interaction with "Pong!".

```js
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
```

First, you need to get the matching command from the `client.commands` Collection based on the `interaction.commandName`. Your Client instance is always available via `interaction.client`. If no matching command is found, log an error to the console and ignore the event.

With the right command identified, all that's left to do is call the command's `.execute()` method and pass in the `interaction` variable as its argument. In case something goes wrong, catch and log any error to the console.

```js {4,6-9,12,14-15}
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});
```

#### Next steps

Your command files are now loaded into your bot, and the event listener is prepared and ready to respond. In the next section, we cover the final step - a command deployment script you'll need to register your commands so they appear in the Discord client.

#### Resulting code

<ResultingCode path="creating-your-bot/initial-files" />

It also includes some bonus commands!