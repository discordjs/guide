# Your first command

Create a `commands` folder in the same directory as your `main` file. Normally only one command is defined per file, but you can also define groups of them. Create a `ping.js` file in your `commands` folder, which will send a message and then edit it with the elapsed time. Arguments and other features are covered in other pages.

## Creating a command class

To create a command in Sapphire, the `Command` class needs to be imported from `@sapphire/framework`. A command can be exported through default or named exports.

:::: code-group
::: code-group-item CommonJS
```js
const { Command } = require('@sapphire/framework');
```
:::
::: code-group-item ESM
```js
import { Command } from '@sapphire/framework';
```
:::
::::

Commands are classes that are exported in any of the following ways:

:::: code-group
::: code-group-item CommonJS
```js
module.exports = class Foo extends Piece {};
exports.default = class Foo extends Piece {};
exports.myCommand = class Foo extends Piece {};
```
:::
::: code-group-item ESM
```js
export default class DefaultFoo extends Piece {}
export class Foo extends Piece {}
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

Don't let this scare you; it's straightforward.

- `context` is an object that contains some file metadata required by the `Command` and `Piece` (which `Command` extends) require in order to function.
- `name` is, by default, the name of the file without the extension, e.g. `ping.js` becomes `ping`, so we don't need to define it.
- `aliases` are other ways users can call the command. You can have as many as you want!
- `description` is the help text displayed when somebody uses a help command.

There are many more properties you can use. The upcoming sections will explain those.

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

As you can see, the `run` method is simply the code you want the bot to run when somebody uses the command. This code can be anything you can do in core discord.js, as Sapphire Framework is simply an extension.

<!-- TODO(kyranet): Add a mention for editable commands once I make the plugin for it. -->

Now fire up the bot as usual and use your command! It should automatically be `@bot ping` to use it.

## Resulting code

<ResultingCode />
