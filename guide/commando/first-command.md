---
forceTheme: blue
---

# Your first command

Now that you've set up a command group and registered your command folder, you're ready to make your first command file! First, you're going to need to create a new file for the command. Hop over to your `commands` folder, and then your `first` folder, and make a new file called `meow.js`. This is going to be a simple command that only replies with a message when used. We'll go into arguments and all that later.

Once you have your file, it's time to get started!

## Creating your command class

Before you do anything, at the start of your file, you're going to need to require Commando again. Specifically its Command class.

```js
const { Command } = require('discord.js-commando');
```

Commands are classes exported with `module.exports`. Create the class and set `module.exports` to it. You will also set a bunch of options here, which will be explained below.

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

Don't let this scare you, it's actually very simple.

- `name` is the name of the command.
- `aliases` are other ways the command can be called. You can have as many as you want!
- `group` is the command group the command is a part of.
- `memberName` is the name of the command within the group (this can be different from the name).
- `description` is the help text displayed when the help command is used.

There are many more properties you can use, but those will be explained in their own sections.

## Creating your run method

The next thing you're going to need is a `run` method. This should go right below the constructor for the command. Inside, you'll return a message:

```js
module.exports = class MeowCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'meow',
			group: 'first',
			memberName: 'meow',
			description: 'Replies with a meow, kitty cat.',
		});
	}

	run(message) {
		return message.say('Meow!');
	}
};
```

As you can see, the `run` method is simply the code you want the bot to run when the command is used. This can be anything you can do in normal Discord.js, as Commando is simply an extension.

You may have also noticed that I used `message.say` instead of `message.channel.send`. This is Commando's magic. Instead of `send`, use `say`. For embeds, use `embed`. For code, use `code`. The only exception to this is files, which are still sent the same as normal.

The reason for this is that Commando allows editing messages into commands, and using these methods allows Commando to save the messages for that use. It also checks if it can send a message to the current channel, so you get two things in one!

Now fire up the bot as normal and use your command! It should automatically be `?meow` to use it.

## Resulting code

<resulting-code />
