## Commands with user input (a.k.a. "arguments")

<p class="tip">This page is a follow-up and bases its code off of [the previous page](/creating-your-bot/adding-more-commands).</p>

Sometimes you'll want to determine the result of a command depending on user input. It's a very common case with a very simple solution. This section will teach you how to extract user input from a message and use it in your code. Generally, you'll hear other people refer to this as "arguments", and you should refer to them as that as well.

### Basic arguments

We'll actually be tackling 2 things at once here. Things will be explained along the way, so don't worry if you don't understand immediately.

Go to your main bot file and find the `client.on('message')` bit. Inside of it, add these 4 lines at the very top of it.

```js
if (!message.content.startsWith(prefix) || message.author.bot) return;

const args = message.content.slice(prefix.length).split(' ');
const command = args.shift().toLowerCase();
```

1. If the message either doesn't start with the prefix or was sent by a bot, exit early.
2. Create an `args` variable that slices off the prefix entirely and then splits it into an array by spaces.
3. Create a `command` variable by calling `args.shift()`, which will take the first element in array and return it while also removing it from the original array (so that you don't have the command name string inside the `args` array).

Hopefully that's a bit clearer, if there was any confusion. Let's create a quick command to check out the result of our new addition:

```js
// using the new `command` variable, this makes it easier to manage!
// you can switch your other commands to this format as well
else if (command === 'args-info') {
	if (!args.length) {
		return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
	}

	message.channel.send(`Command name: ${command}\nArguments: ${args}`);
}
```

If you try it out, you'll get something like this:

![Arguments testing](assets/img/w3F8C63.png)

Looks good! Don't worry about the comma separation; that's the expected output when trying to send an array as a string.

Now that you have an array of arguments, you can interact with it accordingly! Try out this small addition to the command:

```js
else if (command === 'args-info') {
	if (!args.length) {
		return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
	}
	else if (args[0] === 'foo') {
		return message.channel.send('bar');
	}

	message.channel.send(`First argument: ${args[0]}`);
}
```

So if the first argument provided is equal to "foo", then send back "bar". Otherwise, just send back the argument the user provided.

![foo bar example](assets/img/v3Ocywd.png)

#### Caveats

Currently, you're using `.split(' ')` to split the command arguments. However, there's actually a slight issue with this. As is, it'll split the string by each and every space. Well, what happens if someone accidentally (or even purposely) adds additional spaces? Here's what:

![extra spaces args](assets/img/DMuC8t1.png)

If you've never done something like this before, this probably isn't what you'd expect, right? Thankfully, there's a simple solution for this issue. The red line is what to remove, and the green line is what to replace it with.

```diff
- const args = message.content.slice(prefix.length).split(' ');
+ const args = message.content.slice(prefix.length).split(/ +/);
```

![extra spaces args fixed](assets/img/ibSgjAC.png)

Awesome! Nothing to worry in that regard about now. You're now using something called a "regular expression" (commonly referred to as "regex") to handle that small (but important) bug.

## Common situations with arguments

Here is where we'll be going over a few common situations where you'll want to make sure that an argument fits a certain criteria.

### Mentions

Using the example of a kick command, you most likely want it to allow the user to use the command and mention the person to kick, right? We won't actually be constructing the full kick command in this example, but here's how you can go about it:

```js
else if (command === 'kick') {
	// grab the "first" mentioned user from the message
	// this will return a `User` object, just like `message.author`
	const taggedUser = message.mentions.users.first();

	message.channel.send(`You wanted to kick: ${taggedUser.username}`);
}
```

And as you can see, it works!

![user mention example](assets/img/AsAa9dV.png)

But what happens if you try to use the command without mentioning anybody? If you try it yourself, you'll notice that the bot doesn't respond (due to it crashing), and you should see something like this in your console:

```
message.channel.send(`You wanted to kick: ${taggedUser.username}`);
                                                      ^

TypeError: Cannot read property 'username' of undefined
```

That's because you're trying to access the `username` property of a user you didn't mention! Since `message.mentions.users` is a Collection and you're trying to call `.first()` on an empty Collection, it'll return `undefined`. You can add a quick sanity check above the `const taggedUser = ...` line to prevent this from happening.

```js
if (!message.mentions.users.size) {
	return message.reply('you need to tag a user in order to kick them!');
}
```

<p class="tip">If you're wondering what `message.reply()` does, it's just an alternative for `message.channel.send()` which also prepends a mention of the person who sent the message, unless used in a DM. It can be very useful for providing feedback!</p>

Since `message.mentions.users` is a Collection, it has a `.size` property. If no users are mentioned, it'll return 0 (which is a `falsy` value), meaning you can do `if (!value)` to check if it's falsy.

If you try again, it should work as expected.

![after sanity check](assets/img/9chaOim.png)

#### Working with multiple mentions

Let's say you have some sort of `!avatar` command, where it'll display the avatar of all the mentioned users, or your own avatar if no users were mentioned. Focus on that 2nd part for now - how would you go about displaying your own avatar if no users were mentioned? Taking the snippet for the code you just used, you can do it just like this:

```js
else if (command === 'avatar') {
	if (!message.mentions.users.size) {
		return message.channel.send(`Your avatar: ${message.author.displayAvatarURL}`);
	}

	// ...
}
```

<p class="warning">Depending on your discord.js version, the `.displayAvatarURL` part may vary. On v12, it'll be `.displayAvatarURL()` (a method), and on v11, it'll be `.displayAvatarURL` (a property). You can check what version you're running by using the `npm ls discord.js` command in your console.</p>

That part is simple; just recycle the if statement you used in the section above and displaying the link to your avatar.

![avatar command](assets/img/3Ilv3lE.png)

The next part is where it takes a turn - displaying the avatars of all the mentioned users. But it's simpler than you may think! `message.mentions.users` returns a Collection (as previously mentioned), which you can loop over in a number of different ways. You'll be using `.map()` to loop here, since it allows you to easily collect and store data in a variable in order to send 1 final message in the end, as opposed to multiple.

```js
else if (command === 'avatar') {
	if (!message.mentions.users.size) {
		return message.channel.send(`Your avatar: ${message.author.displayAvatarURL}`);
	}

	const avatarList = message.mentions.users.map(user => {
		return `${user.username}'s avatar: ${user.displayAvatarURL}`;
	});

	// send the entire array of strings as a message
	// by default, discord.js will `.join()` the array with `\n`
	message.channel.send(avatarList);
}
```

And ta-da! You now have a list of avatar links of all the users you tagged.

![avatar command multiple users](assets/img/zVUUmRs.png)

It does take up a lot of screen, but this is just an example command anyway.

### Number ranges

Sometimes you'll want users to give you input that ranges from X to Y, but nothing outside of that. Additionally, you want to make sure that they do give you an actual number and not random characters. A good example of this would be a `!prune` command, where it deletes X messages in the channel, depending on what the user inputs.

The first step would be to check if the input they gave is an actual number.

```js
else if (command === 'prune') {
	const amount = parseInt(args[0]);

	if (isNaN(amount)) {
		return message.reply('that doesn\'t seem to be a valid number.');
	}

	// ...
}
```

And if you test it, it should work as expected.

![isNaN test](assets/img/lhuPYta.png)

So what you need to do next is check if the first argument is between X and Y. Following the idea of a prune command, you'll most likely want to use the `.bulkDelete()` method, which allows you to delete multiple messages in one fell swoop.

With that being said, that method does have its limits: you can only delete a minimum of 2 and a maximum of 100 messages (at a time). Fortunately, there are a few ways to deal with that. One of those ways would be to just check the value of the `amount` variable, like so:

```js
if (isNaN(amount)) {
	return message.reply('that doesn\'t seem to be a valid number.');
}
else if (amount < 2 || amount > 100) {
	return message.reply('you need to input a number between 2 and 100.');
}

// ...
```

Now all that's left is to delete the messages! It's a simple single line of code:

```js
message.channel.bulkDelete(amount);
```

And you've got a working prune command! Create a test channel, send a few random messages, and test it out.

#### Caveats

You should note that there are actually a few caveats with the `.bulkDelete()` method. The first would be the trying to delete messages older than 2 weeks, which would normally error. Here's an easy fix for that:

```js
message.channel.bulkDelete(amount, true);
```

The second parameter in the `.bulkDelete()` method will filter out messages older than 2 weeks if you give it a truthy value. So if there are 50 messages and 25 of them are older than 2 weeks, it'll only delete the first 25 without throwing an error. However, if all the messages you're trying to delete are older than 2 weeks, then it will still throw an error. Knowing this, you should catch that error by chaining a `.catch()`.

```js
message.channel.bulkDelete(amount, true).catch(err => {
	console.error(err);
	message.channel.send('there was an error trying to prune messages in this channel!');
});
```

<p class="tip">If you aren't familiar with the `.catch()` method, it's used to catch errors on Promises. Unsure what Promises are? Google around for more info!</p>

The other caveat with this is that the `!prune {number}` message you sent will also count towards the amount deleted. What this means is that if you send `!prune 2`, it'll delete that message and only one other. There are a couple ways around this, but we'll be taking the easiest route for the sake of the tutorial. Here are the edits to make to your current code:

```diff
- const amount = parseInt(args[0]);
+ const amount = parseInt(args[0]) + 1;
```

```diff
- else if (amount < 2 || amount > 100) {
-	return message.reply('you need to input a number between 2 and 100.');
- }
+ else if (amount <= 1 || amount > 100) {
+	return message.reply('you need to input a number between 1 and 99.');
+ }
```

## Resulting code

If you want to compare your code to the code we've constructed so far, you can review it over on the GitHub repository [here](https://github.com/discordjs/Making-Bots-with-Discord.js/tree/master/code_samples/creating-your-bot/commands-with-user-input).
