## Commands with user input (a.k.a. "arguments")

Sometimes you'll want to determine the result of a command depending on user input. It's a very common case with a very simple solution. This section will teach you how to extract user input from a message and use it in your code. Generally, you'll hear other people refer to this as "arguments", and you should refer to them as arguments as well. 

### Basic arguments

We'll actually be tackling 2 things at once here. Things will be explained along the way, so don't worry if you don't understand immediately.<br />Go to your main bot file and find the `client.on('message', message => ...)` bit. Inside of it, add these 4 lines at the very top of it.

```js
if (!message.content.startsWith(prefix) || message.author.bot) return;

const command = message.content.slice(prefix.length).split(' ')[0].toLowerCase();
const args = message.content.split(' ').slice(1);
```

And here's the code again with some comments to explain it all:
```js
// if the message doesn't start with the prefix,
// or if it's coming from a bot, stop the code entirely
if (!message.content.startsWith(prefix) || message.author.bot) return;

// take the message content, cut off the prefix, and then "split" it
// accessing the array with `[0]`, we'll get the command name (`kick`)
const command = message.content.slice(prefix.length).split(' ')[0].toLowerCase();

// take the message content, "split" it by spaces
// use `.slice(1)` to remove the command name from the args
const args = message.content.split(' ').slice(1);
```

Hopefully that's a bit clearer, if there was any confusion. Let's create a quick command to check out the result of our new addition:

```js
// using the new `command` variable, we can make this easier to type!
// you can switch your other commands to this format as well
else if (command === 'info') {
	// if we don't provide any arguments...
	if (!args.length) {
		return message.reply('you didn\'t provide any arguments!');
	}

	// using template literals!
	message.channel.send(`Command name: ${command}\nArguments: ${args}`);
}
```

If you try it out, you'll get something like this:

![Arguments testing](http://i.imgur.com/uZS0Xdl.png)

Looks good! Don't worry about the comma separation; that's the expected output when trying to send an array as a string.

<p class="tip">If you're wondering what `message.reply()` does, it's just a shortcut for `message.channel.send()` which also prepends a mention of the person who sent the message, unless used in a DM. It can be very useful for providing feedback!</p>

Now that we have an array of arguments, we can interact with them accordingly! Try out this small addition to the command:

```js
else if (command === 'info') {
	if (!args.length) {
		return message.reply('you didn\'t provide any arguments!');
	}

	// if the first result is equal to "foo"...
	if (args[0] === 'foo') {
		// stop the code here and send back "bar"
		return message.channel.send('bar');
	}

	message.channel.send(`First argument: ${args[0]}`);
}
```

So if the first argument we provide is equal to "foo", then we send back "bar". Otherwise, we just send back the argument the user provided.

![foo bar example](http://i.imgur.com/pQttV6u.png)

#### Caveats

Currently, we're using `.split(' ')` to split our arguments. However, there's actually a slight issue with this. As is, it'll split the string by each and every space. Well, what happens if we accidentally (or even purposely) add additional spaces? Here's what:

![extra spaces args](http://i.imgur.com/qBkMiaK.png)

If you've never done something like this before, this probably isn't what you'd expect, right? Thankfully, there's a simple solution for this issue. The red line is what to remove, and the green line is what to replace it with.

```diff
- const args = message.content.split(' ').slice(1);
+ const args = message.content.split(/ +/g).slice(1);
```

![extra spaces args fixed](http://i.imgur.com/XGZYm6i.png)

Awesome! Nothing to worry in that regard about now. We're now using something called a "regular expression" (commonly referred to as "regex") to handle our small bug.

## Common situations with arguments

Here is where we'll be going over a few common situations where you'll want to make sure that an argument fits a certain criteria.

### Mentions

Continuing with the example of a kick command, you most likely want it to allow the user to use the command and mention the person to kick, right? We won't actually be constructing the full kick command in this example, but here's how you can go about it:

```js
else if (command === 'kick') {
	// grab the "first" mentioned user from the message
	// this will return a `User` object, just like `message.author`
	const taggedUser = message.mentions.users.first();

	message.channel.send(`You wanted to kick: ${taggedUser.username}`);
}
```

And as you can see, it works!

![user mention example](http://i.imgur.com/AsAa9dV.png)

But what happens if we try to use the command without mentioning anybody? If you try it yourself, you'll notice that the bot doesn't respond (due to it crashing), and you should see something like this in your console:
```
message.channel.send(`You wanted to kick: ${taggedUser.username}`);
                                                      ^

TypeError: Cannot read property 'username' of undefined
```

That's because we're trying to access the `username` property of a user we didn't mention! We can add a quick sanity check above the `const taggedUser = ...` line to prevent this from happening.

```js
if (!message.mentions.users.size) {
	return message.reply('you need to tag a user in order to kick them!');
}
```

Since `message.mentions.users` is a Collection, it has a `.size` property. If no users are mentions, it'll return 0 (which is a `falsy` value), meaning we can do `if (!item)` to check if it's falsy. If you don't know much about Collections, don't worry for now; you can read more about them later in [this section of the guide](/path/to/collections/section).

Anyway, if we try again, it should work as expected.

![after sanity check](http://i.imgur.com/9chaOim.png)

#### Working with multiple mentions

Let's say you have some sort of `!avatar` command, where it'll display the avatar of all the mentioned users, or your own avatar if no users were mentioned. Focus on that 2nd part for now - how would you go about displaying your own avatar if no users were mentioned?<br />Taking the snippet for the code we just used, you can do it just like this:

```js
else if (command === 'avatar') {
	// if no users were mentioned...
	if (!message.mentions.users.size) {
		return message.channel.send(`Your avatar: ${message.author.displayAvatarURL}`);
	}

	// rest of code to be added...
}
```

<p class="warning">Depending on your discord.js version, the `.displayAvatarURL` part may vary. On v12 and above, it'll be `.displayAvatarURL()` (a method), and on anything below, it'll be `.displayAvatarURL` (a property). You can check what version you're running by using the `npm ls discord.js` command in your console.</p>

That part is simple; we're just recyling the if statement we used in the section above and displaying the link to your avatar.

![avatar command](http://i.imgur.com/3Ilv3lE.png)

The next part is where it takes a turn - displaying the avatars of all the mentioned users. But it's simpler than you may think! `message.mentions.users` returns a Collection (as previously mentioned), which you can loop over in a number of different ways. We'll be using `.map()` to loop through, since it's the one of easiest, as well as the fact that we need to collect and store data in order to send 1 final message in the end, as opposed to multiple.

```js
else if (command === 'avatar') {
	if (!message.mentions.users.size) {
		return message.channel.send(`Your avatar: ${message.author.displayAvatarURL}`);
	}

	// loop through all the mentioned users and then
	// return a string with their username and avatar URL
	const avatarList = message.mentions.users.map(user => {
		return `${user.username}'s avatar: ${user.displayAvatarURL}`;
	});

	// send the entire array of strings as a message
	// by default, it'll `.join()` the array with `\n`
	message.channel.send(avatarList);
}
```

And ta-da! You now have a list of avatar links of all the users you tagged.

![avatar command multiple users](http://i.imgur.com/zVUUmRs.png)

It does take up a lot of screen, but this is just an example command anyway.

### Number ranges

Sometimes you'll want users to give you input that ranges from X to Y, but nothing outside of that. Additionally, you want to make sure that they do give you an actual number and not random characters. A good example of this would be a `!prune` command, where it deletes X messages in the channel, depending on what the user inputs.

The first step would be to check if the input we give is an actual number.

```js
else if (command === 'prune') {
	// convert the first argument to a number first
	const amount = parseInt(args[0]);

	// if the amount is NaN (Not a Number), then let them know
	if (isNaN(amount)) {
		return message.reply('that doesn\'t seem to be a valid number.');
	}

	// rest of the code here...
}
```

And if you test it, it should work as expected.

![isNaN test](http://i.imgur.com/lhuPYta.png)

So what we need to do next is check if the first argument is between X and Y. Following the idea of a prune command, you'll most likely want to use the `.bulkDelete()` method, which allows you to delete multiple messages in one fell swoop. With that being said, that method does have its limits - you can only delete a minimum of 2 and a maximum of 100 messages (at a time). There's a few ways to deal with that, so let me show you one of them.

```js
if (isNaN(amount)) {
	return message.reply('that doesn\'t seem to be a valid number.');
}
// if the amount is less than 2 or more than 100, let them know again
if (amount < 2 || amount > 100) {
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

You should note that there are actually a few caveats with the `.bulkDelete()` method. The first would be the trying to delete messages older than 2 weeks. Here's an easy fix for that:

```js
message.channel.bulkDelete(amount, true);
```

The 2nd parameter in the `.bulkDelete()` method is called `filterOld` - it will filter out messages older than 2 weeks automatically. So if there are 50 messages and 25 of them are older than 2 weeks, it'll only delete the first 25 without throwing an error. However, if all the messages you're trying to delete are older than 2 weeks, then it will still throw an error. Knowing this, we should catch that error by chaining a `.catch()`.

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

