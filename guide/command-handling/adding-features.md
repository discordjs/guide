## Additional features

<tip>This page is a follow-up and bases its code off of [the previous page](/command-handling/dynamic-commands).</tip>

The command handler you've been building so far doesn't do much aside from dynamically load and execute commands. Those two things alone are great, but definitely not the only things you want. Before diving into it, let's do some quick refactoring in preparation.

```diff
	const args = message.content.slice(prefix.length).split(/ +/);
-	const command = args.shift().toLowerCase();
+	const commandName = args.shift().toLowerCase();

-	if (!client.commands.has(command)) return;
+	if (!client.commands.has(commandName)) return;
+
+	const command = client.commands.get(commandName);

	try {
-		client.commands.get(command).execute(message, args);
+		command.execute(message, args);
	}
```

In this short (but necessary) refactor, you:

1. Renamed the original `command` variable to `commandName` (to be descriptive about what it actually is, and so that you can name one of our variables as `command` later).
2. Changed the following if statement appropriately.
3. Made a variable named `command` which is the actual command object.
4. Changed the line inside the try/catch statement to use the `command` variable instead.

Now you can start adding features!

### Required arguments

For this section, we'll be using the `args-info.js` command as an example. If you chose to keep it, it should look like this now:

```js
module.exports = {
	name: 'args-info',
	description: 'Information about the arguments provided.',
	execute(message, args) {
		if (!args.length) {
			return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
		}
		else if (args[0] === 'foo') {
			return message.channel.send('bar');
		}

		message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	},
};
```

This is fine if you only have a few commands that require arguments. However, if you plan on making a lot of commands and don't want to copy & paste that if statement each time, it'd be a smart idea to change that check into something simpler.

Here are the changes you'll be making:

```diff
+	args: true,
	execute(message, args) {
-		if (!args.length) {
-			return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
-		}
-		else if (args[0] === 'foo') {
+		if (args[0] === 'foo') {
			return message.channel.send('bar');
		}
		
		message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	},
```

And then in your main file:

```diff
	const command = client.commands.get(commandName);
+
+	if (command.args && !args.length) {
+		return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
+	}
+
```

Now whenever you set `args` to `true` in one of your command files, it'll perform this check and supply feedback if necessary.

#### Expected command usage

It's good UX (user experience) to let the user know that a command requires arguments when they don't provide any (that, and it also prevents your code from breaking). With that being said, letting them know what kind of arguments are expecting is even better.

Here's a simple implementation of such a thing. For this example, pretend you have a `!role` command, where the first argument is the user to give the role, and the second argument is the name of the role to give them.

In your `role.js` file:

```diff
	args: true,
+	usage: '<user> <role>',
	execute(message, args) {
```

In your main file:

```diff
	if (command.args && !args.length) {
-		return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
+		let reply = `You didn't provide any arguments, ${message.author}!`;
+
+		if (command.usage) {
+			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
+		}
+
+		return message.channel.send(reply);
	}
```

Use an if statement to check if the `usage` property exists (and is truthy) first, so that you don't accidentally end up with `undefined` in the reply string (in the case that you forget to properly supply the property in our command file, or some similar incident). A simple addition like such can easily improve the end user's UX.

### Guild only commands

Some commands are meant to be used only inside servers and won't work whatsoever in DMs. A prime example of this would be a kick command. You can add a property to the necessary commands to determine whether or not it should be only available outside of servers.

In the kick command you created in an earlier chapter, make the following changes:

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

Now when you try to use the kick command inside a DM, you'll get the appropriate response which will also prevent your bot from throwing an error.

![guild command inside DMs](assets/img/TiDpsVH.png)

### Cooldowns

Spam is something you generally want to avoid - especially if one of you command requires calls to other APIs, or takes a bit of time to build/send. This is also a very common feature bot developers want to integrate into their projects, so let's get started on that!

We'll be using the ping command to test this on. Add in the following bit of code:

```diff
module.exports = {
	name: 'ping',
+	cooldown: 5,
	execute(message) {
		message.channel.send('Pong.');
	},
};
```

This is the amount (in seconds) that the user will have to wait before being able to properly use that command again. You'll be using Collections again to store what you need.

In your main file, add in this line (preferably somewhere above your ready event):

```js
const cooldowns = new Discord.Collection();
```

Again in your main file, directly above the try/catch, add in the following:

```js
if (!cooldowns.has(command.name)) {
	cooldowns.set(command.name, new Discord.Collection());
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

You check if the `cooldowns` Collection has the command set in it yet. If not, then add it in. Next, 3 variables are created:

1. A variable with the current timestamp.
2. A variable that `.get()`s the Collection for the triggered command.
3. A variable that gets the necessary cooldown amount. If you don't supply it in our command file, it'll default to 3. Afterwards, convert it to the proper amount of milliseconds.

After that, create a simple if/else statement to check if the Collection has the author ID in it yet or not.

Continuing with your current setup, inside the if statement, this is all you'll have in it:

```js
if (!timestamps.has(message.author.id)) {
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
}
```

If the `timestamps` Collection doesn't have the message author's ID, set it in with the current timestamp and create a `setTimeout()` to automatically delete it later, depending on that command's cooldown number.

Now all that's left is the else part of our statement. Here's what you'll be using:

<!-- eslint-skip -->

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

Nothing overly complex here either. Since the `timestamps` Collection has the author ID in it, you `.get()` it and then sum it up with the `cooldownAmount` variable, in order to get the correct expiration timestamp. You then check to see if it's actually expired or not, and return a message letting the user know how much time is left until they can use that command again if the cooldown hasn't expired. If it has, use the same code as the if statement to set the cooldown again.

### Command aliases

It's a good idea to allow users to trigger your commands in more than one way; it gives them the freedom of choosing what to send and may even make some command names easier to remember. Luckily, setting up aliases for your commands is quite simple.

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
+		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
+
+	if (!command) return;
```

Making those two small changes, you get this:

![aliases](assets/img/0hFEXpW.png)

### A dynamic help command

If you don't use a framework or command handler for your projects, you'll have a tough time setting up an always up-to-date help command. Luckily, that's not the case here. Start by creating a new command file inside your `commands` folder and populate it as you normally would.

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

You're going to need your prefix variable a couple times inside this command, so make sure to require that at the very top of the file (outside of the `module.exports` bit).

```js
const { prefix } = require('../config.json');
```

Inside the `execute()` function, set up some variables and an if/else statement to determine whether it should display a list of all the command names or only information about a specific command.

```js
const data = [];
const { commands } = message.client;

if (!args.length) {
	// ...
}

// ...
```

You can use `.push()` on the `data` variable to append the info you want and then DM it to the message author once you're done.

Inside the if statement, this is what you'll need:

```js
data.push('Here\'s a list of all my commands:');
data.push(commands.map(command => command.name).join(', '));
data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

return message.author.send(data, { split: true })
	.then(() => {
		if (message.channel.type === 'dm') return;
		message.reply('I\'ve sent you a DM with all my commands!');
	})
	.catch(error => {
		console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
		message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
	});
```

There's nothing really complex here; all you do is append some strings, `.map()` over the `commands` Collection, and add an additional string to let the user know how to trigger information about a specific command.

Since help messages can get messy, you'll be DMing it to the message author instead of posting it in the requested channel. However, there is something very important you should consider: the possibility of not being able to DM the user, whether it be that they have DMs disabled on that server or overall, or they have the bot blocked. For that reason, you should `.catch()` it and let them know.

<tip>If you weren't already aware, `.send()` takes 2 parameters: the content to send, and the message options to pass in. You can read about the `MessageOptions` type [here](https://discord.js.org/#/docs/main/stable/typedef/MessageOptions). Using `split: true` here will automatically split our help message into 2 or more messages in the case that it exceeds the 2,000 character limit.</tip>

<tip>Because the `data` variable is an array, you can take advantage of discord.js' functionality where it will `.join()` any array sent with a `\n` character. If you prefer to not rely on that in the chance that it changes in the future, you can simply append `.join('\n')` to the end of that yourself.</tip>

Below the `if (!args.length)` statement is where you'll send the help message for the command they specified.

```js
const name = args[0].toLowerCase();
const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

if (!command) {
	return message.reply('that\'s not a valid command!');
}

data.push(`**Name:** ${command.name}`);

if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
if (command.description) data.push(`**Description:** ${command.description}`);
if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

message.channel.send(data, { split: true });
```

Once you get the command based off the name or alias they gave, you can start `.push()`ing what you need into the `data` variable. Not all commands will have descriptions, aliases, or usage strings, so you use an if statement for each of those to append them conditionally. After that, send back all the relevant information.

At the end of it all, you should be getting this as a result:

![help commands](assets/img/f5T9OyI.png)

No more manually editing your help command! If you aren't completely satisfied with how it looks, you can always adjust it to your liking later.

### Conclusion 

At this point of the guide, you should now have a command handler with some very basic (but useful) features! If you see fit, you can expand upon the current structure to make something even better and easier for you to use in the future.

## Resulting code

If you want to compare your code to the code we've constructed so far, you can review it over on the GitHub repository [here](https://github.com/discordjs/guide/tree/master/code-samples/command-handling/adding-features).
