# Registering slash commands

::: tip
This page assumes you use the same file structure as our [Slash commands](/slash-commands/) section, and the scripts provides are made to function with that setup. Please carefully read those first so that you can understand the methods used in this section.

If you already have slash commands set up and deployed for your application and want to learn how to respond to them, refer to the following section on [replying to slash commands](/slash-commands/replying.md).
:::

In this section, we'll cover how to register your commands to Discord using discord.js!

## Command registration

Slash commands can be registered in two ways; in one specific guild, or for every guild the bot is in. We're going to look at single-guild registration first, as this is a good way to develop and test your commands before a global deployment.

Your application will need the `applications.commands` scope authorized in a guild for either its global or guild slash commands to appear, and to register them in a specific guild wihtout error.

Slash commands only need to be registered once, and updated when the definition (description, options etc) is changed. As there is a daily limit on command creations, it's not necessary nor desirable to connect a whole client to the gateway or do this on every `ready` event. As such, a standalone script using the lighter REST manager is preferred. 

This script is intended to be run separately, only when you need to make changes to your slash command **definitions** - you're free to modify parts such as the execute function as much as you like without redeployment. 

### Guild commands

Create a `deploy-commands.js` file in your project directory. This file will be used to register and update the slash commands for your bot application.

Add two more properties to your `config.json` file, which we'll need in the deployment script:

- `clientId`: Your application's client id
- `guildId`: Your development server's id

```json
{
	"token": "your-token-goes-here",
	"clientId": "123456789012345678",
	"guildId": "876543210987654321",
}
```

With these defined, you can use the deployment script below:

<!-- eslint-skip -->

```js
const { REST, Routes } = require('discord.js');
const { token } = require('./config.json');
const fs = require('node:fs');

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Place your client and guild ids here
const clientId = '123456789012345678';
const guildId = '876543210987654321';

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
```

Once you fill in these values, run `node deploy-commands.js` in your project directory to register your commands to the guild specified. If you see the success message, check for the commands in the server by typing `/`! If all goes well, you should be able to run them and see your bot's response in Discord!

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
</DiscordMessages>

### Global commands

Global application commands will be available in all the guilds your application has the `applications.commands` scope authorized, as well as in DMs by default.

To deploy global commands, you can use the same script from the [guild commands](#guild-commands) section and simply adjust the route in the script to `.applicationCommands(clientId)`

<!-- eslint-skip -->

```js {2}
await rest.put(
	Routes.applicationCommands(clientId),
	{ body: commands },
);
```

::: tip
Deploying global commands does not replace guild-deployed commands. Before deploying global commands, you'll probably want to run the guild deployment script again with an empty array to clear them out and avoid duplicates.
:::

#### Further reading

You've successfully sent a response to a slash command! However, this is only the most basic of command event and response functionality. Much more is available to enhance the user experience including:

* applying this same dynamic, modular handling approach to events with an [Event handler](/creating-your-bot/event-handling.md).
*	utilising the different [Response methods](/slash-commands/response-methods.md) that can be used for slash commands.
* expanding on these examples with additional validated option types in [Advanced command creation](/slash-commands/advanced-creation.md).
* adding formatted [Embeds](/popular-topics/embeds.md) to your responses
* furthering the command functionality with [Buttons](/interactions/buttons) and [Select Menus](/interactions/select-menus.md)
* prompting the user for more information with [Modals](/interactions/modals.md)

#### Resulting code

<ResultingCode path="creating-your-bot/command-deployment" />