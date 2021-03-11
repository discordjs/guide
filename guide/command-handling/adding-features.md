# Additional features

::: tip
This page is a follow-up and bases its code off of [the previous page](/command-handling/dynamic-commands.md).
:::

The command handler you've been building so far doesn't do much aside from dynamically load and execute commands. Those two things alone are great, but definitely not the only things you want. Before diving into it, let's do some quick refactoring in preparation.

```diff
	const args = message.content.slice(prefix.length).trim().split(/ +/);
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
2. Changed the following `if` statement appropriately.
3. Made a variable named `command` which is the actual command object.
4. Changed the line inside the `try/catch` statement to use the `command` variable instead.

Now you can start adding features!

## Command categories

So far, all of your command files are in a single `commands` folder. This is fine at first, but as your project grows, the number of files in the `commands` folder will too. Keeping track of that many files can be a little tough. To make this a little easier, you can categorize your commands and put them in sub-folders inside the `commands` folder. You will have to make a few changes to your existing code in `index.js` for this to work out.

If you've been following along, your project structure should look something like this:

![Project structure before sorting](./images/before-sorting.png)

After moving your commands into sub-folders, it will look something like this:

![Project structure after sorting](./images/after-sorting.png)

::: warning
Make sure you put every command file you have inside one of the new sub-folders. Leaving a command file directly under the `commands` folder will create problems.
:::

It is not necessary to name your sub-folders exactly like we have named them here. You can create any number of sub-folders and name them whatever you want. Although, it is a good practice to name them according to the type of commands stored inside them.

Now, go back to your main file `index.js` and add this below the `client.commands = new Discord.Collection();` line:

```js
const commandFolders = fs.readdirSync('./commands');
```

The `fs.readdirSync()` method will return an array of all the sub-folder names in the `commands` folder, e.g. `['fun', 'moderation', 'utility']`. The rest of the logic remains the same, except now you have to do it for each of the sub-folders:

```js
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}
```

That's it! When creating new files for commands, make sure you create it inside one of the sub-folders (or a new one) in the `commands` folder.

## Required arguments

For this section, we'll be using the `args-info.js` command as an example. If you chose to keep it, it should look like this now:

```js
module.exports = {
	name: 'args-info',
	description: 'Information about the arguments provided.',
	execute(message, args) {
		if (!args.length) {
			return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
		} else if (args[0] === 'foo') {
			return message.channel.send('bar');
		}

		message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	},
};
```

This is fine if you only have a few commands that require arguments. However, if you plan on making a lot of commands and don't want to copy & paste that `if` statement each time, it'd be a smart idea to change that check into something simpler.

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

### Expected command usage

It's good UX (user experience) to let the user know that a command requires arguments when they don't provide any (it also prevents your code from breaking). Letting them know what kind of arguments are expected is even better.

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

Use an `if` statement to check if the `usage` property exists (and is truthy) first, so that you don't accidentally end up with `undefined` in the reply string (in the case that you forget to properly supply the property in your command file, or some similar incident). A simple precaution such as this can greatly improve the user experience.

## Guild only commands

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
if (command.guildOnly && message.channel.type === 'dm') {
	return message.reply('I can\'t execute that command inside DMs!');
}
```

Now when you try to use the kick command inside a DM, you'll get the appropriate response which will also prevent your bot from throwing an error.

<div is="discord-messages">
	<discord-message profile="user">
		!kick
	</discord-message>
	<discord-message profile="bot">
		I can't execute that command inside DMs!
	</discord-message>
</div>

## Cooldowns

Spam is something you generally want to avoid, especially if the command in question requires you to call other APIs or takes substantial time to do background operations. We will now explain how you can introduce cooldowns into your bot to prevent users from spamming commands back to back.

First, add a cooldown key to one of your commands (we use the ping command here) exports. This determines how long the user will have to wait (in seconds) before using this specific command again.

```diff
module.exports = {
	name: 'ping',
+	cooldown: 5,
	execute(message) {
		message.channel.send('Pong.');
	},
};
```

In your main file (`index.js` in our examples), add this line preferably somewhere at the top before you handle any events:

```js
const cooldowns = new Discord.Collection();
```

This initializes an empty Collection (remember, Collection is a utility data structure, which works based on key/value pairs) which you can then fill later when commands are used. The key will be the command name and the value will be another Collection associating the user id (key) to the last time (value) this specific user used this specific command. Overall the logical path to get a specific user's last usage of a specific command will be `cooldowns > command > user > timestamp`.

In your main file, directly above the `try/catch` block causing command execution, add in the following:

```js
if (!cooldowns.has(command.name)) {
	cooldowns.set(command.name, new Discord.Collection());
}

const now = Date.now();
const timestamps = cooldowns.get(command.name);
const cooldownAmount = (command.cooldown || 3) * 1000;

if (timestamps.has(message.author.id)) {
	// ...
}
```

You check if the `cooldowns` Collection already has an entry for the command being used right now. If this is not the case, add a new entry, where the value is initialized as an empty Collection. Next, 3 variables are created:

1. `now`: The current timestamp.
2. `timestamps`: A reference to the Collection of user-ID and timestamp key/value pairs for the triggered command.
3. `cooldownAmount`: The specified cooldown from the command file, converted to milliseconds for straightforward calculation. If none is specified this defaults to three seconds.

If the author has already used this command in this session, get the timestamp, calculate the expiration time and inform the user of the amount of time they need to wait before being able to use this command again. Note that you use a `return` statement here, causing the code below this snippet to only execute if the message author has not used this command in this session or the wait has already expired.

Continuing with your current setup, this is the complete `if` statement:

```js
if (timestamps.has(message.author.id)) {
	const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

	if (now < expirationTime) {
		const timeLeft = (expirationTime - now) / 1000;
		return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
	}
}
```

If the `timestamps` Collection doesn't have the message author's ID, use `.set()` to add an entry to your Collection. The key will be the author's ID, the value the current timestamp. This reflects "now" to be the last time this user used this command, which you can look up later and start the whole cooldown check cycle again.

The previous author check serves as a precaution and should normally not be necessary, as you will now insert a short piece of code causing the author's entry to be deleted after the cooldown has expired. To facilitate this you will use the node.js `setTimeout` method, which allows you to execute a function after a specified amount of time:

```js
// if (timestamps.has(message.author.id)) {
// ...
// }
timestamps.set(message.author.id, now);
setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
```

This line causes the entry for the message author under the specified command to be deleted after the command's cooldown time is expired for this user.

## Command aliases

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

<div is="discord-messages">
	<discord-message profile="user">
		!avatar <mention :highlight="true" profile="user" />
	</discord-message>
	<discord-message profile="bot">
		User's avatar:
		<a href="https://cdn.discordapp.com/avatars/328037144868290560/1cc0a3b14aec3499632225c708451d67.png" target="_blank" rel="noreferrer noopener">https://cdn.discordapp.com/avatars/328037144868290560/1cc0a3b14aec3499632225c708451d67.png</a>
		<br />
		<img src="https://cdn.discordapp.com/avatars/328037144868290560/1cc0a3b14aec3499632225c708451d67.png" alt="" />
	</discord-message>
	<discord-message profile="user">
		!icon <mention :highlight="true" profile="user" />
	</discord-message>
	<discord-message profile="bot">
		User's avatar:
		<a href="https://cdn.discordapp.com/avatars/328037144868290560/1cc0a3b14aec3499632225c708451d67.png" target="_blank" rel="noreferrer noopener">https://cdn.discordapp.com/avatars/328037144868290560/1cc0a3b14aec3499632225c708451d67.png</a>
		<br />
		<img src="https://cdn.discordapp.com/avatars/328037144868290560/1cc0a3b14aec3499632225c708451d67.png" alt="" />
	</discord-message>
</div>

## A dynamic help command

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
const { prefix } = require('../../config.json');
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

::: tip
If you weren't already aware, `.send()` takes 2 parameters: the content to send, and the message options to pass in. You can read about the `MessageOptions` type <branch version="11.x" inline>[here](https://discord.js.org/#/docs/main/v11/typedef/MessageOptions)</branch><branch version="12.x" inline>[here](https://discord.js.org/#/docs/main/stable/typedef/MessageOptions)</branch>. Using `split: true` here will automatically split our help message into 2 or more messages in the case that it exceeds the 2,000 character limit.
:::

::: tip
Because the `data` variable is an array, you can take advantage of discord.js' functionality where it will `.join()` any array sent with a `\n` character. If you prefer to not rely on that in the chance that it changes in the future, you can simply append `.join('\n')` to the end of that yourself.
:::

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

<div is="discord-messages">
	<discord-message profile="user">
		!help
	</discord-message>
	<discord-message profile="bot">
		Here's a list of all my commands:
		args-info, avatar, beep, help, kick, ping, prune, server, user-info	<br>
		You can send `!help [command name]` to get info on a specific command!
	</discord-message>
	<discord-message profile="user">
		!help avatar
	</discord-message>
	<discord-message profile="bot">
		<strong>Name:</strong> avatar <br>
		<strong>Aliases:</strong> icon,pfp <br>
		<strong>Description:</strong> Get the avatar URL of the tagged user(s), or your own avatar. <br>
		<strong>Cooldown:</strong> 3 second(s)
	</discord-message>
</div>

No more manually editing your help command! If you aren't completely satisfied with how it looks, you can always adjust it to your liking later.

::: tip
If you want to add categories or other information to your commands you can simply add properties reflecting it to your `module.exports`. If you only want to show a subset of commands remember that `commands` is a Collection you can <branch version="11.x" inline>[filter](https://discord.js.org/#/docs/main/v11/class/Collection?scrollTo=filter)</branch><branch version="12.x" inline>[filter](https://discord.js.org/#/docs/collection/master/class/Collection?scrollTo=filter)</branch> to fit your specific needs!
:::

## Command permissions

In this section you will be adding permission requirements to the command handler we established so far. To do so you need to add at a `permissions` key to your existing command options. We will use the 'kick' command to demonstrate:

```diff
module.exports = {
	name: 'kick',
	description: 'Kick a user from the server.',
	guildOnly: true,
+	permissions: 'KICK_MEMBERS',
	execute(message, args) {
		// ...
	},
};
```

You also need to check for those permissions before executing the command, which is done in the main file, as shown below. We use `TextChannel#permissionsFor` in combination with `Permissions#has` rather than `Guildmember#hasPermission` to respect permission overwrites in our check.

```diff
// ...
if (command.guildOnly && message.channel.type === 'dm') {
	return message.reply('I can\'t execute that command inside DMs!');
}

+ if (command.permissions) {
+ 	const authorPerms = message.channel.permissionsFor(message.author);
+ 	if (!authorPerms || !authorPerms.has(command.permissions)) {
+ 		return message.reply('You can not do this!');
+ 	}
+ }

if (command.args && !args.length) {
// ...
```

Your command handler will now refuse to execute commands if the permissions you specify in the command structure are missing from the member trying to use it. Note that the `ADMINISTRATOR` permission as well as the message author being the owner of the guild will overwrite this.

::: tip
Need more resources on how Discord's permission system works? Check the [permissions article](/popular-topics/permissions.html), [extended permissions knowledge base](/popular-topics/permissions-extended.html) and documentation of <branch version="11.x" inline>[permission flags](https://discord.js.org/#/docs/main/v11/class/Permissions?scrollTo=s-FLAGS)</branch><branch version="12.x" inline>[permission flags](https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS)</branch> out! 
:::

## Reloading commands

When writing your commands, you may find it tedious to restart your bot every time you want to test even the slightest change in your code. However, if you have a command handler, reloading commands can be done with a single bot command.

Create a new command file and paste in the usual format with a slight change:

```js
const fs = require('fs');

module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	execute(message, args) {
		// ...
	},
};
```

In this command, you will be using a command name or alias as the only argument. First off, you need to check if the command you want to reload exists. This can be done in a similar fashion as getting a command in your main file.  
Note that you can skip the first line if you use the [argument checker](/command-handling/adding-features.html#required-arguments) from above:

```js
if (!args.length) return message.channel.send(`You didn't pass any command to reload, ${message.author}!`);
const commandName = args[0].toLowerCase();
const command = message.client.commands.get(commandName)
	|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
```

::: tip
A lot of library specific structures have `client` as a property. That means you don't have to pass the client reference as a parameter to commands to access for example `client.guilds` or `client.commands`, but can directly access the respective properties directly from the `message` object, as shown in the snippet above.
:::

In order to build the correct file path, you will need the file name and the sub-folder the command belongs to. For the file name, you can use `command.name`. To find the sub-folder name, you will have to loop through the commands sub-folders and check whether the command file is in that folder or not. You can do that by using `Array.includes()` on the file names array of each sub-folder. 

```js
const commandFolders = fs.readdirSync('./commands');
const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${commandName}.js`));
```

Now, in theory, all there is to do, is to delete the previous command from `client.commands` and require the file again. In practice though, you cannot do this that easily as `require()` caches the file. If you were to require it again, you would simply load the previously cached file without any of your changes. In order to remove the file from the cache, you need to add the following line to your code:

```js
delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];
```

After removing the command from the cache, all you have to do is require the file again and add the freshly loaded command to `client.commands`:

```js
try {
	const newCommand = require(`../${folderName}/${command.name}.js`);
	message.client.commands.set(newCommand.name, newCommand);
} catch (error) {
	console.error(error);
	message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
}
```

The snippet above uses a `try/catch` block to load the command file and add it to `client.commands`. In case of an error it will log the full error to console and notify the user about it with the error's message component `error.message`. Note the you never actually delete the command from the commands collection, and instead just overwrite it. This prevents you from deleting a command, and ending up with no command at all after a failed `require()` call, as each use of the reload command checks that collection again.

The last slight improvement you might want to add to the try block is sending a message if the reload was successful:

```js
message.channel.send(`Command \`${command.name}\` was reloaded!`);
```

## Conclusion 

At this point of the guide, you should now have a command handler with some very basic (but useful) features! If you see fit, you can expand upon the current structure to make something even better and easier for you to use in the future.

## Resulting code

<resulting-code />
