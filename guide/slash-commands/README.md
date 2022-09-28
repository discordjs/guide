# Creating commands

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
</DiscordMessages>

Discord allows developers to register [slash commands](https://discord.com/developers/docs/interactions/application-commands), which provide users a first-class way of interacting directly with your application. 

In comparison to the old method in which bots would check for messages starting with a specific prefix and manually parse all the content, slash commands provide a huge number of benefits including:

- Integration with the Discord client interface.
- Automatic command detection and parsing of the associated options/arguments.
- Typed argument inputs for command options, e.g. "String", "User", or "Role".
- Validated or dynamic choices for command options.
- In-channel private responses (ephemeral messages).
- Pop-up form-style inputs for capturing additional information.

...and many more!

## Before you continue

Assuming you've followed the [Creating your bot](/creating-your-bot/) section of this guide so far, your project directory should look something like this:

```:no-line-numbers
discord-bot/
├── node_modules
├── config.json
├── index.js
├── package-lock.json
└── package.json
```

To go from this starter code to fully functional slash commands, there are four pieces of code that need to be written. They are:

1. The individual command files, containing their defintions and functionality.
2. The command loader, which reads those files and stores them ready for execution in your bot.
3. The command deployment script, to register your slash commands with Discord so they appear in the interface.
4. Command and event handling for the `interactionCreate` event, to receive and reply to command interactions.

These steps can really be done in any order, but all are required before the commands are fully functional. This section of the guide will use the order listed above. So let's get started!

## Indivdual command files

Create a new folder named `commands`, which is where you'll store all of your command files. You'll be using the <DocsLink section="builders" path="class/SlashCommandBuilder"/> class to construct the command definitions.

At a minimum, the definition of a slash command must have a name and a description. Using the builder, a simple `ping` command definition would look like this:

```js
new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Replies with Pong!');
```

Create a `commands/ping.js` file for your first command. In it, you're going to define two items.
- The `data` property, which will provide the command definition shown above for registering to Discord.
- An `execute` method, which will contain the functionality to run from our event handler when the command is used.

Put these inside `module.exports` so they can be read by other files; namely the command loader and command deployment scripts mentioned earlier.

```js
// commands/ping.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
```

::: tip
[`module.exports`](https://nodejs.org/api/modules.html#modules_module_exports) is how you export data in Node.js so that you can [`require()`](https://nodejs.org/api/modules.html#modules_require_id) it in other files.

If you need to access your client instance from inside a command file, you can access it via `interaction.client`. If you need to access external files, packages, etc., you should `require()` them at the top of the file.
:::

## Next steps

You can make additional commands by creating additional files in the `commands` folder. A few more commands will be introduced throughout the guide, so for now let's move on and have your main application load the command files so they're prepared for incoming interactions.