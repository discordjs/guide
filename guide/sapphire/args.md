# Using arguments in commands

Sometimes when using commands, you may want to get data from the user and change the response accordingly. In this section, we'll demonstrate how to create a command that pulls a string from the message and echoes it back to the user!

## String arguments

A `string` argument is simply the text after the command name and prefix. For example: `@bot say Hello!` would cause the argument to be `Hello!`, although multiple words (e.g. `Hello there!`) are separated in different parameters. We'll look into how to handle those later.

In your `commands` folder, make a new file called `echo.js` and set up the command class just like the one in the `ping` command.

```js
const { Command } = require('@sapphire/framework');

module.exports = class EchoCommand extends Command {
	constructor(context) {
		super(context, {
			aliases: ['parrot', 'copy'],
			description: 'Replies with the text you provide',
		});
	}

	async run(message, args) {
		// ...
	}
};
```

We have a new parameter in the `run` method: `args`! This is a structure that abstracts all the parameter parsing and resolution.

```js {5}
module.exports = class EchoCommand extends Command {
	// ...

	async run(message, args) {
		const text = await args.pick('string');
		await message.channel.send(text);
	}
};
```

The way Sapphire's arguments work is by "consuming" the parameters one by one upon success, similar to how an iterator works. We'll go into more details and examples in another command.

In this command, `args.pick('<type>')` is used to read a single parameter from the user's input. The `<type>` here is `string`, which means it'll pick the current parameter and return it as is.

If `@bot say Hello there!` is sent, it'll send back `Hello`. The reason for this is that each word is a parameter, so `Hello there!` is converted to `['Hello', 'there!']`, and `args.pick()` reads only one. However, there are alternatives:

- **Quoted parameters**:
If the argument content is wrapped in quotes, i.e. `"Hello there!"` or `“Hello there!”` instead of `Hello there!`, the entire content (excluding the quotes) will be read as a single parameter.

- **`args.rest()` as is**:
  ```js {5,10}
  module.exports = class EchoCommand extends Command {
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

  This is troublesome if you want to allow sending quotes within the content, as those would be excluded from `rest`, so `quotes` must be set to an empty array. This way, when `@bot echo Hello "there!"` is sent, your bot will reply with `Hello "there!"`.

  ::: warning
  `args.rest()` consumes all the parameters and then processes them, so you will not be able to consume any more parameters after it.
  :::

## Multiple arguments

Let's make an `add` command, which takes two numbers and adds them. Create an `add.js` file in your `commands` folder and set up the command class again. Since two arguments are needed, use `args.pick()` twice:

```js {9-11}
module.exports = class AddCommand extends Command {
	constructor(context) {
		super(context, {
			description: 'Adds two numbers',
		});
	}

	async run(message, args) {
		const a = await args.pick('number');
		const b = await args.pick('number');
		return message.channel.send(`The result is ${a + b}!`);
	}
};
```

Each time `args.pick('<type>')` is called, it consumes the arguments one by one and parses them as the `<type>` given. So `@bot add 1 2` would return `The result is 3!`.

## Optional arguments

Sapphire offers two options regarding regarding optional arguments. Let's make a `pow.js` command that takes two numbers, where the `base` is required, and the `exponent` defaults to 2.

- **Optional Pattern**
  ```js {5-6}
  module.exports = class PowCommand extends Command {
  	// ...
  
  	async run(message, args) {
  		const base = await args.pick('number');
  		const exponent = await args.pick('number').catch(() => 2);
  		return message.channel.send(`The result is ${Math.pow(base, exponent)}!`);
  	}
  };
  ```

  Since `exponent` defaults to `2`, this allows users to send `@bot pow 4`, returning `The result is 16!`. However, this pattern ignores any possible errors, including invalid numbers, so `@bot pow 4 hello!` would return the same response as before. There is another pattern to solve this:

- **Semi-required Pattern**
  ```js {6}
  module.exports = class PowCommand extends Command {
  	// ...
  
  	async run(message, args) {
  		const base = await args.pick('number');
  		const exponent = args.finished ? 2 : await args.pick('number');
  		return message.channel.send(`The result is ${Math.pow(base, exponent)}!`);
  	}
  };
  ```

  This is slightly more verbose, but it defaults `exponent` to `2` **only** if there were no parameters left to parse, so `@bot pow 4` will return `The result is 16!`, while `@bot pow 4 hello!` will return an error.

Each pattern has its use-cases. The former is specially helpful for handling several optional parameters, although you can also discriminate all errors from `args` by checking `error.identifier`. This way you can tell if a number failed to parse for reasons such as it's not a number, it doesn't meet the minimum and/or maximum (if set), among other possible options.

## Repeating arguments

TBD.

## Flags and options

TBD.

## Resulting code

<ResultingCode />
