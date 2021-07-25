# Your first command

Create a `commands` folder in the same directory as your `main` file. Normally only one command is defined per file, but you can also define groups of them. Create a `ping.js` file in your `commands` folder, which will send a message and then edit it with the elapsed time. Arguments and other features are covered in other pages.

## Creating a command class

To create a command in Sapphire, the `Command` class needs to be imported from `@sapphire/framework`. A command can be exported through default or named exports.

:::: code-group
::: code-group-item CommonJS
```js
const { Command } = require('@sapphire/framework');

module.exports = class PingCommand extends Command {};
// exports.default = class PingCommand extends Command {};
// exports.myCommand = class PingCommand extends Command {};
```
:::
::: code-group-item ESM
```js
import { Command } from '@sapphire/framework';

export default class PingCommand extends Command {}
// export class PingCommand extends Command {}
```
:::
::::


`module.exports` will be used for these pages. Let's begin populating the command class:

```js
module.exports = class PingCommand extends Command {
	constructor(context) {
		super(context, {
			aliases: ['pong'],
			description: 'Tests the latency.',
		});
	}
};
```

An overview of what's defined in the constructor:

- `context`: an object that contains file metadata required by the `Piece` class (which `Command` extends) in order to function.
- `name`: by default, the name of the file without the extension, i.e. `ping.js` becomes `ping`, so there's no need to define it.
- `aliases`: other ways users can call the command. You can have as many as you want!
- `description`: the text displayed when the help command is used.

There are many other properties available, explained in upcoming sections.

## Creating the `run` method

Commands have a `run` method, which executes the command logic. Define this below the command's constructor:

<!-- eslint-disable constructor-super -->

```js {7-9}
module.exports = class PingCommand extends Command {
	constructor(context) {
		// ...
	}

	async run(message) {
		const response = await message.channel.send('Ping...');
		const latency = response.createdTimestamp - message.createdTimestamp;
		await response.edit(`Pong! Took me ${latency}ms.`);
	}
};
```

<!-- eslint-enable constructor-super -->

Any discord.js code can be executed here, since Sapphire Framework is an extension of it. The command can be triggered with `@bot ping` or `@bot pong`.

<!-- TODO(kyranet): Add a mention for editable commands once I make the plugin for it. -->

## Resulting code

<ResultingCode />
