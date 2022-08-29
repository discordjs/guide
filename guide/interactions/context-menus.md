# Context Menus

Context Menus are application commands which appear on right clicking or tapping a user or a message.

::: tip
This page is a follow-up to the [interactions (slash commands) page](/interactions/slash-commands.md). Please carefully read that section first, so that you can understand the methods used in this section.
:::

## Registering context menu commands

To create a context menu you construct a new `ContextMenuCommandBuilder`. You can then set the type of the context menu (user or message) using the `setType()` method.

```js
const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

const data = new ContextMenuCommandBuilder()
	.setName('User Information')
	.setType(ApplicationCommandType.User);
```

## Receiving context menu command interactions

Context Menus are received via an interaction. You can check if a given interaction is a context menu by invoking the `isContextMenuCommand()` method, you can use the `isMessageContextMenuCommand()` and `isUserContextMenuCommand()` methods to check for the specific type of context menu interaction:

```js {2}
client.on('interactionCreate', interaction => {
	if (!interaction.isUserContextMenuCommand()) return;
	console.log(interaction);
});
```

## Extracting data from context menus

You can get the targeted user by accessing the `targetUser` or `targetMember` property from the <DocsLink path="class/UserContextMenuInteraction" />. You can get the message by accessing the `targetMessage` property from the <DocsLink path="class/MessageContextMenuInteraction" />.

```js {4}
client.on('interactionCreate', interaction => {
	if (!interaction.isUserContextMenuCommand()) return;
	// Get the User's username from context menu
	const { username } = interaction.targetUser;
	console.log(username);
});
```
