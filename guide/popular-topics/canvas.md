## Setting up Canvas

<p class="tip">For this guide, we will be using `canvas@next`. At the time of writing, that is `canvas@2.0.0-alpha.12`, so ensure your `package.json` has that or a similar version after installation.</p>

Canvas is an image manipulation tool that allows you to basically modify pictures with code. We will explore how to use this module in a heavily requested feature: guild member welcome messages. But first, we must go through the intense labor of installing canvas. It's highly recommended that you use a Linux ditro for this because it'll be much easier to install on.

<p class="warning">You should know [async await](/additional-info/async-await) before continuing, as we will make use of this feature.</p>

### Installation

#### Windows

You will need a package called Windows Build Tools. You may install it with npm with the following command: `npm i --global --production windows-build-tools`, or with yarn by running the following: `yarn global add --production windows-build-tools`. It is also bundled with Chocolatey, should you choose that installation path. Afterwards, you should follow the instructions detailed [here](https://github.com/Automattic/node-canvas/wiki/Installation---Windows).
Additionally, make sure Node and Cairo are both either **32-bit** or **64-bit**, whichever your system works with.
If you are *still* unable to install canvas, you might want to consider installing [Microsoft Visual Studio 2015](https://www.visualstudio.com/vs/older-downloads/).

#### Other Distributions

You can run one of the commands listed [here](https://github.com/Automattic/node-canvas#compiling) to install the necessary tools canvas needs.

#### After Prerequisites

After running the correct command, if you are using **yarn**, run `yarn add canvas@next`, for **npm** the command to run is `npm i -s canvas@next`.

#### Getting Started

Here is what your guildMemberAdd event should look like on a basic level, taken from [here](https://discord.js.org/#/docs/main/stable/examples/greeting):

```js
const Discord = require('discord.js');

client.on('guildMemberAdd', member => {
	const channel = member.guild.channels.find(ch => ch.name === 'member-log');
	if (!channel) return;
	channel.send(`Welcome to the server, ${member}`);
});
```

<p class="tip">`node-canvas` works quite similar to the canvas tutorials on W3Schools. You can check it out [here](https://www.w3schools.com/html/html5_canvas.asp).</p>

### Basic Image Loading

Since you should want to work towards the goal of displaying the user's avatar when they join, let's start with that first. After importing the module and initializing it, you should to load the images. With canvas, you have to specify where the image comes from first, naturally, then you later specify how it gets loaded into the actual canvas using `ctx`, which is what you will use to interact with canvas.

```js
const Discord = require('discord.js');
const Canvas = require('canvas');

client.on('guildMemberAdd', async member => {
	const channel = member.guild.channels.find(ch => ch.name === 'member-log');
	if (!channel) return;

	// Set a new canvas to the dimensions of 700x200 pixels
	const canvas = Canvas.createCanvas(700, 200);
	// ctx (context) will be used to modify a lot of the canvas
	const ctx = canvas.getContext('2d');

	channel.send(`Welcome to the server, ${member}`);
});
```

<p class="tip">You can force the event to fire by executing some sample code with [eval](https://gist.github.com/Lewdcario/c457c12f7eabfb4115c2067d634d549a), such as with `client.emit('guildMemberAdd', message.member)`. This makes it easier to test as you do not have to rely on a member joining every time.</p>

Now, you need to load the image you want to use into canvas. In order to have more sufficient coverage I will first show how to load a basic image from a local directory. We will use this as our background in our welcomer image. In order for this to work, please download [this image](/assets/img/wallpaper.jpg) and store it in the directory where this code is ran, with the name `wallpaper.jpg`.

```js
const Discord = require('discord.js');
const Canvas = require('canvas');

client.on('guildMemberAdd', async member => {
	const channel = member.guild.channels.find(ch => ch.name === 'member-log');
	if (!channel) return;

	const canvas = Canvas.createCanvas(700, 200);
	const ctx = canvas.getContext('2d');

	// Since the image takes time to load, we should await it
	const background = await Canvas.loadImage('./wallpaper.jpg');
	// This uses the canvas dimensions to stretch the image onto the entire canvas
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
	// Use helpful Attachment class structure to process the file for you
	const attachment = new Discord.Attachment(canvas.toBuffer(), 'image.png');

	channel.send(`Welcome to the server, ${member}`, attachment);
});
```

![Image](/assets/img/8CQvVRV.png)

If you get an error, such as `Error: error while reading from input stream`, then the provided path to the file was incorrect.

Next, let's place a border around the image, just for the sake of it- which is mainly demonstration.

```js
const Discord = require('discord.js');
const Canvas = require('canvas');

client.on('guildMemberAdd', async member => {
	const channel = member.guild.channels.find(ch => ch.name === 'member-log');
	if (!channel) return;

	const canvas = Canvas.createCanvas(700, 200);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./wallpaper.jpg');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	// Select the colour of the stroke
	ctx.strokeStyle = '#FF0000';
	// Draw a rectangle with the dimensions of the entire canvas
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	const attachment = new Discord.Attachment(canvas.toBuffer(), 'image.png');

	channel.send(`Welcome to the server, ${member}`, attachment);
});
```

![Image](/assets/img/2vsIPEP.png) 

Quite boring and plain, is it not? Fear not, for you have a bit more to do until we reach completion. Since designing is hard, let's just place a basic square shaped avatar for now on the left side of the image. In interest of coverage, you will also make it a circle afterwards.

```js
const Discord = require('discord.js');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');

client.on('guildMemberAdd', async member => {
	const channel = member.guild.channels.find(ch => ch.name === 'member-log');
	if (!channel) return;

	const canvas = Canvas.createCanvas(700, 200);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./wallpaper.jpg');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#FF0000';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	// Get the icon in the form of a buffer
	const { body: buffer } = await snekfetch.get(member.user.displayAvatarURL);
	// Wait for canvas to load the image
	const avatar = await Canvas.loadImage(buffer);
	// Draw a shape onto the main canvas
	ctx.drawImage(avatar, 25, 0, 200, canvas.height);

	const attachment = new Discord.Attachment(canvas.toBuffer(), 'image.png');

	channel.send(`Welcome to the server, ${member}`, attachment);
});
```

![Image](/assets/img/UCndZMo.png)

Looking pretty good, but the picture isn't positioned properly. For starters, it's stretched out vertically too much.

```js
const Discord = require('discord.js');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');

client.on('guildMemberAdd', async member => {
	const channel = member.guild.channels.find(ch => ch.name === 'member-log');
	if (!channel) return;

	const canvas = Canvas.createCanvas(700, 200);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./wallpaper.jpg');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#FF0000';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	const { body: buffer } = await snekfetch.get(member.user.displayAvatarURL);
	const avatar = await Canvas.loadImage(buffer);
	// Move the image downwards vertically and constrain its height to 200, so it's a square
	ctx.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new Discord.Attachment(canvas.toBuffer(), 'image.png');

	channel.send(`Welcome to the server, ${member}`, attachment);
});
```

![Image](/assets/img/9JfHooY.png)

The purpose of this small section is to demonstrate that working with canvas is essentially a hit-and-miss workflow where you fiddle with properties until they work just right.

Now, since we covered how to load external images and fix dimensions, we should use a circle to improve the overall look of the image.

```js
const Discord = require('discord.js');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');

client.on('guildMemberAdd', async member => {
	const channel = member.guild.channels.find(ch => ch.name === 'member-log');
	if (!channel) return;

	const canvas = Canvas.createCanvas(700, 200);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./wallpaper.jpg');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#FF0000';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	// Pick up the pen
	ctx.beginPath();
	// Start the arc to form a circle
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	// Put the pen down
	ctx.closePath();
	// Needed for some reason
	ctx.clip();

	const { body: buffer } = await snekfetch.get(member.user.displayAvatarURL);
	const avatar = await Canvas.loadImage(buffer);
	ctx.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new Discord.Attachment(canvas.toBuffer(), 'image.png');

	channel.send(`Welcome to the server, ${member}`, attachment);
});
```

![Image](/assets/img/r6CiT3M.png)

<p class="tip">You can read documentation on `context.arc()` [here](https://www.w3schools.com/tags/canvas_arc.asp).</p>

Now, let's quickly go over adding text to your image. I'm sure that will be helpful to make clear the intent of this image, since currently it's just an avatar floating on a starry background that comes out of nowhere.

```js
client.on('guildMemberAdd', async member => {
	const channel = member.guild.channels.find(ch => ch.name === 'member-log');
	if (!channel) return;

	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./wallpaper.jpg');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#FF0000';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	// Select the font size and type from one of the natively available fonts
	ctx.font = '50px sans-serif';
	// Select the style that will be used to fill the text in
	ctx.fillStyle = '#FFFFFF';
	// Actually fill the text with a solid color
	ctx.fillText(member.displayName, canvas.width / 2.5, canvas.height / 1.8);

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const { body: buffer } = await snekfetch.get(member.user.displayAvatarURL);
	const avatar = await Canvas.loadImage(buffer);
	ctx.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new Discord.Attachment(canvas.toBuffer(), 'image.png');

	channel.send(`Welcome to the server, ${member}`, attachment);
});
```

![Image](/assets/img/3rLGb1s.png)

If you get an error like `Fontconfig error: Cannot load default config file`, it means you do not have any fonts installed on your system. Run the following command to install it: `sudo apt-get install fontconfig`. This might also need to be installed if you see boxes where the text should be. As for windows, you will need to find a way to install fonts.

Maybe you have noticed, or considered, where if a member's username is too long, then the output won't be quite nice. This is because the text overflows out of the canvas, and you don't have any measures in place for that. Let's take care of this issue, shall we?

```js
const Discord = require('discord.js');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');

// Pass the entire canvas because you will want to compare its width as well while being able to grab its context
const applyText = (canvas, username) => {
	const ctx = canvas.getContext('2d');

	// Declare a base size of the font
	let size = 70;
	do {
		// Assign the font to the context and decrement it so it can be measured again
		ctx.font = `${size -= 10}px sans-serif`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (ctx.measureText(username).width > canvas.width - 300);

	// Return the result to use in the actual canvas
	return ctx.font;
};

client.on('guildMemberAdd', async member => {
	const channel = member.guild.channels.find(ch => ch.name === 'member-log');
	if (!channel) return;

	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./wallpaper.jpg');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#FF0000';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	// Assign the decided font to the canvas
	ctx.font = applyText(canvas, member.displayName);
	ctx.fillStyle = '#FFFFFF';
	ctx.fillText(member.displayName, canvas.width / 2.5, canvas.height / 1.8);

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const { body: buffer } = await snekfetch.get(member.user.displayAvatarURL);
	const avatar = await Canvas.loadImage(buffer);
	ctx.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new Discord.Attachment(canvas.toBuffer(), 'image.png');

	channel.send(`Welcome to the server, ${member}`, attachment);
});
```

Before adjustment: ![Image](/assets/img/NKw7P2q.png)

After adjustment: ![Image](/assets/img/Ja4Ywf4.png)

And that's it! We have covered the basics of image manipulation, text generation and loading from a remote source.

## Resulting code

If you want to compare your code to the code we've constructed so far, you can review it over on the GitHub repository [here](https://github.com/discordjs/guide/tree/master/code_samples/canvas/).
