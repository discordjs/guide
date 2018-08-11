## Parsing mention arguments

In a previous chapter you learned how to build commands with user input, you also learned how to use *mentions* as user input.
However, using `message.mentions` can lead to a few problems.  
For example you do not really know which mention belongs to which argument.
Or if you are splitting the message's content by spaces to get the args,
then the mentions will still take up space in your args array which can mess up the rest of your args parsing if you are not careful.

Say you are writing a bot for moderating your server. Obviously you will want a kick or a ban command which allows you to mention the person you are trying to ban.
But what happens if you try to use the command like this?

```
!ban @Offender Because he was rude to @Victim
```

You might expect it to ban @Offender, because that is who you mentioned first.
However, the Discord API does not send the mentions in the order they appear; They are sorted by their ID instead.

If the @Victim happens to have joined Discord before @Offender and thus has a smaller ID he might get banned instead.  
Or maybe someone uses a command incorrectly, the bot might still accept it but it will create an unexpected outcome.  
Say someone accidentally used the ban command like this:

```
!ban Because he was rude to @Victim
```

The bot will still ban someone, but it will be the @Victim again. `message.mentions.users` still contains a mention, which the bot will use. But in reality you would want your bot to be able to tell the user he used the command incorrectly.

### How Discord mentions work

Discord uses a special syntax to embed mentions in a message. For user mentions it is the user's ID with `<@` at the start and `>` at the end, like this: `<@86890631690977280>`. If they have a nickname there will also be a be a `!` after the `@`.  
Role mentions and channel mentions work similarly. Role mentions look like `<@&134362454976102401>` and channel mentions like `<#222197033908436994>`.

That means when you receive a message from the Discord API and it contains mentions the message's content will contain that special syntax.  
If you send

```
I think we should add @GoodPerson to the @Mod role.
```

then the `message.content` for that message will look something like this

<!-- eslint-skip -->
```js
'I think we should add <@86890631690977280> to the <@&134362454976102401> role.'
```

### Implementation

So, how do you actually use this new information for your bot?  
Most of your code will not change, however instead of using `message.mentions` to find the mentioned users you will have to do it manually.  
This may sound scary at first, but once you see the code you will see it is actually pretty simple.

Say you already have a simple command handler like this:

```js
client.on('message', message => {
	// Don not go any further if there is no command prefix.
	if (!message.content.startsWith(config.prefix)) return;

	// Remove the prefix from the message.
	const withoutPrefix = message.content.slice(config.prefix.length);
	// Split the message by spaces
	const split = withoutPrefix.split(/ +/);
	// The first element is the command, the rest are the arguments.
	const command = split[0];
	const args = split.slice(1);

	// ....Some commands here....
});
```

Now you can easily test the waters by upgrading the avatar command from last time.
This is what we have so far. It is pretty simple, it will show the avatar of who used the command.

```js
if (command === 'avatar') {
	// What to put here to use the mention?
	const user = message.author;

	return message.channel.send(`${user.username}'s avatar: ${user.displayAvatarURL}`);
}
```

But how do you actually get the correct user now? Well, this requires a few simple steps.  
Putting it into a function will make it easily reusable. We will use the name `getUserFromMention` here.

```js
function getUserFromMention(mention) {
	// Check if `mention` contains a string.
	// If not, just return undefined to signal there is no user to be found.
	if (!mention) return undefined;

	// A user mention starts with <@ as well as a > at the end,
	// so check for those.
	if (mention.startsWith('<@') && mention.endsWith('>')) {
		// Now remove the <@ and >, they are not necessary.
		mention = mention.slice(2, -1);

		// If the user has a nickname they will also have a ! in their mention.
		// Remove that as well.
		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		// Now all that is left should be the ID,
		// which can be used to get the user object.
		const user = client.users.get(mention);
		// The ID might be invalid, so check for that as well.
		if (!user) {
			// Just return undefined to indicate nothing was found.
			return undefined;
		}
		else {
			// A user was found, so return that.
			return user;
		}
	}

	// Return undefined here as well.
	// If the code reaches this point nothing was found.
	return undefined;
}
```

<p class="tip">The `slice` method is used in a more advance way here. You can read the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice) for more info.</p>

Now you have a nifty function you can use whenever you need to convert a raw mention into a proper user object.
Plugging it into the command will give you this:

```js
if (command === 'avatar') {
	// First check if the user even tried to supply a mention arg
	if (args[0]) {
		// If he did try to turn that mention into a user object.
		// The first argument should be the mention, so pass it to the function.
		const user = getUserFromMention(args[0]);

		// The function can return undefined, in which case notify
		// the user that the argument was invalid.
		if (!user) {
			return message.reply('Please use a proper mention if you want to see someone else\'s avatar.');
		}
		else {
			return message.channel.send(`${user.username}'s avatar: ${user.displayAvatarURL}`);
		}
	}
	else {
		return message.channel.send(`${message.author.username}, your avatar: ${message.author.displayAvatarURL}`);
	}
}
```

And that is it! Simple, isn't it? Start up your bot and see if it works.

![Test with string function](assets/img/qEIaiam.png)

Lo and behold, it does work.

So now, instead of using `message.mentions` you can use your new, fantastic function.
This will allow you to add proper checks for all your args, so that you can tell when a command was used correctly and when it was used incorrectly.

But this does not mark the end of the page. If you feel adventurous you can read on and learn how to use Regular Expressions to easily convert a mention into a user object in just two lines.

### Using Regular Expressions

Previously you learn how to use rudimentary string related functions to turn the special mention syntax Discord uses into a proper Discord.js User object.
But using Regular Expressions (aka "RegEx" or "RegExp"), you can condense all that logic into a single line! Crazy, right?

If you have never worked with Regular Expressions before, this might seem daunting. But in fact, you already have used regular expressions. Remember `withoutPrefix.split(/ +/);`? This little `/ +/` is actually a Regular Expression. The `/` on either side tell JavaScript where the Regular Expression begins and where it ends, the stuff inbetween is it is content. 

<p class="tip">For a more detailed explanation of please consult the [MDN's documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) about them.</p>

The RegEx you will use for user mentions will look like this: `/^<@!?(\d+)>$/`.
That does not look too bad, does it? The ^ at the beginning and the $ at the end mean that the mention has to take up the entire string.
Like you learned previously, the mentions start with <@ and end with >.
The `?` after the `!` indicates that the `!` is optional. `\d` in RegEx stands for any digit, the `+` means it has to be at least one digit.
Generally IDs are 17 or 18 digits long, but you do not need to enforce such a rule; the exact length of the ID does not matter.
The `\d+` is wrapped in parentheses to create a group. Groups allow you to extract information from a string.
The `match` method on strings returns all the values captured by the groups in the RegEx.

<p class="tip">
Discord.js even ships with Regular Expressions for all the different kinds of mentions.
You can find them in the [discord.js docs](https://discord.js.org/#/docs/main/stable/class/MessageMentions?scrollTo=s-CHANNELS_PATTERN).
</p>

<p class="warning">
Discord.js has [built-in patterns](https://discord.js.org/#/docs/main/stable/class/MessageMentions?scrollTo=s-CHANNELS_PATTERN)
for matching mentions, however as of version 11.4 they do not contain any groups
and thus aren't useful for actually getting the ID out of the mention.
</p>

Updating your `getUserFromMention` function to use RegEx gives you this:

```js
function getUserFromMention(mention) {
	const matches = mention.match(/^<@!?(\d+)>$/);
	// The id is the first and only match found by the RegEx.
	// However the first element in the matches array will be the entire mention, not just the ID,
	// so use index 1.
	const id = matches[1];
	// Now just get the User with the ID and return that.
	return client.users.get(id);
}
```

See? That is *much* shorter, and not that complicated.
If you run your bot again now everything should still work the same.

## Resulting code

If you want to compare your code to a working example, you can review it over on the GitHub repository [here](https://github.com/discordjs/guide/tree/master/code-samples/creating-your-bot/proper-mention-arguments).
