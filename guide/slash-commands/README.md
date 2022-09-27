# Creating commands

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
</DiscordMessages>

Discord allows developers to register [slash commands](https://discord.com/developers/docs/interactions/application-commands), which provide users a first-class way of interacting directly with your application. 

In comparison to the old method, in which bots would check for messages starting with a specific prefix and manually parse all the content, slash commands provide a huge number of benefits including:

- Integration with the Discord client interface.
- Automatic command detection and parsing of the associated options/arguments.
- Typed argument inputs for command options, e.g. "String", "User", or "Role".
- Validated or dynamic choices for command options.
- In-channel private responses (ephemeral messages).
- Pop-up form-style inputs for capturing additional information.

...and many more!

This section of the guide will show you how to create command files using the `SlashCommandBuilder` class, register the commands to Discord so it appears in the interface, and handle incoming interaction events to trigger each command's functionality. So let's get started!

## Individual command files

Assuming you've followed the [Creating your bot](/creating-your-bot) section of this guide so far, your project directory should look something like this:

```:no-line-numbers
discord-bot/
├── node_modules
├── config.json
├── index.js
├── package-lock.json
└── package.json
```

Create a new folder named `commands`, which is where you'll store all of your commands. We'll be using the <DocsLink section="builders" path="class/SlashCommandBuilder"/> class to help us construct our command definitions.

At a minimum, a slash command must have a name and a description. Using the builder, a simple `ping` command definition would look like this:

```js
new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Replies with Pong!');
```

Create a `commands/ping.js` file for your first command. In it, we'll export two items:
- The `data` property, which will provide the command definition for registering to Discord.
- An `execute` method, which will contain the functionality to run from our handler when the command is used.

```js
// commands/ping.js
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

You can make additional commands by creating additional files in the `commands` folder. We'll be introducing a few more commands throughout the guide, so for now let's move on and have your main application read these files.

::: tip
[`module.exports`](https://nodejs.org/api/modules.html#modules_module_exports) is how you export data in Node.js so that you can [`require()`](https://nodejs.org/api/modules.html#modules_require_id) it in other files.

If you need to access your client instance from inside a command file, you can access it via `interaction.client`. If you need to access external files, packages, etc., you should `require()` them at the top of the file.
:::

## Reading command files

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


Next you will learn how to dynamically retrieve your command files with a few more additions to our `index.js` file:

```js {3-4,6-14}
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

First, [`path.join()`](https://nodejs.org/api/path.html) helps to construct a path to the `commands` directory. The [`fs.readdirSync()`](https://nodejs.org/api/fs.html#fs_fs_readdirsync_path_options) method then reads the path to the directory we constructed and returns an array of all the file names it contains, e.g. `['ping.js', 'beep.js']`. To ensure only command files get processed, `Array.filter()` removes any non-JavaScript files from the array. 

With the correct files identified, the last step is to loop over the array and dynamically set each command into the `client.commands` Collection. In addition to the filter to remove non-JavaScript files, here we check that the files being loaded all have at least the `data` and `execute` properties. This helps to prevent errors resulting from loading empty, unfinished or otherwise incorrect command files while you're still developing.

#### Next steps

Your command files are now loaded into your bot, but they won't be appearing in Discord yet. In the next section, we cover the command deployment script you'll need to [register your commads](/slash-commands/registering.md) and push updates.