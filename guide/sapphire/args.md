# Using arguments in commands

Sometimes when using commands, you may want to get data from the user and change the response accordingly. In this section, you'll create a command that pulls a string from the message and says it back to the user!

## String arguments

A `string` argument is simply the text after the command name and prefix. For example: `@bot say Hello!` would cause the argument to be `Hello!`, although multiple words (e.g. `Hello there!`) are separated in different parameters. We'll look into how to handle those later.

First, go into your `commands` folder and make a new file called `say.js`. Once you have it, set up your command class just like the one in the `ping` command.

```js
const { Command } = require('@sapphire/framework');

module.exports = class SayCommand extends Command {
	constructor(context) {
		super(context, {
			aliases: ['parrot', 'copy'],
			description: 'Replies with the text you provide',
		});
	}

	run(message, args) {
		// ...
	}
};
```

We have a new parameter in the `run` method: `args`! This is a structure that abstracts all the parameter parsing and resolution.

```js {5}
module.exports = class SayCommand extends Command {
	// ...

	async run(message, args) {
		const text = await args.pick('string');
		await message.channel.send(text);
	}
};
```

The way Sapphire's arguments work, is by "consuming" the parameters one by one on success, similar to how an iterator works. We'll go into more details and examples with another command.

In this command, we're using `args.pick()` to read a single parameter from the user's input. The input type is `string`, which means it'll pick the current parameter and return it as-is.

If you run this with `@bot say Hello there!`, it'll send `Hello` back. What happened!? As I said before, each word is a parameter, so `Hello there!` is converted to `["Hello", "there!"]`, and `args.pick()` reads only one. But fear not! There are alternatives:

- **Quoted parameters**:
  If instead of sending `@bot say Hello there!`, we sent `@bot say "Hello there!"` or `@bot say “Hello there!”`, wrapping the content with quotes, the entire content inside the quotes will be read as a single parameter (without the quotes, of course).

- **`args.rest()` as-is**:
  ```js {5,10}
  module.exports = class SayCommand extends Command {
  	constructor(context) {
  		super(context, {
  			// ...
  			quotes: [],
  		});
  	}
  
  	async run(message, args) {
  		const text = await args.rest('string');
  		await message.channel.send(text);
  	}
  };
  ```

  By default, `Command` defines 3 pairs of valid quotes:

  - `"` and `"` (double quotes)
  - `“` and `”` (iOS smart quotes)
  - `「` and `」` (CJK corner brackets)

  This is troublesome if we want to send quotes in the content, as those would be excluded from `rest`, so we have set quotes to an empty array. This way, when you do `@bot say Hello "there!"`, your bot will send `Hello "there!"`.

  ::: warning
  `args.rest()` consumes all the parameters, and then processes it, so you will not be able to consume any more parameters after it.
  :::

## Multiple arguments

Let's make an `add` command, which takes two numbers and adds them. Go into your `commands` folder and make a new file called `add.js`. Once you have it, set up your command class just like you did for the previous command:

```js
module.exports = class AddCommand extends Command {
	constructor(context) {
		super(context, {
			description: 'Adds two numbers',
		});
	}

	run(message, args) {
		// ...
	}
};
```

Now let's fill the logic for the command inside the `run` method. Remember, we want to get two numbers, and add them, so we will need to run `args.pick()` twice:

```js {5-6}
module.exports = class AddCommand extends Command {
	// ...

	async run(message, args) {
		const a = await args.pick('number');
		const b = await args.pick('number');
		return message.channel.send(`The result is... ${a + b}!`);
	}
};
```

Now, if you run `@bot add 1 2`, the bot will reply with `The result is... 3!`. But what is going on in here? What is `a` and what is `b`?

As mentioned before, `args.pick()` consumes parameters one by one, so at first, we will have two parameters: `'1'` and `'2'`. When calling `args.pick()`, the `'1'` is consumed and parsed using the name of the parameter, in this case `'number'`, so it's parsed as the number `1`. Then we do the same with the next parameter, which will be `'2'`. As a result, `a` is assigned to the number `1`, and `b` is assigned to the number `2`.

## Optional arguments

Not all arguments are required, we may want to have an optional arguments in our commands. Luckily for you, Sapphire offers two options regarding this. Let's say we have a `pow.js` command, largely based on the `add.js` command, but it takes two numbers, where the `base` is required, and the `exponent` defaults to 2.

- **Optional Pattern**
  ```js {5-6}
  module.exports = class PowCommand extends Command {
  	// ...
  
  	async run(message, args) {
  		const base = await args.pick('number');
  		const exponent = await args.pick('number').catch(() => 2);
  		return message.channel.send(`The result is... ${Math.pow(base, exponent)}!`);
  	}
  };
  ```

  When you run `@bot pow 4`, the command will behave the same as if you did `@bot pow 4 2`, as the second parameter always defaults to `2`, even if it was not provided. As a result, the bot will send `The result is... 16!`.

  However, this pattern also ignores any possible error, including invalid numbers, so `@bot pow 4 hello!` would still send the same message as above. We have another pattern to solve this:

- **Semi-required Pattern**
  ```js {6}
  module.exports = class PowCommand extends Command {
  	// ...
  
  	async run(message, args) {
  		const base = await args.pick('number');
  		const exponent = args.finished ? 2 : await args.pick('number');
  		return message.channel.send(`The result is... ${Math.pow(base, exponent)}!`);
  	}
  };
  ```

  This is slightly more verbose, but it defaults the `exponent` argument to `2` **only** if there were no parameters left to parse, as such, `@bot pow 4` would return `16`, while `@bot pow 4 hello!` will return an error.

Each pattern has its use-cases, the former is specially helpful for handling several optional parameters, although you can also discriminate all errors from `args` by checking `error.identifier`. This way you can tell if a number failed to parse simply because it's not a number, because it doesn't meet the minimum and/or maximum (if set), among other possible options.

## Repeating arguments

TBD.

## Flags and options

TBD.

## Resulting code

<ResultingCode />
