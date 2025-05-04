# Components V2

While you might be familiar with [embeds](/popular-topics/embeds.md) in Discord, there are now other ways to style your messages with new layout and content components. The interactive components ([buttons](/message-components/buttons.md) and [select menus](/message-components/select-menus.md)) have stayed the same, but it is now possible to change the position of those components in combination of the new layout components.

To use the new **Components V2 (CV2)** components, you need to pass in the new `IsComponentsV2` message flag from the <DocsLink path="MessageFlags:Enum" /> enum when sending a message. The flag should only be added to the message's `flags` field when the message contains CV2 components, unlike the `Ephemeral` message flag that can be added when you defer an interaction response.

::: danger
Once a message is sent or edited with the `IsComponentsV2` message flag, the flag **cannot** be removed from that message.
:::

All components, both new and existing, now have a new field `id` (which should not be confused with the existing `custom_id` field for interactive components), which is an optional 32-bit integer identifier for a component presented in a message. It is used to identify non-interactive components in the response from an interaction. More information about these can be found [here](https://discord.com/developers/docs/components/reference#anatomy-of-a-component).

In the following section, we will explain what kind of components are new, how they work together with interactive components, and the limitations Discord has set when using CV2 components in your message.

## New components

CV2 brought new layout components and some new content components. The content components are very similar to some elements used in embeds, but their behaviour is slightly different when used relative to their use in embeds.

### Section

A Section is a layout component allowing you to display text next to an accessory. You can use the <DocsLink path="SectionBuilder:Class" /> utility class to easily create a Section component. Every Section component must have at least 1 and at most 3 Text Display components together with either a Thumbnail or Button component.

The example below shows how you can send a Section component in a channel containing three Text Display components with a Button component on the right, next to the text.

```js
const { SectionBuilder, TextDisplayBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');

const exampleSection = new SectionBuilder()
	.addTextDisplayComponents(
		new TextDisplayBuilder()
			.setContent('This text is inside a new Text Display component! You can use **any __markdown__** available inside this component too.'),
		new TextDisplayBuilder()
			.setContent('Using a section, you may only use up to three Text Display components.'),
		new TextDisplayBuilder()
			.setContent('And you can place one button or one thumbnail component next to it!'),
	)
	.setButtonAccessory(
		new ButtonBuilder()
			.setCustomId('exampleButton')
			.setLabel('Button inside a Section')
			.setStyle(ButtonStyle.Primary),
	);

await channel.send({
	components: [exampleSection],
	flags: MessageFlags.IsComponentsV2,
});
```

### Text Display

A Text Display is a content component allowing you to add text to your message formatted with Discord's available markdown and the mention of users and roles (which actually notifies the users and roles, instead of the text in embeds!). This component is very similar to the `content` field of a message, but using multiple of these components you can control the layout of your message. You can use the <DocsLink path="TextDisplayBuilder:Class" /> utility class to easily create a Text Display component.

The example below shows how you can send a Text Display component in a channel.

```js
const { TextDisplayBuilder, MessageFlags } = require('discord.js');

const exampleTextDisplay = new TextDisplayBuilder()
	.setContent('This text is inside a new Text Display component! You can use **any __markdown__** available inside this component too.');

await channel.send({
	components: [exampleTextDisplay],
	flags: MessageFlags.IsComponentsV2,
});
```

### Thumbnail

A Thumbnail is a content component that is visually similar to the `thumbnail` field inside an embed, but with CV2 it can only be added as an accessory inside a [Section](/popular-topics/components-v2.md#section) component. However, you can add ALT text to the image as well as marking the image as spoiler. You can use the <DocsLink path="ThumbnailBuilder:Class" /> utility class to easily create a Thumbnail component.

The example below shows how you can send a Thumbnail component as an Section component accessory in a channel.

```js
const { AttachmentBuilder, SectionBuilder, TextDisplayBuilder, ThumbnailBuilder, MessageFlags } = require('discord.js');

const file = new AttachmentBuilder('../assets/image.png');

const exampleSection = new SectionBuilder()
	.addTextDisplayComponents(
		new TextDisplayBuilder()
			.setContent('This text is inside a new Text Display component! You can use **any __markdown__** available inside this component too.'),
	)
	.setThumbnailAccessory(
		new ThumbnailBuilder()
			.setDescription('ALT text displaying on the image')
			.setURL('attachment://image.png'), // Supports arbitrary URLs such as 'https://i.imgur.com/AfFp7pu.png' as well.
	);

await channel.send({
	components: [exampleSection],
	files: [file],
	flags: MessageFlags.IsComponentsV2,
});
```

For more information how to set up custom attachments to use in your Thumbnail component URL, you can look at the guide for [attaching images in embeds](/popular-topics/embeds.md#attaching-images).

### Media Gallery

A Media Gallery is a content component that can display up to 10 media attachments formatted in an structured gallery. Each attachment in the Media Gallery component can have an optional ALT text (description) and can be marked as spoiler. You can use the <DocsLink path="MediaGalleryBuilder:Class" /> and <DocsLink path="MediaGalleryItemBuilder:Class" /> utility classes to easily create a Media Gallery component and its items.

The example below shows how you can send a Media Gallery component in a channel.

```js
const { AttachmentBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, MessageFlags } = require('discord.js');

const file = new AttachmentBuilder('../assets/image.png');

const exampleGallery = new MediaGalleryBuilder()
	.addItems(
		new MediaGalleryItemBuilder()
			.setDescription('ALT text displaying on an image from the AttachmentBuilder')
			.setURL('attachment://image.png'),
		new MediaGalleryItemBuilder()
			.setDescription('ALT text displaying on an image from an external URL')
			.setURL('https://i.imgur.com/AfFp7pu.png')
			.setSpoiler(true), // Will display as a blurred image
	);

await channel.send({
	components: [exampleGallery],
	files: [file],
	flags: MessageFlags.IsComponentsV2,
});
```

### File

A File is a content component that can display any uploaded file as an attachment to a message and reference it in the File component itself. It can only display 1 attachment per File component, but using multiple File components you can upload multiple files in one message. File components cannot have ALT text (description) unlike a Thumbnail or Media Gallery component, but you can add a spoiler to the component if you would like to. You can use the <DocsLink path="FileBuilder:Class" /> utility class to easily create a File component.

The example below shows how you can send a File component in a channel.

```js
const { AttachmentBuilder, FileBuilder, MessageFlags } = require('discord.js');

const file = new AttachmentBuilder('../assets/guide.pdf');

const exampleFile = new FileBuilder()
	.setURL('attachment://guide.pdf');

await channel.send({
	components: [exampleFile],
	files: [file],
	flags: MessageFlags.IsComponentsV2,
});
```

### Separator

A Separator is a layout component that adds some vertical padding and optional visiual divison between components. You can select the amount of padding used for the Separator component (small or large) as well as whether a visual divider should be displayed or not (defaults to `true`). You can use the <DocsLink path="SeparatorBuilder:Class" /> utility class to easily create a Separator component.

The example below shows how you can send a Separator component in a channel.

```js
const { SeparatorBuilder, SeparatorSpacingSize, MessageFlags } = require('discord.js');

const exampleSeparator = new SeparatorBuilder()
	.setDivider(false) // No line displayed
	.setSpacing(SeparatorSpacingSize.Large);

await channel.send({
	components: [exampleSeparator],
	flags: MessageFlags.IsComponentsV2,
});
```

### Container

A Container is a layout component that will group its children components and has an optional color bar on the left, just like embeds. The great difference of having it optional is that not specifying any color for the color bar will make the left side of the Container component match the background color of the Container component itself. You can also mark the Container component as spoiler, to make all contents inside it blurred. You can use the <DocsLink path="ContainerBuilder:Class" /> utility class to easily create a Container component.

The example below shows how to send a Container component in a channel containing a Text Display component, an Action Row component with a User Select component, two Separator components, and a Section component with two Text Display components where a Button component is present as an accessory.

```js
const { ContainerBuilder, TextDisplayBuilder, ActionRowBuilder, UserSelectMenuBuilder, SeparatorBuilder, MessageFlags } = require('discord.js');

const exampleContainer = new ContainerBuilder()
	.setAccentColor(0x0099FF)
	.addTextDisplayComponents(
		new TextDisplayBuilder()
			.setContent('This text is inside a new Text Display component! You can use **any __markdown__** available inside this component too.'),
	)
	.addActionRowComponents(
		new ActionRowBuilder()
			.setComponents(
				new UserSelectMenuBuilder()
					.setCustomId('exampleSelect')
					.setPlaceholder('Select users')
			),
	)
	.addSeparatorComponents(
		new SeparatorBuilder(),
		new SeparatorBuilder(),
	)
	.addSectionComponents(
		new SectionBuilder()
			.addTextDisplayComponents(
				new TextDisplayBuilder()
					.setContent('This text is inside a new Text Display component! You can use **any __markdown__** available inside this component too.'),
				new TextDisplayBuilder()
					.setContent('And you can place one button or one thumbnail component next to it!'),
			)
			.setButtonAccessory(
				new ButtonBuilder()
					.setCustomId('exampleButton')
					.setLabel('Button inside a Section')
					.setStyle(ButtonStyle.Primary),
			),
	);

await channel.send({
	components: [exampleContainer],
	flags: MessageFlags.IsComponentsV2,
});
```

### Limitations

There are a few limits set by the Discord API to be aware of when using Components V2 in your messages. These limits are:

- To use any of the components listed under [New components](/popular-topics/components-v2.md#new-components) you must set the `IsComponentsV2` message flag in your message payload.
- Setting the `IsComponentsV2` message flag will disable the `content` and `embeds` fields. You can use [Text Display](/popular-topics/components-v2.md#text-display) and [Container](/popular-topics/components-v2.md#container) components as replacements.
- Setting the `IsComponentsV2` message flag will disable the `poll` and `stickers` fields, and there are no CV2 replacements for these fields you can use.
- When upgrading a message to a CV2 flagged message by editing the message with the `IsComponentsV2` flag, all mentioned fields in the message object (`content`, `embeds`, `poll` and `stickers`) need to be set to `null`.
- Attachments won't show by default, they must be set through the available media components ([Thumbnail](/popular-topics/components-v2.md#thumbnail), [Media Gallery](/popular-topics/components-v2.md#media-gallery) and [File](/popular-topics/components-v2.md#file)).
- Messages allow up to 40 total components.

Source: [Discord API documentation](https://discord.com/developers/docs/components/reference)
