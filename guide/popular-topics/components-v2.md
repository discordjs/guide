# Components V2

While you might be familiar with [embeds](/popular-topics/embeds.md) in Discord, there are now other ways to style your messages with new layout and content components. The interactive components ([buttons](/message-components/buttons.md) and [select menus](/message-components/select-menus.md)) have stayed the same, but it is now possible to change the position of those components in combination of the new layout components.

To use the new Components V2 (CV2) components, you need to pass in the new `IsComponentsV2` message flag from the <DocsLink path="MessageFlags:Enum" /> enum when sending a message. The flag should only be added to the message's `flags` field when the message contains CV2 components, unlike the `Ephemeral` message flag that can be added when you defer an interaction response.

All components, both new and existing, now have a new field `id` (which should not be confused with the existing `custom_id` field for interactive components), which is an optional 32-bit integer identifier for a component presented in a message. It is used to identify non-interactive components in the response from an interaction. More information about these can be found [here](https://discord.com/developers/docs/components/reference#anatomy-of-a-component).

In the following section, we will explain what kind of components are new, how they work together with interactive components, and the limitations Discord has set when using CV2 components in your message.

## New components

CV2 brought new layout components and some new content components. The content components are very similar to some elements used in embeds, but their behaviour is slightly different when used relative to their use in embeds.

### Section

A Section is a top-level layout component allowing you to display text next to an accessory. You can use the <DocsLink path="SectionBuilder:Class" /> utility class to easily create a Section.

The example below shows how you can create a Section containing three Text Display components with a Button component on the right, next to the text.

```js
const { SectionBuilder, TextDisplayBuilder, ButtonStyle } = require('discord.js');

const exampleSection = new SectionBuilder()
	.addTextDisplayComponents(
		new TextDisplayBuilder()
			.setContent(
				'This text is inside a new Text Display component! You can use **any __markdown__** available inside this component too.'
			),
		new TextDisplayBuilder()
			.setContent(
				'Using a section, you may only use up to three Text Display components.'
			),
		new TextDisplayBuilder()
			.setContent(
				'And you can place one button or one thumbnail component next to it!'
			)
	)
	.setButtonAccessory(
		new ButtonBuilder()
			.setCustomId('exampleButton')
			.setLabel('Button inside a Section')
			.setStyle(ButtonStyle.Primary)
	)
```

## Text Display

A Text Display is a top-level content component allowing you to add text to your message formatted with Discord's available markdown and the mention of users and roles (which actually notifies the users and roles, instead of the text in embeds!). This component is very similar to the `content` field of a message, but using multiple of these components you can control the layout of your message.

There is some more spacing


Source: [Discord API documentation](https://discord.com/developers/docs/components/reference)
