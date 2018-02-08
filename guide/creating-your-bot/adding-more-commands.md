## Adding more commands

<p class="tip">This page is a follow-up and bases its code off of [the previous page](/creating-your-bot/configuration-files).</p>

A bot with nothing but a single command would be really boring, and you probably have a bunch of command ideas floating around in your head already, right? Let's begin, then.

Here's what your message event should currently look like:

```js
client.on('message', message => {
	if (message.content === '!ping') {
		message.channel.send('Pong.');
	}
});
```

Before doing anything else, make a property to store the prefix you've configured. Instead of `const config = ...`, you can use destructuring to extract the prefix variable from the config file, and the token as well while you're at it.

```diff
- const config = require('./config.json');
+ const { prefix, token } = require('./config.json');
```

```diff
- client.login(config.token);
+ client.login(token);
```

From now on, if you change the prefix or token in your config.json file, it'll change in your bot file as well. You'll be using the prefix variable a lot soon.

<p class="tip">If you aren't familiar with some of this syntax, it may be because some of this is ES6 syntax. If it does confuse you, you should check out [this guide page](/additional-info/es6-syntax) before continuing.</p>

### Simple command structure

You already have an if statement that checks messages for a ping/pong command. Adding other command checks is just as easy; just chain an `else if` to your existing condition.

```js
if (message.content === `${prefix}ping`) {
	message.channel.send('Pong.');
}
else if (message.content === `${prefix}beep`) {
	message.channel.send('Boop.');
}
```

There are a few potential issues with this. For example, the ping command won't work if you send `!ping test`. It will only match `!ping` and nothing else. The same goes for the other command. If you want your commands to be more flexible, you can do the following:

```js
if (message.content.startsWith(`${prefix}ping`)) {
	message.channel.send('Pong.');
}
else if (message.content.startsWith(`${prefix}beep`)) {
	message.channel.send('Boop.');
}
```

Now the ping command will trigger whenever the message _starts with_ `!ping`! Sometimes this is what you want, but other times, you may want to match only exactly `!ping` - it varies from case to case, so be mindful of what you need when creating commands.

<p class="warning">Be aware that this will also match `!pingpong`, `!pinguin`, and the like. This is not a huge problem for now, so don't worry; you'll see better ways to check for commands later.</p>

### Displaying real data

Let's start displaying some real data. For now, we'll be displaying basic member/server info.

#### Server info command

Make another if statement to check for commands using `server` as the command name. You've already interacted with the Message object via `message.channel.send()`. You get the message object, access the channel it was sent in, and send a message to it. Just like how `message.channel` gives you the message's _channel_, `message.guild` gives you the message's _server_.

<p class="tip">Servers are referred to as "guilds" in the Discord API and discord.js library. Whenever you see someone say "guild", they mean server.</p>

<!-- eslint-skip -->

```js
else if (message.content === `${prefix}server`) {
	message.channel.send(`This server's name is: ${message.guild.name}`);
}
```

The code above would result in this:

![Server name command](assets/img/Zhw4lzi.png)

If you want to expand upon that command and add some more info, here's an example of what you can do:

<!-- eslint-skip -->

```js
else if (message.content === `${prefix}server`) {
	message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
}
```

That would display both the server name _and_ the amount of members in it.

![Server name and member count command](assets/img/jbVhpVm.png)

You can, of course, modify this to your liking. You may want to also display the date the server was created, or the server's region. You would do those in the same manner - use `message.guild.createdAt` or `message.guild.region`, respectively.

<p class="tip">Want a list of all the properties you can access and all the methods you can call on a server? Refer to [the discord.js documentation site](https://discord.js.org/#/docs/main/stable/class/Guild)!</p>

#### Member info command

Set up another if statement and use the command name `user-info`.

<!-- eslint-skip -->

```js
else if (message.content === `${prefix}user-info`) {
	message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
}
```

This will display the message author's **username** (not nickname, if they have one set), as well as their user ID.

![User info command](assets/img/xhnVTA0.png)

<p class="tip">`message.author` refers to the user who sent the message. For a full list of all the properties and methods for the author object (a member of the `User` class), check out [the documentation page for it](https://discord.js.org/#/docs/main/stable/class/User).</p>

And there you have it! As you can see, it's quite simple to add additional commands.

## The problem with if/else if

If you don't plan to make more than 7 or 8 commands for your bot, then using an if/else if chain is perfectly fine; it's presumably a small project at that point, so you shouldn't need to spend too much time on it. However, this isn't the case for most of us.

You probably want your bot to be feature-rich and easy to configure and develop, right? Using a giant if/else if chain won't let you achieve that, and will only hinder your development process. After you read up on [creating arguments](/creating-your-bot/commands-with-user-input), we'll be diving right into something called a "command handler" - code that makes handling commands easier and much more efficient.

Before continuing, here's a small list of reasons why you shouldn't use if/else if chains for anything that's not a small project:

* Takes longer to find a piece of code you want.
* Easier to fall victim to [spaghetti code](https://en.wikipedia.org/wiki/Spaghetti_code).
* Difficult to maintain as it grows.
* Difficult to debug.
* Difficult to organize.
* General bad practice.

In short, it's just not a good idea. But that's what this guide is for! Go ahead and read the next few pages to prevent these issues before they happen, learning new things along the way.

## Resulting code

If you want to compare your code to the code we've constructed so far, you can review it over on the GitHub repository [here](https://github.com/discordjs/guide/tree/master/code_samples/creating-your-bot/adding-more-commands).
