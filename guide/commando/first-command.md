---
pageTheme: blue
---

# Your first command

Now that you've set up a command group and registered your command folder, you're ready to make your first command file! First, you're going to need to create a new file for the command. Hop over to your `commands` folder, and then your `first` folder, and make a new file called `meow.js`. This is going to be a simple command that only replies with a message when used. We'll go into arguments and all that later.

Once you have your file, it's time to get started!

## Creating your command class

Before you do anything, at the start of your file, you're going to need to require Commando again. Specifically its Command class.

```js
const { Command } = require('discord.js-commando');
```

Commands are classes exported with `module.exports`. Create the class and set `module.exports` to it. You will also configure various options here, which we will explain below.

```js
module.exports = class MeowCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'meow',
			aliases: ['kitty-cat'],
			group: 'first',
			memberName: 'meow',
			description: 'Replies with a meow, kitty cat.',
		});
	}
};
```

Don't let this scare you; it's straightforward.

- `name` is the name of the command.
- `aliases` are other ways users can call the command. You can have as many as you want!
- `group` is the command group of the command.
- `memberName` is the name of the command within the group (this can be different from the name).
- `description` is the help text displayed when someones use the help command.

There are many more properties you can use, but their sections will explain those.

## Creating your run method

The next thing you're going to need is a `run` method. This should go right below the constructor for the command. Inside, you'll return a message:

<!-- eslint-disable constructor-super -->

```js {6-8}
module.exports = class MeowCommand extends Command {
	constructor(client) {
		// ...
	}

	run(message) {
		return message.say('Meow!');
	}
};
```

As you can see, the `run` method is simply the code you want the bot to run when someone uses the command. This code can be anything you can do in core discord.js, as Commando is simply an extension.

You may have also noticed that `message.say` is used instead of `message.channel.send`. This syntax is Commando's magic. Instead of `send`, use `say`; embeds, use `embed`; code, use `code`. The only exception to this is attachments, which are still sent the same as usual.

The reason for this is that Commando allows editing messages into commands, and using these methods will enable Commando to save the messages for that use. It also checks if it can send a message to the current channel, so you get two things in one!

Now fire up the bot as usual and use your command! It should automatically be `?meow` to use it.

## Resulting code

<resulting-code />
