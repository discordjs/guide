## Additional features

The command handler we've been building so far doesn't do much aside from dynamically load and trigger commands. Those two things alone are great, but definitely not the only things we want. Before we dive into it, let's do some quick refactoring in preparation.

```diff
-	const command = message.content.slice(prefix.length).split(' ')[0].toLowerCase();
+	const commandName = message.content.slice(prefix.length).split(' ')[0].toLowerCase();
	const args = message.content.split(/ +/g).slice(1);

-	if (!client.commands.has(command)) return;
+	if (!client.commands.has(commandName)) return;
+
+	const command = client.commands.get(commandName);

	try {
-		client.commands.get(command).execute(message, args);
+		command.execute(message, args);
	}
```

In this short (but necessary) refactor, we:

1. Renamed the original `command` variable to `commandName` (to be descriptive about what it actually is, and so that we can name one of our variables as `command` later).
2. Changed the following if statement appropriately.
3. Made a variable named `command` which is the actual command object.
4. Changed the line inside the try/catch statement to use the `command` variable instead.

Now we can start adding features!

### Required arguments

For this section, we'll be using the `info.js` command as an example. If you chose to keep it, it should look like this now:

```js
module.exports = {
	execute(message, args) {
		if (!args.length) {
			return message.reply('you didn\'t provide any arguments!');
		}

		message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	},
};
```

This is fine if you only have a few commands that require arguments. However, if you plan on making a lot of commands and don't want to copy & paste that if statement each time, it'd be a smart idea to change that check into something simpler.

Here are the changes we'll be making:

```diff
+	args: true,
	execute(message, args) {
-		if (!args.length) {
-			return message.reply('you didn\'t provide any arguments!');
-		}
-
		message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	},
```

And then in your main file:

```diff
	const command = client.commands.get(commandName);
+
+	if (command.args && !args.length) {
+		return message.reply('you didn\'t provide any arguments!');
+	}
+
```

Now whenever you set `args` to `true` in one of your command files, it'll perform this check and supply feedback if necessary.

#### Expected command usage

It's good UX (user experience) to let the user know that a command requires arguments when they don't provide any (that, and it also prevents your code from breaking), but letting them know what kind of arguments are expecting is even better; it decreases confusion and increases clarity.

With that being said, here's a simple implementation of such a thing. For this example, we'll pretend we have a `!role` command, where the first argument is the user to give the role, and the 2nd argument is the name of the role to give them.

In your `role.js` file:

```diff
	args: true,
+	usage: '<user> <role>',
	execute(message, args) {
```

In your main file:

```diff
	if (command.args && !args.length) {
-		return message.reply('you didn\'t provide any arguments!');
+		let reply = 'you didn\'t provide any arguments!';
+
+		if (command.usage) {
+			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
+		}
+
+		return message.reply(reply);
	}
```

We use an if statement to check if the `usage` property exists first, so that we don't accidentaly end up with `undefined` in the reply string (in the case that we forget to properply supply the property in our command file, or some similar incident).

A simple addition like such can easily improve the end user's UX.

### Cooldowns

Spam is something you generally want to avoid - especially if one of you command requires calls to other APIs, or takes a bit of time to build/send. This is also a very common feature developers want to integrate into their bot, so let's get to working on that!

We'll be using the ping command to test this on and add in the following bit of code to it:

```diff
+	cooldown: 5,
	execute(message, args) {
```

This is the amount (in seconds) that the user will have to wait before being able to properly use that command again.

<p class="tip">We'll be using JS' native [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) global object for this. If you aren't sure what that is, you can quickly read up on that before continuing!</p>

In your main file, add in this line (preferably somewhere above your ready event):

```js
const cooldowns = new Map();
```

Again in your main file, directly above the try/catch, add in the following:

```js
if (!cooldowns.has(command.name)) {
	cooldowns.set(command.name, new Map());
}

const now = Date.now();
const timestamps = cooldowns.get(command.name);
const cooldownAmount = (command.cooldown || 3) * 1000;

if (!timestamps.has(message.author.id)) {
	// ...
}
else {
	// ...
}
```

We check if our `cooldowns` Map has the command set in it yet. If not, we add it in. Next, we create 3 variables:

1. A variable with the current timestamp.
2. A variable that `.get()`s the Map for the triggered command.
3. A variable that gets the necessary cooldown amount. If we don't supply it in our command file, it'll default to 3. We then convert it to seconds.

After that, we make a simple if/else check whether the Map has the author ID set in it yet or not.

Continuing with our current setup, inside the if statement, this is all you'll have in it:

```js
if (!timestamps.has(message.author.id)) {
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
}
```

Pretty simple, right? If the `timestamps` Map we got doesn't have our ID, we set it in with the current timestamp, and then create a `setTimeout()` to automatically delete it later, depending on that certain command's cooldown number.

Now all that's left is the else part of our statement. Here's what we'll be using:

```js
else {
	const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

	if (now < expirationTime) {
		const timeLeft = (expirationTime - now) / 1000;
		return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
}
```

Nothing overly complex here either. Since the `timestamps` Map has the author ID in it, we `.get()` it and then add the `cooldownAmount` variable to it, to get the correct expiration timestamp. We then check to see if it's actually expired or not, and return a message letting the user know how much time is left until they can use that command again if the cooldown hasn't expired. If it has, use the same code as our if statement to set the cooldown again. Easy!

### Command aliases

It's a good idea to allow users to trigger your commands in more than one way; it gives them the freedom of choosing what to send and may even make some command names easier to rememebr. Luckily, setting up aliases for your commands is quite simple.

For this bit of the guide, we'll be using the avatar command as a target. Around Discord, your profile picture is referred to as an "avatar" - however, not everyone calls it that. Some people prefer "icon" or "pfp" (profile picture). With that in mind, let's update the avatar command to allow all 3 of those triggers.

Open your `avatar.js` file and add in the following line:

```diff
module.exports = {
	name: 'avatar',
+	aliases: ['icon', 'pfp'],
```

The `aliases` property should always contain an array of strings. In your main file, here are the changes you'll need to make:

```diff
-	if (!client.commands.has(commandName)) return;
-
-	const command = client.commands.get(commandName);
+	const command = client.commands.get(commandName)
+		|| client.commands.find((cmd) => cmd.aliases.length && cmd.aliases.includes(commandName));
+
+	if (!command) return;
```

Making those two small changes, you get this:

![aliases](https://i.imgur.com/0hFEXpW.png)

And you're done!

### Conclusion 

At this point of the guide, you should now have a command handler with some very basic (but useful) features! You can now 

If you're unsure of something or just want to double check your code, here's what the final version of your main file should look like:

```js
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands');

for (let file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Map();

client.on('ready', () => {
	console.log('Ready!');
});

client.on('message', (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const commandName = message.content.slice(prefix.length).split(' ')[0].toLowerCase();
	const args = message.content.split(/ +/g).slice(1);

	const command = client.commands.get(commandName)
	|| client.commands.find((cmd) => cmd.aliases.length && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.args && !args.length) {
		let reply = 'you didn\'t provide any arguments!';
		
		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}
		
		return message.reply(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Map());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (!timestamps.has(message.author.id)) {
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}
	else {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(token);
```
