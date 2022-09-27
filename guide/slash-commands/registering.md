# Registering slash commands

::: tip
This page assumes you use the same file structure as our [Slash commands](/slash-commands/) section, and the scripts provides are made to function with that setup. Please carefully read those first so that you can understand the methods used in this section.

If you already have slash commands set up and deployed for your application and want to learn how to respond to them, refer to the following section on [replying to slash commands](/slash-commands/replying.md).
:::

In this section, we'll cover how to register your commands to Discord using discord.js!

## Guild commands

Slash commands can be registered in two ways; in one specific guild, or for every guild the bot is in. We're going to look at single-guild registration first, as this is a good way to develop and test your commands before a global deployment.

Your application will need the `applications.commands` scope authorized in a guild for either its global or guild slash commands to appear, and to register them in a specific guild wihtout error.

In this section, we'll be using a script to deploy our commands that is usable in conjunction with the slash command handler from the [command handling](/creating-your-bot/command-handling.md) section.

This script uses the REST module, included with discord.js, to make the necessary API calls without wasting time setting up a full Client. As there is a daily limit on command creations, we don't want to be making unnecessary deployments such as on every restart. This script is intended to be run separately, only when you need to make changes to your slash command **definitions** - you're free to modify parts such as the execute function as much as you like without redeployment. 

<!-- eslint-skip -->

```js
const { REST, Routes } = require('discord.js');
const { token } = require('./config.json');
const fs = require('node:fs');

const commands = [];
// Grab all the command files from the commands directory
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Place your client and guild ids here
const clientId = '123456789012345678';
const guildId = '876543210987654321';

// Grab the SlashCommandBuilder#toJSON() output of each command for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Prepare the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
```

## Global commands

Global application commands will be available in all the guilds your application has the `applications.commands` scope authorized, as well as in DMs by default.

To deploy global commands, you can use the same script from the [guild commands](#guild-commands) section and adjust the route in the script to `.applicationCommands(clientId)`

<!-- eslint-skip -->

```js {2}
await rest.put(
	Routes.applicationGuildCommands(clientId, guildId),
	Routes.applicationCommands(clientId),
	{ body: commands },
);
```