# Your first command

Now that you have created the `commands` folder, you're ready to make your first command file! In Sapphire, we usually define one command per file, but you can also define groups of them. Hop over to your `commands` folder, and create a new file, we'll show how to make a ping command, so we will name this `ping.js`. This is going to be a simple command that replies to a message and then edits with the elapsed time. We'll go into arguments and other features later.

Once you have your file, it's time to get started!

## Creating your command class

Before you do anything, at the start of your file, you're going to need to require Sapphire Framework again, specifically its Command class.

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

Because its spread usage, we will be using `module.exports` in all the guides, so let's create the class and set `module.exports` to it!

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

## Creating your run method

The next thing you're going to need is a `run` method. This should go right below the command's constructor. Inside, you'll run the command's logic:

<!-- eslint-disable constructor-super -->

```js {6-8}
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
