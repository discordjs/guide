## Adding more commands

A bot with nothing but a single command would be really boring, and you probably have a bunch of command ideas floating around in your head already, right? Let's begin, then.

Currently, here's what your message event should look like:

```js
client.on('message', (message) => {
	if (message.content === '!ping') {
		message.channel.send('Pong.');
	}
});
```

Before anything, you should set up a prefix to utilize the one in your config.json file. You'll need to do something like the following:

```js
const prefix = config.prefix;

client.on('message', (message) => {
	if (message.content === prefix + 'ping') {
		message.channel.send('Pong.');
	}
});
```

So from now on, if you change the prefix value in your config.json file, it'll reflect accordingly in your bot file (which is great, because we'll be using it a lot soon).

### Simple command structure

You already have your first if statement that runs a ping/pong command, adding another command is just as easy! There's only a slight difference.

```js
if (message.content === prefix + 'ping') {
	message.channel.send('Pong.');
} else if (message.content === prefix + 'beep') {
	message.channel.send('Boop.');
}
```

Nearly the same, except we use `else if (...)` instead of only `if (...)` this time.<br />
But there's a couple issues with this. The ping command won't work if we send `!ping test`. It only matches `!ping` and nothing else, and the same goes for the other command. There's a simple solution to this.

```js
if (message.content.startsWith(prefix + 'ping')) {
	message.channel.send('Pong.');
} else if (message.content.startsWith(prefix + 'beep')) {
	message.channel.send('Boop.');
}
```

Now the ping command will trigger whenever the message at least _starts with_ `!ping`! Sometimes this is what you want, but other times, you may want to match only exactly `!ping` - it varies from case-to-case, so be mindful of what you need when creating commands.

### Displaying real data

It's time to move on from basic text commands. Let's start displaying some real data! There's so many things we could display, so for now, we'll only be going over basic member/server info.

#### Server info command

Make another command if statement and set the comman name as `server` (or anything you want, really). You've already interacted with the Message object via the `message.channel.send()` lines you have. You get the message variable, access the channel it was sent in, and then send a message to the channel. Well, just like how you use `message.channel`, you can get (and interact with) data from the server by using `message.guild`.

<p class="tip">Servers are referred to as "guilds" in the Discord API and discord.js library. Whenever you see someone say "guild", they mean "server"!</p>

```js
else if (message.content === prefix + 'server') {
	message.channel.send('This guild\'s name is: ' + message.guild.name);
}
```

The code above would result in this:

![Server name command](http://i.imgur.com/p0XMbOH.png)

If you want to expand upon that command add some more info, here's an example of what you can do:

```js
else if (message.content === prefix + 'server') {
	message.channel.send('Server name: ' + message.guild.name + '\nTotal members: ' + message.guild.memberCount);
}
```

That would display both the server name _and_ the amount of members in it.

![Server name and member count command](http://i.imgur.com/Lo1okFk.png)

You can, of course, modify this to your liking. You may want to also display the date the server was created, or region. You would do those in the same manner; use `message.guild` and then add `.createdAt` or `.region`, respectively.

<p class="tip">Want a full list of all the properties you can access and methods you can call on a server? Refer to [the discord.js documentation site](https://discord.js.org/#/docs/main/master/class/Guild)!</p>

#### Member info command

Just like the server command, set up another command if statement and name this command `user-info`.

```js
else if (message.content === prefix + 'user-info') {
	message.channel.send('Your username: ' + message.author.username + '\nYour ID: ' + message.author.id);
}
```

This will display the message author's **username** (not nickname, if they have one set), as well as their user ID.

![User info command](http://i.imgur.com/xhnVTA0.png)

<p class="tip">`message.author` refers to the user who sent the message. For a full list of all the properties and methods for the author object (referred to as the `User` class), check out [the documentation page for it](https://discord.js.org/#/docs/main/master/class/User).</p>

And there you have it! As you can see, it's quite simple to add additional commands; there really isn't much to it.

## Bonus: Refactoring to ES6

<p class="tip">This part of the guide is completely optional, but it is recommended. If you want to keep following best practices and achieve cleaner code, take the time to read through!</p>

This section is specifically for transforming the ES5 code you've had up until now into ES6. If you're not sure what ES5/ES6 is referring to, think of them as just different versions of JavaScript. ES6 has many great features that you should take advantage of, whenever possible.

Before anything, here's what your code should look like at this moment:

```js
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', () => {
	console.log('Ready!');
});

const prefix = config.prefix;

client.on('message', (message) => {
	if (message.content === prefix + 'ping') {
		message.channel.send('Pong.');
	}
	else if (message.content === prefix + 'beep') {
		message.channel.send('Boop.');
	}
	else if (message.content === prefix + 'server') {
		message.channel.send('Guild name: ' + message.guild.name + '\nTotal members: ' + message.guild.memberCount);
	}
	else if (message.content === prefix + 'user-info') {
		message.channel.send('Your username: ' + message.author.username + '\nYour ID: ' + message.author.id);
	}
});

client.login(config.token);
```

There are a few areas where things can be done better. Allow me to show you a few.

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

Destructuring extracts the property from the object on the right-hand side and stores it in a variable. If the property doesn't exist, it'll still create a variable, but with the value of `undefined`. So instead of doing `config.token` in your `client.login()` method, you'd simply use `token` in its place. And since destructuring creates a variable for us, you don't even need that `const prefix = config.prefix` line. Pretty cool!

Additionally, you could even do this for your commands.

```js
client.on('message', (message) => {
	const { content } = message;

	if (content === prefix + 'ping') {
		// ping command here...
	}
	else if (content === prefix + 'beep') {
		// beep command here...
	}
	// other commands here...
});
```

It is a bit less to write out, and also looks cleaner. I wouldn't advise it, though. There's a very specific reason for that, and we'll be discussing it in one of the upcoming pages, so be sure to read through!

### Template literals

You know how you've been doing things like `prefix + 'name'` and `'Your username: ' + message.author.username`? It's a bit unpleasing to the eyes, and not too fun to constantly type out. Thankfully, there's a better alternative.

```js
// ES5 version, as we currently have it
else if (message.content === prefix + 'server') {
	message.channel.send('Guild name: ' + message.guild.name + '\nTotal members: ' + message.guild.memberCount);
}
else if (message.content === prefix + 'user-info') {
	message.channel.send('Your username: ' + message.author.username + '\nYour ID: ' + message.author.id);
}

// ES6 version, using template literals
else if (message.content === `${prefix}server`) {
	message.channel.send(`Guild name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
}
else if (message.content === `${prefix}user-info`) {
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
'with string concatination. :(');

// Template literals
console.log(`Your password is: **${password}**.`);
console.log(`Your username is: **${username}**.`);
console.log(`1 + 1 = ${1 + 1}`);
console.log(`And here's a function call: ${letsPretendThisDoesSomething()}`);
console.log(`Putting strings on new lines
				is a breeze
				with template literals! :)`);

// NOTE: Template literals will also render the indentation inside them
// but there are ways around that, which we'll discuss in another section
```

You can see the how easy and readable it makes things. ES6 has many great features similar to this one that make your code sleeker and more powerful than before. Interested in learning more? Finish up the next few pages and then check out the ES6 guide we have up! (link to be added later)