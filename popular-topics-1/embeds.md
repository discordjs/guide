# Embeds

If you have been around on Discord for a bit, chances are you have seen these special messages, often sent by bots. They can have a colored border, embedded images, text fields, and other fancy properties.

In the following section, we will explain how to compose an embed, send it, and what you need to be aware of while doing so.

## Embed preview

Here is an example of how an embed may look. We will go over embed construction in the next part of this guide.

 Some description here Some value here ​ Some value here Some value here Some value here Some footer text here

## Using the embed constructor

discord.js features the `MessageEmbed` utility class for easy construction and manipulation of embeds.

```javascript
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

::: tip You don't need to include all the elements showcased above. If you want a simpler embed, leave some out. :::

The `.setColor()` method accepts an integer, HEX color string, an array of RGB values or specific color strings. You can find a list of them at the discord.js documentation.

`.addBlankField()` was a convenience method to add a spacer to the embed. To add a blank field you can now use `.addField('\u200b', '\u200b')` instead.

The above example chains the manipulating methods to the newly created MessageEmbed object. If you want to modify the embed based on conditions, you will need to reference it as the constant `exampleEmbed` \(for our example\).

```javascript
const exampleEmbed = new Discord.MessageEmbed().setTitle('Some title');

if (message.author.bot) {
    exampleEmbed.setColor('#7289da');
}
```

### Attaching images

You can use the `.attachFiles()` method to upload images alongside your embed and use them as source for embed fields that support image urls. The method accepts the source file as file path FileOptions, BufferResolvable \(including a URL to an external image\), or Attachment objects inside an array.

You can then reference and use the images inside the embed itself with `attachment://fileName.extension`.

::: tip If you plan to attach the same image repeatedly, consider hosting it online and providing the URL in the respective embed field instead. This also makes your bot respond faster since it doesn't need to upload the image with every response depending on it. :::

```javascript
const exampleEmbed = new Discord.MessageEmbed()
    .setTitle('Some title')
    .attachFiles(['../assets/discordjs.png'])
    .setImage('attachment://discordjs.png');

channel.send(exampleEmbed);
```

::: warning If the images don't display inside the embed but outside of it, double-check your syntax to make sure it's as shown above. :::

## Using an embed object

```javascript
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

::: tip You don't need to include all the elements showcased above. If you want a simpler embed, leave some out. :::

If you want to modify the embed object based on conditions, you will need to reference it directly \(as `exampleEmbed` for our example\). You can then \(re\)assign the property values as you would with any other object.

```javascript
const exampleEmbed = { title: 'Some title' };

if (message.author.bot) {
    exampleEmbed.color = 0x7289da;
}
```

### Attaching images

You can upload images with your embedded message and use them as source for embed fields that support image urls by constructing a MessageAttachment from them to send as message option alongside the embed. The attachment parameter takes a BufferResolvable or Stream including the URL to an external image.

You can then reference and use the images inside the embed itself with `attachment://fileName.extension`.

::: tip If you plan to attach the same image repeatedly, consider hosting it online and providing the URL in the respective embed field instead. This also makes your bot respond faster since it doesn't need to upload the image with every response depending on it. :::

```javascript
const file = new Discord.MessageAttachment('../assets/discordjs.png');

const exampleEmbed = {
    title: 'Some title',
    image: {
        url: 'attachment://discordjs.png',
    },
};

channel.send({ files: [file], embed: exampleEmbed });
```

::: warning If the images don't display inside the embed but outside of it, double-check your syntax to make sure it's as shown above. :::

## Resending and editing

We will now explain how to edit embedded message content and resend a received embed.

### Resending a received embed

To forward a received embed you retrieve it from the messages embed array \(`message.embeds`\) and pass it to the MessageEmbed can then be edited before sending it again.

::: warning We deliberately create a new Embed here instead of just modifying `message.embeds[0]` directly to keep the cache valid. If we were not to do this, the embed in cache on the original message would diverge from what the actual embed looks like, which can result in unexpected behavior down the line! :::

```javascript
const receivedEmbed = message.embeds[0];
const exampleEmbed = new Discord.MessageEmbed(receivedEmbed).setTitle('New title');

channel.send(exampleEmbed);
```

### Editing the embedded message content

To edit the content of an embed you need to pass a new MessageEmbed structure or embed object to the messages `.edit()` method.

```javascript
const exampleEmbed = new Discord.MessageEmbed()
    .setTitle('Some title')
    .setDescription('Description after the edit');

message.edit(exampleEmbed);
```

If you want to build the new embed data on a previously sent embed template, make sure to read the caveats in the previous section.

## Notes

* To display fields side-by-side, you need at least two consecutive fields set to `inline`
* The timestamp will automatically adjust the timezone depending on the user's device
* Mentions of any kind will only render correctly in field values and descriptions
* Mentions in embeds will not trigger a notification
* Embeds allow masked links \(e.g. `[Guide](https://discordjs.guide/ 'optional hovertext')`\), but only in description and field values

## Embed limits

There are a few limits to be aware of while planning your embeds due to the API's limitations. Here is a quick reference you can come back to:

* Embed titles are limited to 256 characters
* Embed descriptions are limited to 2048 characters
* There can be up to 25 fields
* A field's name is limited to 256 characters and its value to 1024 characters
* The footer text is limited to 2048 characters
* The author name is limited to 256 characters
* The sum of all characters from all embed structures in a message must not exceed 6000 characters
* A bot can have one embed per message
* A webhook can have ten embeds per message

Source: [Discord API documentation](https://discord.com/developers/docs/resources/channel#embed-limits)

