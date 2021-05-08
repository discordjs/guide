# Useful packages

## moment.js

::: tip
Official documentation: [https://momentjs.com/docs](https://momentjs.com/docs)
:::

Moment is a powerful package for working with dates in JavaScript.  
It allows you to quickly and easily format dates in any way you want or parse strings back into JavaScript Date objects.  
There are even some extensions for it to allow you to work with durations and more.

For example if you wanted to ask your users to give you a date,  
you can use moment to turn it in a Date object you can use in your code:

<!-- eslint-skip -->
```js
const input = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
	max: 4,
	time: 10e3,
	errors: ['time'],
});
const date = moment(input.first().content);
```

Using the "moment-duration-format" extension, you could tell the user how many days in the future or past the date is:

```js
if (date.isValid()) {
	const now = moment();
	const duration = date - now;
	const formatted = moment.duration(duration, 'ms').format();

	if (duration > 0) {
		message.channel.send(`The date you gave me is ${formatted} into the future.`);
	} else {
		message.channel.send(`The date you gave me is ${formatted} into the past.`);
	}
} else {
	message.channel.send('You didn\'t give me a valid date.');
}
```

## ms

::: tip
Official documentation: [https://github.com/zeit/ms](https://github.com/zeit/ms)
:::

Ms is another tool for working with times in JavaScript. However, ms specializes on durations.
It allows you to convert times in milliseconds into human-readable formats and vice versa.

Example:

<!-- eslint-skip -->
```js
await message.channel.send('Send two messages and I\'ll tell you how far apart you sent them.');
const messages = await message.channel.awaitMessages(m => m.author.id === message.author.id. {
	max: 2,
	time: 30e3,
	errors: ['time'],
});

const difference = messages.last().createdTimestamp - messages.first().createdTimestamp;
const formatted = ms(difference);

message.channel.send(`You sent the two messages ${formatted} apart.`);
```

## common-tags

::: tip
Official documentation: [https://github.com/declandewet/common-tags](https://github.com/declandewet/common-tags)
:::

Common-tags is a library all about working with template literals.  
So far, you have probably only used them for interpolating variables into your strings, but they can do a whole lot more.
If you got time, you should check out [the MDN's documentation about *tagged literals*.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates).

Ever got annoyed your multi-line strings had nasty bits of indentation in them,
but you did not want to remove the indentation in your source code?  
common-tags got you covered:

```js
const packageName = 'common-tags';

if (someCondition) {
	const poem = stripIndents`
		I like ${packageName}.
		It makes my strings so pretty,
		you should use it too.
	`;

	console.log(poem);
}
```

This will print your little poem like expected, but it will not have any tabs or other whitespace on the left.

But this is just the start! Another set of useful functions are the list-related functions:
`inlineLists`, `commaLists`, etc.  
With those, you can easily interpolate arrays into your strings without them looking ugly:

```js
const options = ['add', 'delete', 'edit'];

// -> Do you want me to add, delete or edit the channel?
message.channel.send(oneLineCommaListsOr`
	Do you want me to ${options} the channel?
`);
```

Check the the documentation to find more useful functions.

## chalk

::: tip
Official documentation: [https://www.npmjs.com/package/chalk](https://www.npmjs.com/package/chalk)
:::

Chalk is not exactly useful for Discord bots themselves, but it will make your terminal output a lot prettier and organized.
This package lets you color and style your `console.log`s in many different ways; No more simple white on black.

Let's say you want your error messages to be easily visible; Let us give them a nice red color:

```js
console.error(chalk.redBright('FATAL ERROR'), 'Something really bad happened!');
```

![image of code above](./images/chalk-red.png)

You can also chain multiple different multipliers.  
If you wanted to have green text, a grey background, and have it all underlined, that is possible:

```js
console.log(chalk.green.bgBrightBlack.underline('This is so pretty.'));
```

![image of code above](./images/chalk-ugly.png)

## winston

::: tip
Official documentation: [https://github.com/winstonjs/winston](https://github.com/winstonjs/winston)
:::

Winston is "a logger for just about everything".
You can log to the terminal, you can log to a file, etc.  
"But wait," I hear you cry, "what's wrong with `console.log`?".  
Well, the answer is simple: `console.log` is slow and not quite versatile.
Whenever you call `console.log`, your program halts; it cannot do anything until `console.log` finishes, which does not sound good.
Well, that is precisely what winston is for.

Winston is fast and highly configurable. It has different log levels for all your needs; it can log to files, the terminal, etc.
Like moment.js, it also has extension packages. So if there is something you feel is missing, you can probably find one that fits your needs.

Now, there are *a lot* of options, so it is recommended you take a look at the docs yourself.
But let us get a quick overview of what it can do:

```js
const client = new Discord.Client();
const logger = winston.createLogger({
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'log' }),
	],
	format: winston.format.printf(log => `[${log.level.toUpperCase()}] - ${log.message}`),
});

client.on('ready', () => logger.log('info', 'The bot is online!'));
client.on('debug', m => logger.log('debug', m));
client.on('warn', m => logger.log('warn', m));
client.on('error', m => logger.log('error', m));

process.on('uncaughtException', error => logger.log('error', error));

client.login('your-token-goes-here');
```

The above code creates a simple logger that will log to both the console and a file called "log" (defined by the `transports` options).  
The `format` option tells the logger which format to use for the messages; by default, it outputs JSON objects.
While useful, JSON is not very readable, so we define a custom format that displays the log level in all caps alongside the message.
If you wanted to, you could also use the chalk module to make the logger's format a bit prettier by applying colors, etc.

![winston example](./images/winston.png)

Winston is not the only logging library out there, though, so if you are not convinced, you should google around a bit and
you should find something you will like.

## i18next

::: tip
Official documentation: [https://www.i18next.com](https://www.i18next.com)
:::

i18next is an internationalization-framework for JavaScript. It is beneficial to translate your bot's user-facing messages into various languages based on the server it is used in.

Covering an entire use case example for internationalization would be out of this guide's scope and requires some more explanation as to how the system operates. Please refer to the official documentation linked above for an in-depth usage guide.
