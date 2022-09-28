
# Loading command files

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

First, [`path.join()`](https://nodejs.org/api/path.html) helps to construct a path to the `commands` directory. The [`fs.readdirSync()`](https://nodejs.org/api/fs.html#fs_fs_readdirsync_path_options) method then reads the path to the directory and returns an array of all the file names it contains, currently just `['ping.js']`. To ensure only command files get processed, `Array.filter()` removes any non-JavaScript files from the array. 

With the correct files identified, the last step is to loop over the array and dynamically set each command into the `client.commands` Collection. In addition to the filter to remove non-JavaScript files, here it also checks that the files being loaded all have at least the `data` and `execute` properties. This helps to prevent errors resulting from loading empty, unfinished or otherwise incorrect command files while you're still developing.

## Next steps

Your command files are now loaded into your bot, but they won't be appearing in Discord yet. In the next section, we cover the command deployment script you'll need to register your commands and push updates.