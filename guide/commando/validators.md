---
forceTheme: blue
---

# Using argument validators

Sometimes you're going to want an argument to be a certain thing, e.g. check if it's a specific piece of text, or check the length. This can be accomplished with a `validate` function in your arg.

## Basic validators

What if you have a command where your first argument has to match a certain text? For example: if you wanted your `say` command to allow a maximum of 200 characters. It's very simple.

First, pull the argument from your say command:

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

Add a blank `validate` function to the arg.

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

Inside your `validate` function, check to see if the length is below 201 characters.

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

Another property you can use to validate arguments is the `oneOf` option. This option forces the argument of be _one of_ the options provided in an array. If you wanted to make an argument that required a "yes" or "no" response, you'd do this:

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
