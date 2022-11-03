# Select menus

Select menus are one of the `MessageComponent` classes, which can be sent via messages or interaction responses.

::: tip
This page is a follow-up to the [slash commands](/slash-commands/advanced-creation.md) section and [action rows](/message-components/action-rows.md) page. Please carefully read those pages first so that you can understand the methods used here.
:::

## String select menus

The "standard" and most customizable type of select menu is the string select menu. To create a string select menu, use the <DocsLink section="builders" path="class/StringSelectMenuBuilder"/> and <DocsLink section="builders" path="class/StringSelectMenuOptionBuilder"/> classes. Then, place the menu inside an action row, and send it in the `components` array of your reply. Remember that each select menu will take up a whole row.

If you're a Pokemon fan, you've probably made a selection pretty similar to this example at some point in your life!

```js {1,6-25,29}
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	// data: new SlashCommandBuilder()...
	async execute(interaction) {
		const select = new StringSelectMenuBuilder()
			.setCustomId('starter')
			.setPlaceholder('Make a selection!')
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('Bulbasaur')
					.setDescription('The grass/poison type Seed Pokemon.')
					.setValue('bulbasaur'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Charmander')
					.setDescription('The fire type Lizard Pokemon.')
					.setValue('charmander'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Squirtle')
					.setDescription('The water type Tiny Turtle Pokemon.')
					.setValue('squirtle'),
			);

		const row = new ActionRowBuilder()
			.addComponents(select);

		await interaction.reply({
			content: 'Choose your starter!',
			components: [row],
		});
	},
};
```

::: tip
The custom id is a developer-defined string of up to 100 characters. Use this field to ensure you can uniquely define all incoming interactions from your select menus!
:::

<!-- TODO: Update this section with a new image. Or make a component, idk
Restart your bot and then send the command to a channel your bot has access to. If all goes well, you should see something like this:

vue-discord-message doesn't yet have support for select menus
<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
</DiscordMessages>

![select](./images/select.png)
-->

### String select menu options

String select menu options are custom-defined by the user, as shown in the example above. At a minimum, each option must have it's `label` and `value` defined. The label is shown to the user, while the value is included in the interaction sent to the bot.

In addition to these, each option can be enhanced with a `description` or `emoji`, or can be set to be selected by default.

```js{4-9}
const select = new StringSelectMenuBuilder()
	.setCustomId('select')
	.addOptions(
		new StringSelectMenuOptionBuilder()
			.setLabel('Option')
			.setValue('option')
			.setDescription('A selectable option')
			.setEmoji('123456789012345678')
			.setDefault(true),
	);
```

## Auto-populating select menus

Although the String select menu with it's user-defined options is the most customizable, there are four other types of select menu that auto-populate with their corresponding Discord entities, much like slash command options. These are:

- <DocsLink section="builders" path="class/UserSelectMenuBuilder" />
- <DocsLink section="builders" path="class/RoleSelectMenuBuilder" />
- <DocsLink section="builders" path="class/MentionableSelectMenuBuilder" />
- <DocsLink section="builders" path="class/ChannelSelectMenuBuilder" />

As an example, combining a User and Role select menu can allow for a simple role assignment UI. You could also use a slash command directly for this, but we'll make an additional enhancement to it in the next section.

```js{4-10}
module.exports = {
	// data: new SlashCommandBuilder()...
	async execute(interaction) {
		const userSelect = new UserSelectMenuBuilder()
			.setCustomId('user')
			.setPlaceholder('Select the user to be assigned a role.');

		const roleSelect = new RoleSelectMenuBuilder()
			.setCustomId('role')
			.setPlaceholder('Select the role to be assigned.');

		const row1 = new ActionRowBuilder()
			.addComponents(userSelect);
		const row2 = new ActionRowBuilder()
			.addComponents(roleSelect);

		await interaction.reply({
			content: 'Assign a role:',
			components: [row1, row2],
		});
	},
};
```

## Multi-selects

Looking at the example above, selecting one user and one role isn't a great reason to create select menus - slash command options could have done this already.

Where slash command options fall behind is in selecting multiple users or multiple roles. Select menus can support this use case via <DocsLink section="builders" path="class/BaseSelectMenuBuilder?scrollTo=setMinValues" /> and <DocsLink section="builders" path="class/BaseSelectMenuBuilder?scrollTo=setMaxValues" />. When these values are set, users can select multiple items, and the interaction won't be sent until the user clicks outside the select menu.


```js{7-8,13-14}
module.exports = {
	// data: new SlashCommandBuilder()...
	async execute(interaction) {
		const userSelect = new UserSelectMenuBuilder()
			.setCustomId('users')
			.setPlaceholder('Select the users to be assigned roles.')
			.setMinValues(1)
			.setMaxValues(10);

		const roleSelect = new RoleSelectMenuBuilder()
			.setCustomId('roles')
			.setPlaceholder('Select the roles to be assigned.')
			.setMinValues(1)
			.setMaxValues(10);

		const row1 = new ActionRowBuilder()
			.addComponents(userSelect);
		const row2 = new ActionRowBuilder()
			.addComponents(roleSelect);

		await interaction.reply({
			content: 'Assign roles to users:',
			components: [row1, row2],
		});
	},
};
```
