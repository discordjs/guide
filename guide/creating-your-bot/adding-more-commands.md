## Adding more commands

A bot with nothing but a single command would be really boring, and you probably have a bunch of command ideas floating around in your head already, right? Let's begin, then.

Here's what your message event should currently look like:

```js
client.on('message', (message) => {
	if (message.content === '!ping') {
		message.channel.send('Pong.');
	}
});
```

Before doing anything else, let's make a variable to store the prefix we've configured.

```js
const prefix = config.prefix;

client.on('message', (message) => {
	if (message.content === prefix + 'ping') {
		message.channel.send('Pong.');
	}
});
```

From now on, if you change the prefix in your config.json file, it'll change in your bot file as well. (We'll be using this a lot soon.)

### Simple command structure

You already have an if statement that checks messages for a ping/pong command. Adding other command checks is just as easy! There's one small difference, though.

```js
if (message.content === prefix + 'ping') {
	message.channel.send('Pong.');
}
else if (message.content === prefix + 'beep') {
	message.channel.send('Boop.');
}
```

Nearly the same, except we use `else if (...)` instead of only `if (...)`.<br />
There are a few potential issues with this. For example, the ping command won't work if we send `!ping test`. It will only match `!ping` and nothing else. The same goes for the other command. If we want our commands to be more flexible, we can do the following:

```js
if (message.content.startsWith(prefix + 'ping')) {
	message.channel.send('Pong.');
}
else if (message.content.startsWith(prefix + 'beep')) {
	message.channel.send('Boop.');
}
```

Now the ping command will trigger whenever the message _starts with_ `!ping`! Sometimes this is what you want, but other times, you may want to match only exactly `!ping` - it varies from case-to-case, so be mindful of what you need when creating commands.

<p class="warning">Be aware that this will also match !pingpong, !pinguin, and the like. This is not a huge problem for now, so don't worry; we'll see better ways to check for commands later.</p>"

### Displaying real data

It's time to move on from basic text commands. Let's start displaying some real data! For now, we'll only be going over basic member/server info.

#### Server info command

Make another if statement to check for commands using `server` as the command name. You've already interacted with the Message object via `message.channel.send()`. You get the message object, access the channel it was sent in, and send a message to it. Just like how `message.channel` gives you the message's _channel_, `message.guild` gives you the message's _server_.

<p class="tip">Servers are referred to as "guilds" in the Discord API and discord.js library. Whenever you see someone say "guild", they mean "server"!</p>

```js
else if (message.content.startsWith(prefix + 'server')) {
	message.channel.send('This server\'s name is: ' + message.guild.name);
}
```

The code above would result in this:

![Server name command](http://i.imgur.com/p0XMbOH.png)

If you want to expand upon that command and add some more info, here's an example of what you can do:

```js
else if (message.content.startsWith(prefix + 'server')) {
	message.channel.send('Server name: ' + message.guild.name + '\nTotal members: ' + message.guild.memberCount);
}
```

That would display both the server name _and_ the amount of members in it.

![Server name and member count command](http://i.imgur.com/Lo1okFk.png)

You can, of course, modify this to your liking. You may want to also display the date the server was created, or the server's region. You would do those in the same manner; use `message.guild.createdAt` or `message.guild.region`, respectively.

<p class="tip">Want a list of all the properties you can access and all the methods you can call on a server? Refer to [the discord.js documentation site](https://discord.js.org/#/docs/main/master/class/Guild)!</p>

#### Member info command

Set up another if statement and use the command name `user-info`.

```js
else if (message.content.startsWith(prefix + 'user-info')) {
	message.channel.send('Your username: ' + message.author.username + '\nYour ID: ' + message.author.id);
}
```

This will display the message author's **username** (not nickname, if they have one set), as well as their user ID.

![User info command](http://i.imgur.com/xhnVTA0.png)

<p class="tip">`message.author` refers to the user who sent the message. For a full list of all the properties and methods for the author object (a member of the `User` class), check out [the documentation page for it](https://discord.js.org/#/docs/main/master/class/User).</p>

And there you have it! As you can see, it's quite simple to add additional commands.

## Bonus: Refactoring to ES6

<p class="tip">This part of the guide is completely optional, but it is recommended. If you want to keep following best practices and have cleaner code, take the time to read through!</p>

This section is specifically for transforming the ES5 code you've had up until now into ES6. If you're not sure what ES5/ES6 is referring to, think of them as just different versions of JavaScript. ES6 has many great features that you should take advantage of, whenever possible.

Before anything, here's what your code should look like right now:

```js
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', () => {
	console.log('Ready!');
});

const prefix = config.prefix;

client.on('message', (message) => {
	if (message.content.startsWith(prefix + 'ping')) {
		message.channel.send('Pong.');
	}
	else if (message.content.startsWith(prefix + 'beep')) {
		message.channel.send('Boop.');
	}
	else if (message.content.startsWith(prefix + 'server')) {
		message.channel.send('Guild name: ' + message.guild.name + '\nTotal members: ' + message.guild.memberCount);
	}
	else if (message.content.startsWith(prefix + 'user-info')) {
		message.channel.send('Your username: ' + message.author.username + '\nYour ID: ' + message.author.id);
	}
});

client.login(config.token);
```

If you haven't noticed, we're actually already using a bit of ES6 in here! The `const` keyword and arrow function synax (`() => ...`) are a part of ES6, and are recommended to use whenever possible. If you aren't sure what they do, you can read our section about ES6 syntax [here](/path/to/es6/section) later!

As for the code above, there are a few places where things can be done better. Let's look at them.

### Destructuring

What you see in red is what you'll remove, and what you see in green is what you'll replace it with.

```diff
- const config = require('./config.json');
+ const { prefix, token } = require('./config.json');

...

- const prefix = config.prefix;

...

- client.login(config.token);
+ client.login(token);
```

#### Destructuring explained

If you've never seen this syntax bfeore, it can be a bit confusing. But actually, it's very easy to understand! Here, take a look:

```js
// Here's the ES5 version. A bit verbose, but works the same
const config = require('./config.json');
const prefix = config.prefix;
const token = config.token;

// Here's an alternative version, still using ES5
const prefix = require('./config.json').prefix;
const token = require('./config.json').token;

// And here's the glorious ES6 version!
const { prefix, token } = require('./config.json');
```

Destructuring extracts certain properties from an object and stores them in variables. If the property doesn't exist, it'll still create a variable, but with the value of `undefined`. So instead of using `config.token` in your `client.login()` method, you'd simply use `token`. And since destructuring creates a variable for us, you don't even need that `const prefix = config.prefix` line. Pretty cool!

Additionally, you could do this for your commands.

```js
client.on('message', (message) => {
	const { content } = message;

	if (content.startsWith(prefix + 'ping')) {
		// ping command here...
	}
	else if (content.startsWith(prefix + 'beep')) {
		// beep command here...
	}
	// other commands here...
});
```

It is a bit less to write out, and also looks cleaner. I wouldn't advise it, though. There's a very specific reason for that, and we'll be discussing it in one of the upcoming pages, so be sure to read through!

### Template literals

You know how you've been doing things like `prefix + 'name'` and `'Your username: ' + message.author.username`? It's a bit verbose, and it's not too fun to constantly type out. Thankfully, there's a better alternative.

```js
// ES5 version, as we currently have it
else if (message.content.startsWith(prefix + 'server')) {
	message.channel.send('Guild name: ' + message.guild.name + '\nTotal members: ' + message.guild.memberCount);
}
else if (message.content.startsWith(prefix + 'user-info')) {
	message.channel.send('Your username: ' + message.author.username + '\nYour ID: ' + message.author.id);
}

// ES6 version, using template literals
else if (message.content.startsWith(`${prefix}server`)) {
	message.channel.send(`Guild name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
}
else if (message.content.startsWith(`${prefix}user-info`)) {
	message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
}
```

Easier to read, easier to write! The best of both worlds.

#### Tempate literals explained

You can think of template literals as the ES6 version of string concatination. I won't go too much into detail about it, but if you're interested in reading more, you can read [the MDN page about them](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals).

Here's a quick comparison between the two:

```js
// Variables/function used throughout the examples
const username = 'Sanctuary';
const password = 'pleasedonthackme';

function letsPretendThisDoesSomething() {
	return 'yay for dummy data';
}

// Regular string concatination
console.log('Your username is **' + username + '**.');
console.log('Your password is: **' + password + '**.');
console.log('1 + 1 = ' + (1 + 1));
console.log('And here\'s a function call: ' + letsPretendThisDoesSomething());
console.log('Putting strings on new lines\n' +
	'can be a bit painful\n' +
	'with string concatenation. :(');

// Template literals
console.log(`Your password is: **${password}**.`);
console.log(`Your username is: **${username}**.`);
console.log(`1 + 1 = ${1 + 1}`);
console.log(`And here's a function call: ${letsPretendThisDoesSomething()}`);
console.log(`Putting strings on new lines
	is a breeze
	with template literals! :)`);

// NOTE: Template literals will also render the indentation inside them!
// There are ways around that which we'll discuss in another section.
```

You can see how it makes things easier and more readable. ES6 has many great features similar to this one that make your code sleeker and more powerful than before. Interested in learning more? Finish reading the next few pages and then check out the ES6 guide we have up! (link to be added later)

## The problem with if/else if

If you don't plan to make more than 7 or 8 commands for your bot, then using an if/else if chain is perfectly fine; it's presumably a small project at that point, so you shouldn't need to spend too much time on it. However, this isn't the case for most of us.<br />You probably want your bot to be feature-rich and easy to configure and develop, right? Using a giant if/else if chain won't let you achieve that, and will only hinder your development process. After you read up on [creating arguments](/path/to/args/page), we'll be diving right into something called a "command handler" - code that makes handling commands easier and much more efficient.

Before continuing, here's a small list of reasons why you shouldn't use if/else if chains for anything that's not a small project:

* Takes longer to find a piece of code you want.
* Easier to fall victim to (spaghetti code)[https://en.wikipedia.org/wiki/Spaghetti_code].
* Difficult to maintain as it grows.
* Difficult to debug.
* Difficult to organize.
* General bad practice.

In short, it's just not a good idea. But that's what this guide is for! Go ahead and read the next few pages to prevent these issues before they happen, learning new things along the way.
