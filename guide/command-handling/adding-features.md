## Additional features

The command handler we've been building so far doesn't do much aside from dynamically load and execute commands. Those two things alone are great, but definitely not the only things we want. Before we dive into it, let's do some quick refactoring in preparation.

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
	name: 'info',
	description: 'Information about the arguments provided.',
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

It's good UX (user experience) to let the user know that a command requires arguments when they don't provide any (that, and it also prevents your code from breaking). With that being said, letting them know what kind of arguments are expecting is even better.

Here's a simple implementation of such a thing. For this example, we'll pretend we have a `!role` command, where the first argument is the user to give the role, and the 2nd argument is the name of the role to give them.

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

We use an if statement to check if the `usage` property exists (and is truthy) first, so that we don't accidentaly end up with `undefined` in the reply string (in the case that we forget to properply supply the property in our command file, or some similar incident). A simple addition like such can easily improve the end user's UX.

### Guild only commands

Some commands are meant to be used only inside servers and won't work whatsoever in DMs. A prime example of this would be a kick command. You can add a property to the necessary commands to determine whether or not it should be only available outside of servers.

In the kick command we created in an earlier chapter, make the following changes:

```diff
module.exports = {
	name: 'kick',
	description: 'Kick a user from the server.',
+	guildOnly: true,
```

And in your main file, above the args checking line, add this in:

```js
if (command.guildOnly && message.channel.type !== 'text') {
	return message.reply('I can\'t execute that command inside DMs!');
}
```

Now when you try to use the kick command, you'll get the appropriate response which will also prevent your bot from throwing an errors.

![guild command inside DMs](https://i.imgur.com/TiDpsVH.png)

### Cooldowns

Spam is something you generally want to avoid - especially if one of you command requires calls to other APIs, or takes a bit of time to build/send. This is also a very common feature bot developers want to integrate into their projects, so let's get started on that!

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
3. A variable that gets the necessary cooldown amount. If we don't supply it in our command file, it'll default to 3. We then convert it to the proper amount of milliseconds.

After that, we make a simple if/else statement to check whether the Map has the author ID set in it yet or not.

Continuing with our current setup, inside the if statement, this is all you'll have in it:

```js
if (!timestamps.has(message.author.id)) {
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
}
```

If the `timestamps` Map we got doesn't have our ID, we set it in with the current timestamp, and then create a `setTimeout()` to automatically delete it later, depending on that certain command's cooldown number.

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
+		|| client.commands.find(cmd => cmd.aliases.length && cmd.aliases.includes(commandName));
+
+	if (!command) return;
```

Making those two small changes, you get this:

![aliases](https://i.imgur.com/0hFEXpW.png)

### A dynamic help command

If you don't use a framework or command handler for your projects, you'll have a tough time setting up an always up-to-date help command. Luckily, that's not the case here. Start by creating a new command file inside your `commands` folder and populate it as your normally would.

```js
module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
		// ...
	},
};
```

We're gonna need our prefix variable a couple times inside this command, we let's require that at the very top of our file (outside of the `module.exports` bit).

```js
const { prefix } = require('../config.json');
```

Inside the `execute()` function, let's set up some variables and an if/else statement to determine whether we should display a list of all the command names, or only information about a specific command.

```js
const { commands } = message.client;
const data = [];

if (!args.length) {
	// ...
}
else {
	// ...
}
```

We'll use `.push()` on the `data` variable to append the info we want and then DM it to the message author once we're done.

Inside the if statement, this is all you'll need:

```js
data.push('Here\'s a list of all my commands:');
data.push(commands.map(command => command.name).join(', '));
data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
```

There's nothing really complex here; all we do is append some strings, `.map()` over the `commands` Collection, and add an additional string to let the user know how to trigger information about a specific command.

Inside the else bit, it is a bit more code, but not too much.

```js
if (!commands.has(args[0])) {
	return message.reply('that\'s not a valid command!');
}

const command = commands.get(args[0]);

data.push(`**Name:** ${command.name}`);

if (command.description) data.push(`**Description:** ${command.description}`);
if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
```

First we check to see if that command name even exists inside our Collection. If it does, we `.get()` it and then start `.push()`ing what we need into the `data` variable. Not all commands will have descriptions, aliases, or usage strings, so we use an if statement for each of those to append them conditionally.

Last but not least, we need to send the message back to the user. Since help messages can get messy, we'll be DMing it to the message author instead of posting it in the requested channel. However, there is something very important we should consider: the possibility of not being able to DM the user, whether it be that they have DMs disabled on that server or overall, or they have the bot blocked.

For that, we'll be using the `.catch()` method at the end of it all.

```js
message.author.send(data, { split: true })
	.then(() => {
		if (message.channel.type !== 'dm') {
			message.channel.send('I\'ve sent you a DM with all my commands!');
		}
	})
	.catch(() => message.reply('it seems like I can\'t DM you!'));
```

Because our `data` variable is an array, we can take advantage of discord.js' functionality where it will `.join()` any array sent with a `\n` character. If you prefer to not rely on that in the off-chance that it changes in the future, you can simply append `.join('\n')` to the end of that yourself.

If you weren't already away, `.send()` takes 2 parameters: the content to send, and the message options to pass in. You can read about the MessageOptions type [here](https://discord.js.org/#/docs/main/stable/typedef/MessageOptions). Using `split: true` here will automatically split our help message into 2 or more messages in the case that it reaches the 2,000 character limit.

The only thing we use `.then()` here for is to let them know when we're done sending (but only if we're not already inside a DM, or else we'd be sending another unnecessary message).

At the end of it all, you should be getting this as a result:

![help commands](https://i.imgur.com/f5T9OyI.png)

No more manually editing your help command! If you aren't completely satisfied with how it looks, you can always adjust it to your liking later.

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

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const commandName = message.content.slice(prefix.length).split(' ')[0].toLowerCase();
	const args = message.content.split(/ +/g).slice(1);

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases.length && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

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
