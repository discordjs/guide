# Parsing mention arguments

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

## How Discord mentions work

Discord uses a special syntax to embed mentions in a message. For user mentions it is the user's ID with `<@` at the start and `>` at the end, like this: `<@86890631690977280>`. If they have a nickname there will also be a be a `!` after the `@`.  
Role mentions and channel mentions work similarly. Role mentions look like `<@&134362454976102401>` and channel mentions like `<#222197033908436994>`.

That means when you receive a message from the Discord API and it contains mentions the message's content will contain that special syntax.  
If you send

<div is="discord-messages">
	<discord-message author="User" avatar="djs">
		I think we should add <mention>GoodPerson</mention> to the <mention>Mod</mention> role.
	</discord-message>
</div>

then the `message.content` for that message will look something like this

<!-- eslint-skip -->
```js
'I think we should add <@86890631690977280> to the <@&134362454976102401> role.'
```

## Implementation

So, how do you actually use this new information for your bot?  
Most of your code will not change, however instead of using `message.mentions` to find the mentioned users you will have to do it manually.  
This may sound scary at first, but once you see the code you will see it is actually pretty simple.

Say you already have a simple command handler like this:

```js
client.on('message', message => {
	if (!message.content.startsWith(config.prefix)) return;

	const withoutPrefix = message.content.slice(config.prefix.length);
	const split = withoutPrefix.split(/ +/);
	const command = split[0];
	const args = split.slice(1);
});
```

Now you can easily test the waters by upgrading the avatar command from [last time](/creating-your-bot/commands-with-user-input.md).
This is what we have so far. It is pretty simple, it will show the avatar of who used the command.

<branch version="11.x">

```js
if (command === 'avatar') {
	const user = message.author;

	return message.channel.send(`${user.username}'s avatar: ${user.displayAvatarURL}`);
}
```

</branch>
<branch version="12.x">

```js
if (command === 'avatar') {
	const user = message.author;

	return message.channel.send(`${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true })}`);
}
```

</branch>

But how do you actually get the correct user now? Well, this requires a few simple steps.  
Putting it into a function will make it easily reusable. We will use the name `getUserFromMention` here.

<branch version="11.x">

```js
function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.get(mention);
	}
}
```

</branch>
<branch version="12.x">

```js
function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
}
```

</branch>

As you can see it is a fairly straight forward function.
It essentially just works itself through the structure of the mention bit by bit:
 1. Check if the mention starts with the `<@` and ends with a `>` and then remove those.
 2. If the user has a nickname and their mention contains a `!` remove that as well.
 3. Only the ID should be left now, so use that to fetch the user from the <branch version="11.x" inline>`client.users`</branch><branch version="12.x" inline>`client.users.cache`</branch> Collection.
Whenever it encounters an error with the mention (i.e. invalid structure) it simply returns `undefined` to signal the mention is invalid.

::: tip
The `.slice()` method is used in a more advance way here. You can read the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice) for more info.
:::

Now you have a nifty function you can use whenever you need to convert a raw mention into a proper user object.
Plugging it into the command will give you this:

<branch version="11.x">

```js
if (command === 'avatar') {
	if (args[0]) {
		const user = getUserFromMention(args[0]);
		if (!user) {
			return message.reply('Please use a proper mention if you want to see someone else\'s avatar.');
		}

		return message.channel.send(`${user.username}'s avatar: ${user.displayAvatarURL}`);
	}

	return message.channel.send(`${message.author.username}, your avatar: ${message.author.displayAvatarURL}`);
}
```

</branch>
<branch version="12.x">

```js
if (command === 'avatar') {
	if (args[0]) {
		const user = getUserFromMention(args[0]);
		if (!user) {
			return message.reply('Please use a proper mention if you want to see someone else\'s avatar.');
		}

		return message.channel.send(`${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true })}`);
	}

	return message.channel.send(`${message.author.username}, your avatar: ${message.author.displayAvatarURL({ dynamic: true })}`);
}
```

</branch>

And here we simply plug the new function into the command.  
If the user supplied an argument it should be the user mention, so it just gets passed right into the function.

And that is it! Simple, isn't it? Start up your bot and see if it works.

<div is="discord-messages">
	<discord-message author="AnotherUser" avatar="green">
		!avatar <mention>User</mention>
	</discord-message>
	<discord-message author="User" avatar="blue" :bot="true">
		User's avatar: https://cdn.discordapp.com/avatars/328037144868290560/1cc0a3b14aec3499632225c708451d67.png
	</discord-message>
</div>

So now, instead of using `message.mentions` you can use your new, fantastic function.
This will allow you to add proper checks for all your args, so that you can tell when a command was used correctly and when it was used incorrectly.

But this does not mark the end of the page. If you feel adventurous you can read on and learn how to use Regular Expressions to easily convert a mention into a user object in just two lines.

### Using Regular Expressions

Previously you learn how to use rudimentary string related functions to turn the special mention syntax Discord uses into a proper discord.js User object.
But using Regular Expressions (aka "RegEx" or "RegExp"), you can condense all that logic into a single line! Crazy, right?

If you have never worked with Regular Expressions before, this might seem daunting. But in fact, you already have used regular expressions. Remember `withoutPrefix.split(/ +/);`? This little `/ +/` is actually a Regular Expression. The `/` on either side tell JavaScript where the Regular Expression begins and where it ends, the stuff inbetween is it is content. 

::: tip
For a more detailed explanation please consult the [MDN's documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp).
:::

The RegEx you will use for user mentions will look like this: `/^<@!?(\d+)>$/`.
Here is how the RegEx works:

 1. The `^` at the beginning and the `$` at the end mean that the mention has to take up the entire string.
 2. You have the typical `<@` and `>` at the beginning and end.
 3. The `?` after the `!` indicates that the `!` is optional.
 4. `\d+` means the RegEx will look for multiple digits, which will be the ID.
 5. The parentheses around the `\d+` create a capture group, which allows us to get the ID out of the mention.

Using the `.match()` method on strings you can get the values of the capture group, i.e., the ID of the mention.

::: warning
Discord.js has <branch version="11.x" inline>[built-in patterns](https://discord.js.org/#/docs/main/v11/class/MessageMentions?scrollTo=s-CHANNELS_PATTERN)</branch><branch version="12.x" inline>[built-in patterns](https://discord.js.org/#/docs/main/stable/class/MessageMentions?scrollTo=s-CHANNELS_PATTERN)</branch>
for matching mentions, however as of version 11.4 they do not contain any groups
and thus aren't useful for actually getting the ID out of the mention.
:::

Updating your `getUserFromMention` function to use RegEx gives you this:

<branch version="11.x">

```js
function getUserFromMention(mention) {
	// The id is the first and only match found by the RegEx.
	const matches = mention.match(/^<@!?(\d+)>$/);

	// If supplied variable was not a mention, matches will be null instead of an array.
	if (!matches) return;

	// However the first element in the matches array will be the entire mention, not just the ID,
	// so use index 1.
	const id = matches[1];

	return client.users.get(id);
}
```

</branch>
<branch version="12.x">

```js
function getUserFromMention(mention) {
	// The id is the first and only match found by the RegEx.
	const matches = mention.match(/^<@!?(\d+)>$/);

	// If supplied variable was not a mention, matches will be null instead of an array.
	if (!matches) return;

	// However the first element in the matches array will be the entire mention, not just the ID,
	// so use index 1.
	const id = matches[1];

	return client.users.cache.get(id);
}
```
</branch>

See? That is *much* shorter, and not that complicated.
If you run your bot again now everything should still work the same.

## Resulting code

<resulting-code />
