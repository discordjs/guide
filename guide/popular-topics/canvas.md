# Image manipulation with Canvas

## Setting up Canvas

Canvas is an image manipulation tool that allows you to modify images with code. We'll explore how to use this module in a heavily requested feature: guild member welcome messages. But first, you must go through the intense labor of installing Canvas. It's highly recommended that you use a Linux distribution for this because it'll be much easier to install on.

::: tip
This guide is last tested with `canvas^2.6.0`, so make sure you have this or a similar version after installation.
:::

::: warning
Be sure that you're familiar with things like [async/await](/additional-info/async-await.md) and [object destructuring](/additional-info/es6-syntax.md#object-destructuring) before continuing, as we'll be making use of features like these.
:::

## Installation

### Windows

You will need a package called Windows Build Tools. You may install it with npm with the following command: `npm i --global --production windows-build-tools`, or with Yarn by running the following: `yarn global add --production windows-build-tools`. It is also bundled with Chocolatey, should you choose that installation path. Afterward, you should follow the instructions detailed [here](https://github.com/Automattic/node-canvas/wiki/Installation:-Windows). Additionally, make sure Node and Cairo are **both** either 32-bit or 64-bit; having a 32-bit version of one and a 64-bit version of the other will cause errors.

If you are *still* unable to install Canvas, you might want to consider installing [Microsoft Visual Studio 2015](https://www.visualstudio.com/vs/older-downloads/).

### Other distributions

You can run one of the commands listed [here](https://github.com/Automattic/node-canvas#compiling) to install the necessary tools Canvas needs.

### Package installation

After installing all the necessary software, run `npm i canvas` if you use npm or `yarn add canvas` if you use Yarn.

## Getting started

Here is the base code you'll be using to get started:

<branch version="11.x">

```js
const Discord = require('discord.js');
const Canvas = require('canvas');

const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('guildMemberAdd', member => {
	const channel = member.guild.channels.find(ch => ch.name === 'member-log');
	if (!channel) return;

	channel.send(`Welcome to the server, ${member}!`);
});

client.login('your-token-goes-here');
```

</branch>
<branch version="12.x">

```js
const Discord = require('discord.js');
const Canvas = require('canvas');

const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('guildMemberAdd', member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
	if (!channel) return;

	channel.send(`Welcome to the server, ${member}!`);
});

client.login('your-token-goes-here');
```

</branch>

To make testing this feature much more manageable, you can add a simple command that'll "fake" a new member joining.


<branch version="11.x">

```js
client.on('message', async message => {
	if (message.content === '!join') {
		client.emit('guildMemberAdd', message.member || await message.guild.fetchMember(message.author));
	}
});
```

</branch>
<branch version="12.x">

```js
client.on('message', message => {
	if (message.content === '!join') {
		client.emit('guildMemberAdd', message.member);
	}
});
```

</branch>

This will trigger the `guildMemberAdd` event while passing in the message author's GuildMember object. Of course, you should remove this command once you add this feature to your actual bot.

### Basic image loading

The end goal will be to display the user's avatar, username, and a simple "Welcome!" message when they join. After importing the Canvas module and initializing it, you should load the images. With Canvas, you have to specify where the image comes from first, naturally, and then specify how it gets loaded into the actual Canvas using `context`, which you will use to interact with Canvas.

::: tip
`node-canvas` works almost identical to HTML5 Canvas. You can read the HTML5 Canvas tutorials on [w3Schools](https://www.w3schools.com/html/html5_canvas.asp) and [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) for more information later!
:::

<!-- eslint-disable require-await -->

```js {5-8}
client.on('guildMemberAdd', async member => {
	// ...
	if (!channel) return;

	// Create a 700x250 pixels canvas and get its context
	// The context will be used to modify the canvas
	const canvas = Canvas.createCanvas(700, 250);
	const context = canvas.getContext('2d');
	// ...
});
```

Now, you need to load the image you want to use into Canvas. To have sufficient coverage, we'll first show you how to load a basic image from a local directory. We'll be using [this image](https://github.com/discordjs/guide/blob/master/guide/popular-topics/images/canvas.jpg) as the background in the welcome image, but you can use whatever you want. Be sure to download the file, name it `wallpaper.jpg`, and save it inside the same directory as your main bot file.

<branch version="11.x">

```js {5-10,12}
client.on('guildMemberAdd', async member => {
	// ...
	const context = canvas.getContext('2d');

	// Since the image takes time to load, you should await it
	const background = await Canvas.loadImage('./wallpaper.jpg');
	// This uses the canvas dimensions to stretch the image onto the entire canvas
	context.drawImage(background, 0, 0, canvas.width, canvas.height);
	// Use the helpful Attachment class structure to process the file for you
	const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');

	channel.send(`Welcome to the server, ${member}!`, attachment);
});
```

</branch>
<branch version="12.x">

```js {5-10,12}
client.on('guildMemberAdd', async member => {
	// ...
	const context = canvas.getContext('2d');

	// Since the image takes time to load, you should await it
	const background = await Canvas.loadImage('./wallpaper.jpg');
	// This uses the canvas dimensions to stretch the image onto the entire canvas
	context.drawImage(background, 0, 0, canvas.width, canvas.height);
	// Use the helpful Attachment class structure to process the file for you
	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

	channel.send(`Welcome to the server, ${member}!`, attachment);
});
```

</branch>

![Basic canvas preview](./images/canvas-preview.png)

::: tip
If you get an error such as `Error: error while reading from input stream`, then the file's provided path was incorrect.
:::

### Manipulating images

Next, let's place a border around the image for the sake of demonstration purposes.

```js {5-8}
client.on('guildMemberAdd', async member => {
	// ...
	context.drawImage(background, 0, 0, canvas.width, canvas.height);

	// Set the color of the stroke
	context.strokeStyle = '#74037b';
	// Draw a rectangle with the dimensions of the entire canvas
	context.strokeRect(0, 0, canvas.width, canvas.height);
	// ...
});
```

![Image](./images/canvas-plain.png)

A bit plain, right? Fear not, for you have a bit more to do until you reach completion. Since this guide page's goal is focused more on actual code than design, let's place a basic square-shaped avatar for now on the left side of the image. In the interest of coverage, you will also make it a circle afterward.

<branch version="11.x">

```js {5-8}
client.on('guildMemberAdd', async member => {
	// ...
	context.strokeRect(0, 0, canvas.width, canvas.height);

	// Wait for Canvas to load the image
	const avatar = await Canvas.loadImage(member.user.displayAvatarURL);
	// Draw a shape onto the main canvas
	context.drawImage(avatar, 25, 0, 200, canvas.height);
	// ...
});
```

</branch>
<branch version="12.x">

```js {5-8}
client.on('guildMemberAdd', async member => {
	// ...
	context.strokeRect(0, 0, canvas.width, canvas.height);

	// Wait for Canvas to load the image
	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
	// Draw a shape onto the main canvas
	context.drawImage(avatar, 25, 0, 200, canvas.height);
	// ...
});
```

</branch>

![Image](./images/canvas-stretched-avatar.png)

It works well, but the avatar image itself seems a bit stretched out. Let's remedy that.

<branch version="11.x">

```js {4-5}
client.on('guildMemberAdd', async member => {
	// ...
	const avatar = await Canvas.loadImage(member.user.displayAvatarURL);
	// Move the image downwards vertically and constrain its height to 200, so that it's square
	context.drawImage(avatar, 25, 25, 200, 200);
	// ...
});
```

</branch>
<branch version="12.x">

```js {4-5}
client.on('guildMemberAdd', async member => {
	// ...
	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
	// Move the image downwards vertically and constrain its height to 200, so that it's square
	context.drawImage(avatar, 25, 25, 200, 200);
	// ...
});
```

</branch>

![Image](./images/canvas-square-avatar.png)

The purpose of this small section is to demonstrate that working with Canvas is essentially a hit-and-miss workflow where you fiddle with properties until they work just right.

Since we covered how to load external images and fix dimensions, let's turn the avatar into a circle to improve the image's overall style.

```js {5-12}
client.on('guildMemberAdd', async member => {
	// ...
	context.strokeRect(0, 0, canvas.width, canvas.height);

	// Pick up the pen
	context.beginPath();
	// Start the arc to form a circle
	context.arc(125, 125, 100, 0, Math.PI * 2, true);
	// Put the pen down
	context.closePath();
	// Clip off the region you drew on
	context.clip();
	// ...
});
```

![Image](./images/canvas-circle-avatar.png)

::: tip
You can read more about `context.arc()` on [w3schools](https://www.w3schools.com/tags/canvas_arc.asp) or [MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc).
:::

### Adding in text

Now, let's quickly go over adding text to your image. This will help make the purpose of this image apparent since currently, it's just an avatar floating on a starry background that comes out of nowhere.

```js {5-10}
client.on('guildMemberAdd', async member => {
	// ...
	context.strokeRect(0, 0, canvas.width, canvas.height);

	// Select the font size and type from one of the natively available fonts
	context.font = '60px sans-serif';
	// Select the style that will be used to fill the text in
	context.fillStyle = '#ffffff';
	// Actually fill the text with a solid color
	context.fillText(member.displayName, canvas.width / 2.5, canvas.height / 1.8);
	// ...
});
```

![Image](./images/canvas-add-name.png)

::: tip
If you get an error like `Fontconfig error: Cannot load default config file`, it means you do not have any fonts installed on your system. On Linux, you can run the following command to fix this: `sudo apt-get install fontconfig`. This might also need to be installed if you see boxes where the text should be. As for Windows, you will need to find a way to install fonts.
:::

You may have noticed or considered that if a member's username is too long, then the output won't be quite nice. This is because the text overflows out of the canvas, and you don't have any measures in place for that. Let's take care of this issue!

```js {1-16,22-25}
// Pass the entire Canvas object because you'll need access to its width and context
const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 70;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		context.font = `${fontSize -= 10}px sans-serif`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (context.measureText(text).width > canvas.width - 300);

	// Return the result to use in the actual canvas
	return context.font;
};

client.on('guildMemberAdd', async member => {
	// ...
	context.strokeRect(0, 0, canvas.width, canvas.height);

	// Assign the decided font to the canvas
	context.font = applyText(canvas, member.displayName);
	context.fillStyle = '#ffffff';
	context.fillText(member.displayName, canvas.width / 2.5, canvas.height / 1.8);
	// ...
});
```

Before adjustment:

![Before adjustment](./images/canvas-before-adjustment.png)

After adjustment:

![After adjustment](./images/canvas-after-adjustment.png)

Let's move the welcome text inside the image itself instead of adding it outside as a nice finishing touch.

```js {5-8,10-13}
client.on('guildMemberAdd', async member => {
	// ...
	context.strokeRect(0, 0, canvas.width, canvas.height);

	// Slightly smaller text placed above the member's display name
	context.font = '28px sans-serif';
	context.fillStyle = '#ffffff';
	context.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);

	// Add an exclamation point here and below
	context.font = applyText(canvas, `${member.displayName}!`);
	context.fillStyle = '#ffffff';
	context.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);
	// ...
});
```

![Final result](./images/canvas-final.png)

And that's it! We have covered the basics of image manipulation, text generation, and loading from a remote source.

## Resulting code

<resulting-code />
