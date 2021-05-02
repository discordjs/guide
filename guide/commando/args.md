---
pageTheme: blue
---

# Using arguments in commands

Sometimes when using commands, you may want to get data from the user and change the response accordingly. In this section, you'll create a command that pulls a string from the message and says it back to the user!

## String arguments

A `string` argument is simply the text after the command name and prefix. For example: `?say Hi there!` would cause the argument to be `Hi there!`. It's quite simple to create one.

First, go into your `first` folder and make a new file called `say.js`. Once you have it, set up your command class and everything just like the one in the meow command.

```js
const { Command } = require('discord.js-commando');

module.exports = class SayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'say',
			aliases: ['parrot', 'copy'],
			group: 'first',
			memberName: 'say',
			description: 'Replies with the text you provide.',
		});
	}

	run(message) {
		// ...
	}
};
```

The `args` field is simply an array of objects, each containing data for that argument.

```js {5-11}
module.exports = class SayCommand extends Command {
	constructor(client) {
		super(client, {
			// ...
			args: [
				{
					key: 'text',
					prompt: 'What text would you like the bot to say?',
					type: 'string',
				},
			],
		});
	}
};
```

See? Simple.

- `key` is the name of the argument. When you define it in your `run` method, this is what you'll be using.
- `prompt` is the text that displays if the user doesn't provide arguments. If someone uses `?say` by itself, that prompt will ask for the text.
- `type` is the type of the argument. It can be many things, including `string`, `integer`, `user`, `member`, etc.

Adding more args is as simple as adding another object to the array, like so:

```js {11-15}
module.exports = class SayCommand extends Command {
	constructor(client) {
		super(client, {
			// ...
			args: [
				{
					key: 'text',
					prompt: 'What text would you like the bot to say?',
					type: 'string',
				},
				{
					key: 'otherThing',
					prompt: 'What is this other useless thing?',
					type: 'string',
				},
			],
		});
	}
};
```

You can also set arguments to default to a specific value:

```js {11}
module.exports = class SayCommand extends Command {
	constructor(client) {
		super(client, {
			// ...
			args: [
				// ...
				{
					key: 'otherThing',
					prompt: 'What is this other useless thing?',
					type: 'string',
					'default': 'dog',
				},
			],
		});
	}
};
```

As you can see, they're very powerful things.

Head on over to your `run` method and set the `text` arg to a variable and return the text to the user.

<!-- eslint-disable constructor-super -->

```js {6-8}
module.exports = class SayCommand extends Command {
	constructor(client) {
		// ...
	}

	run(message, { text }) {
		return message.reply(text);
	}
};
```

And there you have it, a say command using args!

## Resulting code

<resulting-code />
