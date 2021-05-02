# Dynamic commands

::: tip
This page is a follow-up and bases its code on [the previous page](/command-handling/).
:::

## How it works

Now that you have a Collection of all our commands, you can use them quickly! But before diving straight into it, it'd be a good idea to familiarize yourself with how you'll turn these basic if statements into something much more dynamic and robust. Let's continue with one more if statement example, and then we'll move onto the real stuff.

```js {2}
if (command === 'ping') {
	client.commands.get('ping').execute(message, args);
}
```

You `.get()` the ping command and call its `.execute()` method while passing in the `message` and `args` variables as the method arguments. Instead of putting your ping command code in the if statement, you can call it directly like that instead. This version is longer than what you had before for your ping command, but commands usually aren't that short.

So, if you wanted to (assuming that you've copied & pasted all of your commands into their own files by now), this could be your entire message event:

```js {3-9}
client.on('message', message => {
	// ...
	if (command === 'ping') {
		client.commands.get('ping').execute(message, args);
	} else if (command === 'beep') {
		client.commands.get('beep').execute(message, args);
	} else if (command === 'server') {
		client.commands.get('server').execute(message, args);
	}
});
```

That would work perfectly fine, but it isn't dynamic; you'd still have to add an if statement and the same old code each time you wanted to register a new command, which is less than ideal.

## Dynamically executing commands

At this point, you can take that entire if/else if chain and delete it. Instead, you'll be replacing it with this:

```js {7-14}
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});
```

If there isn't a command with that name, exit early. If there is, `.get()` the command, call its `.execute()` method, and pass in your `message` and `args` variables as its arguments. In case something goes wrong, log the error and report back to the member to let them know.

And that's it! Whenever you want to add a new command, you make a new file in your `commands` directory, name it what you want, and then do what you did for the other commands.

In the next chapter, we'll be going through how to implement some basic features into your brand new command handler. Currently, it's hardly a command "handler" at this point; it's a command loader and executor if you wish to see it that way. You'll learn how to implement some new features and the logic behind them, such as:

* Command aliases
* Cooldowns
* Guild only commands
* A dynamic help message

## Resulting code

<resulting-code />
