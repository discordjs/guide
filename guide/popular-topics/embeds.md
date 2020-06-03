# Embeds

If you have been around on Discord for a bit chances are you have seen these special messages.
They have a colored border, are often sent by bots and have embedded images, text fields and other fancy stuff.

In the following section we will explain how you compose an embed, send it, and what you need to be aware of while doing so.

## Embed preview

Here is an example of what an embed may look like. We will go over their construction in the next part of this guide.

<div is="discord-messages">
	<discord-message author="Tutorial Bot" avatar="blue" :bot="true">
		<discord-embed
			slot="embeds"
			color="#0099ff"
			title="Some title"
			url="https://discord.js.org/"
			thumbnail="https://i.imgur.com/wSTFkRM.png"
			image="https://i.imgur.com/wSTFkRM.png"
			footer-image="https://i.imgur.com/wSTFkRM.png"
			timestamp="01/01/2018"
			authorName="Some name"
			authorImage="https://i.imgur.com/wSTFkRM.png"
			authorUrl="https://discord.js.org/"
		>
			Some description here
			<embed-fields>
				<embed-field title="Regular field title">
					Some value here
				</embed-field>
				<embed-field title="​">
					​
				</embed-field>
				<embed-field :inline="true" title="Inline field title">
					Some value here
				</embed-field>
				<embed-field :inline="true" title="Inline field title">
					Some value here
				</embed-field>
				<embed-field :inline="true" title="Inline field title">
					Some value here
				</embed-field>
			</embed-fields>
			<span slot="footer">Some footer text here</span>
		</discord-embed>
	</discord-message>
</div>

## Using the <branch version="11.x" inline>RichEmbed</branch><branch version="12.x" inline>MessageEmbed</branch> constructor

Discord.js features the utility class <branch version="11.x" inline>[RichEmbed](https://discord.js.org/#/docs/main/v11/class/MessageEmbed)</branch><branch version="12.x" inline>[MessageEmbed](https://discord.js.org/#/docs/main/stable/class/MessageEmbed)</branch> for easy construction and manipulation of embeds.

<branch version="11.x">

::: warning
In version 12 the receiving and outgoing embed classes have been unified; you will need to use `Discord.MessageEmbed()` as constructor instead.
:::

```js
// at the top of your file
const Discord = require('discord.js');

// inside a command, event listener, etc.
const exampleEmbed = new Discord.RichEmbed()
	.setColor('#0099ff')
	.setTitle('Some title')
	.setURL('https://discord.js.org/')
	.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
	.setDescription('Some description here')
	.setThumbnail('https://i.imgur.com/wSTFkRM.png')
	.addField('Regular field title', 'Some value here')
	.addBlankField()
	.addField('Inline field title', 'Some value here', true)
	.addField('Inline field title', 'Some value here', true)
	.addField('Inline field title', 'Some value here', true)
	.setImage('https://i.imgur.com/wSTFkRM.png')
	.setTimestamp()
	.setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

channel.send(exampleEmbed);
```

</branch>
<branch version="12.x">

```js
// at the top of your file
const Discord = require('discord.js');

// inside a command, event listener, etc.
const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Some title')
	.setURL('https://discord.js.org/')
	.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
	.setDescription('Some description here')
	.setThumbnail('https://i.imgur.com/wSTFkRM.png')
	.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
	.addField('Inline field title', 'Some value here', true)
	.setImage('https://i.imgur.com/wSTFkRM.png')
	.setTimestamp()
	.setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

channel.send(exampleEmbed);
```

</branch>

::: tip
You don't need to include all the elements showcased above. If you want a simpler embed, just leave some out.
:::

The `.setColor()` method accepts an integer, HEX color string, an array of RGB values or specific color strings. You can find a list of them at <branch version="11.x" inline>[the Discord.js documentation](https://discord.js.org/#/docs/main/v11/typedef/ColorResolvable)</branch><branch version="12.x" inline>[the Discord.js documentation](https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable)</branch>.

<branch version="11.x">

`.addBlankField()` is a convenience method for `.addField('\u200b', '\u200b')`, used to add a spacer to the embed. It can also be used inline by passing `true` as the first parameter.

</branch>
<branch version="12.x">

`.addBlankField()` was a convenience method to add a spacer to the embed. To add a blank field you can now use `.addField('\u200b', '\u200b')` instead.

</branch>

The above example chains the manipulating methods to the newly created <branch version="11.x" inline>RichEmbed</branch><branch version="12.x" inline>MessageEmbed</branch> object.
If you want to modify the embed based on conditions you will need to reference it as the constant `exampleEmbed` (for our example).

<branch version="11.x">

<!-- eslint-skip -->

```js
const exampleEmbed = new Discord.RichEmbed().setTitle('Some title');

if (message.author.bot) {
	exampleEmbed.setColor('#7289da');
}
```

</branch>
<branch version="12.x">

<!-- eslint-skip -->

```js
const exampleEmbed = new Discord.MessageEmbed().setTitle('Some title');

if (message.author.bot) {
	exampleEmbed.setColor('#7289da');
}
```

</branch>

### Attaching images

You can use the `.attachFiles()` method to upload images alongside your embed and use them as source for embed fields that support image urls. The method accepts the source file as file path <branch version="11.x" inline>[FileOptions](https://discord.js.org/#/docs/main/v11/typedef/FileOptions)</branch><branch version="12.x" inline>[FileOptions](https://discord.js.org/#/docs/main/stable/typedef/FileOptions)</branch>, BufferResolvable (including a URL to an external image), or Attachment objects inside an array.

You can then reference and use the images inside the embed itself with `attachment://fileName.extension`.

::: tip
If you plan to attach the same image over and over consider hosting it online and just provide the URL in the respective embed field instead. This also makes your bot respond much faster, since it doesn't need to upload the image with every response depending on it.
:::

<branch version="11.x">

```js
const exampleEmbed = new Discord.RichEmbed()
	.setTitle('Some title')
	.attachFiles(['../assets/discordjs.png'])
	.setImage('attachment://discordjs.png');

channel.send(exampleEmbed);
```

</branch>
<branch version="12.x">

```js
const exampleEmbed = new Discord.MessageEmbed()
	.setTitle('Some title')
	.attachFiles(['../assets/discordjs.png'])
	.setImage('attachment://discordjs.png');

channel.send(exampleEmbed);
```

</branch>

::: warning
If the images doesn't display inside the embed but outside of it, double check your syntax to make sure it's as shown above.
:::

## Using an embed object

<!-- eslint-disable camelcase -->

```js
const exampleEmbed = {
	color: 0x0099ff,
	title: 'Some title',
	url: 'https://discord.js.org',
	author: {
		name: 'Some name',
		icon_url: 'https://i.imgur.com/wSTFkRM.png',
		url: 'https://discord.js.org',
	},
	description: 'Some description here',
	thumbnail: {
		url: 'https://i.imgur.com/wSTFkRM.png',
	},
	fields: [
		{
			name: 'Regular field title',
			value: 'Some value here',
		},
		{
			name: '\u200b',
			value: '\u200b',
			inline: false,
		},
		{
			name: 'Inline field title',
			value: 'Some value here',
			inline: true,
		},
		{
			name: 'Inline field title',
			value: 'Some value here',
			inline: true,
		},
		{
			name: 'Inline field title',
			value: 'Some value here',
			inline: true,
		},
	],
	image: {
		url: 'https://i.imgur.com/wSTFkRM.png',
	},
	timestamp: new Date(),
	footer: {
		text: 'Some footer text here',
		icon_url: 'https://i.imgur.com/wSTFkRM.png',
	},
};

channel.send({ embed: exampleEmbed });
```

::: tip
You don't need to include all the elements showcased above. If you want a simpler embed, just leave some out.
:::

<branch version="11.x">

::: warning
The `color` field has to be an integer for embed objects! If you have a hex color string (e.g. `'#7289da'`) you can replace the `#` with `0x` to use it as a number: `0x7289da`.
:::

</branch>

If you want to modify the embed object based on conditions you will need to reference it directly (as `exampleEmbed` for our example). You can then (re)assign the property values as you would with any other object.

```js
const exampleEmbed = { title: 'Some title' };

if (message.author.bot) {
	exampleEmbed.color = 0x7289da;
}
```

### Attaching images

You can upload images with your embedded message and use them as source for embed fields that support image urls by constructing <branch version="11.x" inline>an [Attachment](https://discord.js.org/#/docs/main/v11/class/Attachment)</branch><branch version="12.x" inline>a [MessageAttachment](https://discord.js.org/#/docs/main/stable/class/MessageAttachment)</branch> from them to send as message option alongside the embed. The <branch version="11.x" inline>file</branch><branch version="12.x" inline>attachment</branch> parameter takes a BufferResolvable or Stream including the URL to an external image.

You can then reference and use the images inside the embed itself with `attachment://fileName.extension`.

::: tip
If you plan to attach the same image over and over consider hosting it online and just provide the URL in the respective embed field instead. This also makes your bot respond much faster, since it doesn't need to upload the image with every response depending on it.
:::

<branch version="11.x">

```js
const file = new Discord.Attachment('../assets/discordjs.png');

const exampleEmbed = {
	title: 'Some title',
	image: {
		url: 'attachment://discordjs.png',
	},
};

channel.send({ files: [file], embed: exampleEmbed });
```

</branch>
<branch version="12.x">

```js
const file = new Discord.MessageAttachment('../assets/discordjs.png');

const exampleEmbed = {
	title: 'Some title',
	image: {
		url: 'attachment://discordjs.png',
	},
};

channel.send({ files: [file], embed: exampleEmbed });
```

</branch>

::: warning
If the images doesn't display inside the embed but outside of it, double check your syntax to make sure it's as shown above.
:::

## Resending and editing

We will now explain how to edit embedded message content and resend a received embed.

### Resending a received embed

To forward a received embed you retrieve it from the messages embed array (`message.embeds`) and pass it to the <branch version="11.x" inline>RichEmbed</branch><branch version="12.x" inline>MessageEmbed</branch> constructor. The constructed <branch version="11.x" inline>RichEmbed</branch><branch version="12.x" inline>MessageEmbed</branch> can then be edited before sending it again.

::: warning
<branch version="11.x" inline>You can not resend the received embed structure! The MessageEmbed returned from `message.embeds` contains circular structures and needs to be converted to a RichEmbed object before sending.</branch><branch version="12.x" inline>We deliberately create a new Embed here instead of just modifying `message.embeds[0]` directly to keep the cache valid. If we were to not do this the embed in cache on the original message would diverge from what the actual embed looks like, which can result in unexpected behavior down the line!</branch>
:::

<branch version="11.x">

```js
const receivedEmbed = message.embeds[0];
const exampleEmbed = new Discord.RichEmbed(receivedEmbed).setTitle('New title');

channel.send(exampleEmbed);
```

</branch>
<branch version="12.x">

```js
const receivedEmbed = message.embeds[0];
const exampleEmbed = new Discord.MessageEmbed(receivedEmbed).setTitle('New title');

channel.send(exampleEmbed);
```

</branch>

### Editing the embedded message content

To edit the content of an embed you need to pass a new <branch version="11.x" inline>RichEmbed</branch><branch version="12.x" inline>MessageEmbed</branch> structure or embed object to the messages `.edit()` method.

<branch version="11.x">

```js
const exampleEmbed = new Discord.RichEmbed()
	.setTitle('Some title')
	.setDescription('Description after the edit');

message.edit(exampleEmbed);
```

</branch>
<branch version="12.x">

```js
const exampleEmbed = new Discord.MessageEmbed()
	.setTitle('Some title')
	.setDescription('Description after the edit');

message.edit(exampleEmbed);
```

</branch>

If you want to build the new embed data on the template of a previously sent embed make sure to read the caveats in the previous section. 

## Notes

- To display fields side-by-side, you need at least two consecutive fields set to `inline`
- By default, up to 3 fields will display inline. If a thumbnail is set, this will change to 2
- The timestamp will automatically adjust the timezone depending on the user's device
- Mentions of any kind will only render correctly in field values and descriptions
- Mentions in embeds will not trigger a notification
- Embeds allow masked links (e.g. `[Guide](https://discordjs.guide/ 'optional hovertext')`), but only in description and field values

## Embed limits

There are a few limits to be aware of while planning your embeds due to limitations set by the API. Here is a quick reference you can come back to:

- Embed titles are limited to 256 characters
- Embed descriptions are limited to 2048 characters
- There can be up to 25 fields
- A field's name is limited to 256 characters and its value to 1024 characters
- The footer text is limited to 2048 characters
- The author name is limited to 256 characters
- In addition, the sum of all characters in an embed structure must not exceed 6000 characters
- A bot can have 1 embed per message
- A webhook can have 10 embeds per message

Source: [Discord API documentation](https://discordapp.com/developers/docs/resources/channel#embed-limits)
