## Setting up Canvas

<p class="tip">For this guide, we will be using `canvas@next`. At the time of writing, that is `canvas@2.0.0-alpha.12`, so ensure your `package.json` has that or a similar version after installation.</p>

Canvas is an image manipulation tool that allows you to basically modify pictures with code. We will explore how to use this module in a heavily requested feature: guild member welcome messages. But first, we must go through the intense labour of installing canvas. I highly reccommend using a linux distro because it is much easier to install.

<p class="warning">This guide assumes you have read the [async await](/additional-info/async-await) portion of the guide.</p>

### Windows
I reccommend using Chocolatey to install this, instructions found [here](https://github.com/Automattic/node-canvas/wiki/Installation---Windows).

### Other Distributions
You can run one of the commands listed [here](https://github.com/Automattic/node-canvas#compiling) to install the necessary tools canvas needs.
After running the correct command, if you are using **yarn**, run `yarn add canvas@next`, for **npm** the command to run is `npm i -s canvas@next`.

### Getting Started

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

Since we want to work towards the goal of displaying the user's avatar when they join, let's start with that first. First we need to obviously require the module we want to use, and then initialize it, since that's necessary. Next, we want to load the images. With canvas, you have to specify where the image comes from first, naturally, then you later specify how it gets loaded into the actual canvas using `ctx`.

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

Now, we need to load the image we want to use into canvas. In order to have more sufficient coverage I will first show how to load a basic image from a local directory. We will use this as our background in our welcomer image. In order for this to work, please download [this image](/assets/img/wallpaper.jpg), with the name `wallpaper.jpg` and store it in the directory where this code is ran.

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

If you have that code working it should present to you the following image:
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

If followed successfully, the image should now look like this: ![Image](/assets/img/2vsIPEP.png) 

Quite boring and plain, is it not? Fear not, for we have a bit more to do until we reach completion. Since designing is hard, let's just place a basic square shaped avatar for now on the left side of the image. In interest of coverage, we will also make it a circle afterwards.

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

	// Get the icon in the form of a buffer
	const buffer = await snekfetch.get(member.user.displayAvatarURL).then(r => r.body);
	// Wait for canvas to load the image
	const avatar = await Canvas.loadImage(buffer);
	// Draw a shape onto the main canvas
	ctx.drawImage(avatar, 25, 0, 200, canvas.height);

	ctx.strokeStyle = '#FF0000';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	const attachment = new Discord.Attachment(canvas.toBuffer(), 'image.png');

	channel.send(`Welcome to the server, ${member}`, attachment);
});
```

If followed successfully, the image should now look like this: ![Image](/assets/img/UCndZMo.png)

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

	const buffer = await snekfetch.get(member.user.displayAvatarURL).then(r => r.body);
	const avatar = await Canvas.loadImage(buffer);
	// Move the image downwards vertically and constrain its height to 200, so it's a square
	ctx.drawImage(avatar, 25, 25, 200, 200);

	ctx.strokeStyle = '#FF0000';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	const attachment = new Discord.Attachment(canvas.toBuffer(), 'image.png');

	channel.send(`Welcome to the server, ${member}`, attachment);
});
```

If followed successfully, the image should now look like this: ![Image](/assets/img/9JfHooY.png)

The purpose of this small section is to demonstrate that working with canvas is essentially a hit-and-miss workflow where you fiddle with properties until they work just right.

Now, since we covered how to load external images and fix dimensions, I think a circle would look a lot nicer, don't you agree? Well, let's get started with that, then.

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

	// Pick up the pen
	ctx.beginPath();
	// Start the arc to form a circle
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	// Put the pen down
	ctx.closePath();
	// Needed for some reason
	ctx.clip();

	const buffer = await snekfetch.get(member.user.displayAvatarURL).then(r => r.body);
	const avatar = await Canvas.loadImage(buffer);
	ctx.drawImage(avatar, 25, 25, 200, 200);

	ctx.strokeStyle = '#FF0000';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	const attachment = new Discord.Attachment(canvas.toBuffer(), 'image.png');

	channel.send(`Welcome to the server, ${member}`, attachment);
});
```

If followed successfully, the image should now look like this: ![Image](/assets/img/r6CiT3M.png)

<p class="tip">You can read documentation on `context.arc()` [here](https://www.w3schools.com/tags/canvas_arc.asp).</p>

Now, let's quickly go over adding text to our image. I'm sure that will be helpful to make clear the intent of this image, since currently it's just an avatar floating on a starry background that comes out of nowhere.

```js
client.on('guildMemberAdd', async member => {
	const channel = member.guild.channels.find(ch => ch.name === 'member-log');
	if (!channel) return;

	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./wallpaper.jpg');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const buffer = await snekfetch.get(member.user.displayAvatarURL).then(r => r.body);
	const avatar = await Canvas.loadImage(buffer);
	ctx.drawImage(avatar, 25, 25, 200, 200);

	ctx.strokeStyle = '#FF0000';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	// Select the font size and type from one of the natively available fonts
	ctx.font = '50px Verdana';
	// Select the style that will be used to fill the text in
	ctx.fillStyle = '#FFFFFF';
	// Actually fill the text
	ctx.fillText(member.displayName, canvas.width / 2.5, canvas.height / 1.8);

	const attachment = new Discord.Attachment(canvas.toBuffer(), 'image.png');

	channel.send(`Welcome to the server, ${member}`, attachment);
});
```

If followed successfully, the image should now look like this: ![Image](/assets/img/3rLGb1s.png)

Maybe you have noticed, where if a member's username is too long, then the output won't be quite nice. This is because the text overflows out of the canvas, and we don't have any measures in place for that. Let's take care of this issue, shall we?

```js
const Discord = require('discord.js');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');

// Pass the entire canvas because we want to compare its width as well while being able to grab its context
const applyText = (canvas, username) => {
	const ctx = canvas.getContext('2d');

	// Declare a base size of the font
	let size = 70;
	do {
		// Assign the font to the context and decrement it so we can measure it again
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

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const buffer = await snekfetch.get(member.user.displayAvatarURL).then(r => r.body);
	const avatar = await Canvas.loadImage(buffer);
	ctx.drawImage(avatar, 25, 25, 200, 200);


	ctx.strokeStyle = '#FF0000';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	// Assign the decided font to the canvas
	ctx.font = applyText(canvas, member.displayName);
	// Choose a white color
	ctx.fillStyle = '#FFFFFF';
	// Actually fill the text in with a solid color
	ctx.fillText(member.displayName, canvas.width / 2.5, canvas.height / 1.8);

	const attachment = new Discord.Attachment(canvas.toBuffer(), 'image.png');

	channel.send(`Welcome to the server, ${member}`, attachment);
});
```

Before adjustment: ![Image](/assets/img/NKw7P2q.png)<br />
After adjustment: ![Image](/assets/img/Ja4Ywf4.png)
