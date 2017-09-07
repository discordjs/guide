## File and folder restructuring

As mentioned in a previous chapter, unless your bot project is a small one, it's not a very good idea to have a single file with a giant if/else if chain for commands. If you want to implement features into your bot and make your development process a lot less painful, you'll definitely want to use (or in our case, create) a command handler. Let's get started on that!

### Individual command files

Before anything, you may want to create a backup of your current bot file. If you followed along so far, your entire foler structure should look something like this:

![Current folder structure](https://i.imgur.com/BmS09fY.png)

In the same folder, create a new folder and name it `commands`. This is where you'll, obviously, store all of your commands. Open up your main file and go to your ping command and copy only the `message.channel.send('Pong.')` bit. Head to your newly created `commands` folder, create a new file named `ping.js`, and copy & paste in the following code:

```js
exports.execute = (message, args) => {
	message.channel.send('Pong.');
}
```

You can go ahead and do the same for the rest of your commands as well. If you've been using the same code as the guide thus far, you can copy and paste your commands into their own files now just fine without any issue. The only thing you need to do is make sure that you put it inside the `exports.execute = ...` function, as seen above.

When you dynamically load our commands, the file name will be set as the command name. Meaning that if you rename your ping file to `something-else`, the command name would now be `something-else` the next time you restart your bot.

### Dynamically reading command files

At the very top of your main file, add this:

```js
// require node's file system API - https://nodejs.org/api/fs.html
const fs = require('fs');
```

And after your `const client = new Discord.Client()` line, add this:

```js
// create a new Collection
client.commands = new Discord.Collection();
```

<p class="tip">If you aren't exactly sure what Collections are, they're a class that extend JS' native Map class and include more extensive, useful functionality avaiable. You can read about Maps [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), and see all the available Collection methods [here](https://discord.js.org/#/docs/main/stable/class/Collection).</p>

This next step is how you'll dynamically retreive all our (soon to be) newly created command files.

```js
// this'll return an array of all the file names in that directory
// e.g. `['ping.js', 'beep.js', 'server.js']`
const commandFiles = fs.readdirSync('./commands');
```

Now that you have an array of all our file names, you can loop over it and dynamically set our commands to the Collection you made above.

```js
// loop over the array with a `for ... of` loop
// if you're more comfortable or familiar with it,
// you can even use a `.forEach()` here instead
for (let file of commandFiles) {
	// slice off the last 3 characters so that it's just `file-name` and not `file-name.js`
	const name = file.slice(0, -3);

	// use the `Map.set()` method to add a new item to our Collection
	// with the key as the file name and the value as the exported functions
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set
	client.commands.set(name, require(`./commands/${name}`));
}
```

By this point, your code should look something like this:

```js
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands');

for (let file of commandFiles) {
	const name = file.slice(0, -3);
	client.commands.set(name, require(`./commands/${name}`));
}

/* `client.on('...')` events and such below this point */
```

As for setting up your files, that's it for now. In the next chapter, you'll learn how to make your commands execute dynamically!
