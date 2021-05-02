---
pageTheme: blue
---

# Getting started with Commando

When you got your first bot up and running, you should've installed discord.js using npm, Node.js' Package Manager. The same applies to Commando, which you must separately install. You can do this in one of two ways:

If using discord.js v12: `npm install discord.js-commando`  
If using master: `npm install discordjs/Commando`

::: warning
You need at least Node.js version <branch version="11.x" inline>8.0.0</branch><branch version="12.x" inline>12.0</branch> to use Commando.
:::

## Creating your index.js file

While it doesn't have to be called `index.js`, this file is the main file for your bot, which handles everything from registering new commands to logging in your client.

The first thing you have to do is require Commando. Contrary to what you may think, you do **not** need to require discord.js to use Commando. Commando handles all discord.js-related functions within itself, and the Commando client extends discord.js', so you'll rarely ever have to touch core discord.js!

You'll also be requiring `path`. You don't need to install it; it comes bundled with Node.

```js
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
```

The next step is to create a new CommandoClient. There are also a few options you will need to set.

```js
const client = new CommandoClient({
	commandPrefix: '?',
	owner: '278305350804045834',
	invite: 'https://discord.gg/bRCvFy9',
});
```

In the `commandPrefix` parameter, you should insert the prefix you intend to use for your bot. As of writing, you can only have one, so choose wisely! However, note that mentioning your bot will **always** be allowed alongside the prefix you set here. In other words, this prefix and mentions are how your users will call your bot. **No, there is no way to disable mentions being a prefix!**

After that is the `owner` parameter, which should contain the bot's owner's ID; it can be either a string of one ID or an array of many.

::: danger
The users you set here have complete control over the bot. They can use eval and other owner-only commands, ignore command throttling, and bypass all user permissions! Be sure to only give this to people you trust!
:::

The final option, `invite`, is the **full** invite URL to your bot's support server. While not a required option, it's a good idea to have a support server on hand to handle questions and concerns your users may have about your bot if it is public. If not, it's safe to leave this option out.

Next, you're going to register the command groups, args types, and default commands. Then, you register the commands in a folder. You can name the folder whatever you want, but we recommend sticking with `commands`, as it makes the most sense.

```js
client.registry
	.registerDefaultTypes()
	.registerGroups([
		['first', 'Your First Command Group'],
		['second', 'Your Second Command Group'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, 'commands'));
```

You've just created your first command group! Make another folder called `first` in your `commands` folder so that you can put the commands for that group in there. The group will display in the help command as `Your First Command Group`. You can use any name you want for either of these options, but note that the key (`first`) **must be lowercase**!

Adding more command groups is as simple as adding another option to the array and making another folder.

```js {6}
client.registry
	// ...
	.registerGroups([
		['first', 'Your First Command Group'],
		['second', 'Your Second Command Group'],
		['third', 'Your Third Command Group'],
	]);
```

Should you want to disable a default command, such as if you wanted to make a custom help command and replace the default one, you could pass that as an option in `registerDefaultCommands`.

```js {3-5}
client.registry
	// ...
	.registerDefaultCommands({
		help: false,
	});
```

Next, you're going to need to create a ready event and an error event, as usual.

```js
client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity('with Commando');
});

client.on('error', console.error);
```

This will send a message to your console when the bot is ready and set the bot's playing status to "with Commando". You can set both to whatever you wish.

Last but certainly not least, log the bot in.

```js
client.login('your-token-goes-here');
```

::: danger
You should use environment variables or a `config.json` for your token instead of passing it directly!
:::

And there you have it! You've set up your `index.js` file! In the end, your file structure should look like this, along with whatever `.gitignore` or `config.json` you may have:

```
.
├── commands/
│   └── first/
├── index.js
└── package.json
```

## Resulting code

<resulting-code />
