# Using Argument Validators

Sometimes you're going to want an argument to be a certain thing. for example, a certain text, or maybe you want to check the length, there's many things you may want to do. This can be accomplished with a `validate` function in your arg.


## Basic Validators

Let's say you have a command where your first argument has to match a certain text. For example, if you wanted your `say` command to only allow 200 characters to be repeated, and no more. It's very simple.

First, let's pull the argument from your say command:

<!-- eslint-skip -->
```js
args: [
	{
		key: 'text',
		prompt: 'What text would you like the bot to say?',
		type: 'string',
	},
],
```

Let's add a blank `validate` to the arg.

<!-- eslint-skip -->
```js
args: [
	{
		key: 'text',
		prompt: 'What text would you like the bot to say?',
		type: 'string',
		validate: text => {},
	},
],
```

Inside our validate function, let's check to see if the length is below 201 characters.

<!-- eslint-skip -->
```js
args: [
	{
		key: 'text',
		prompt: 'What text would you like the bot to say?',
		type: 'string',
		validate: text => text.length < 201,
	},
],
```

And now you've got a validator that checks if the length is 200!

## oneOf

Another property we can use to validate arguments is the `oneOf` option. This option forces the argument of be _one of_ the options provided in an array. For example, let's say you wanted to make an argument the required a "yes" or "no" response.

<!-- eslint-skip -->
```js
args: [
	{
		key: 'option',
		prompt: 'Yes or No?',
		type: 'string',
		oneOf: ['yes', 'no'],
	},
],
```

That's it! This will automatically be case-insensitive, so you don't have to worry about that.
