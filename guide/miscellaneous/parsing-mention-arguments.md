# Parsing mention arguments

In a previous chapter, you learned how to build commands with user input; you also learned how to use *mentions* as user input.
However, using `message.mentions` can lead to a few problems.  
For example, you do not know which mention belongs to which argument.
Or if you are splitting the message's content by spaces to get the args,
The mentions will still take up space in your args array, messing up the rest of your args parsing if you are not careful.

Say you are writing a bot for moderating your server. You will want a kick or a ban command, which allows you to mention the person you are trying to ban.
But what happens if you try to use the command like this?

<div is="discord-messages">
	<discord-message profile="user">
		!ban <mention>Offender</mention> Because they were rude to <mention>Victim</mention>.
	</discord-message>
</div>

You might expect it to ban @Offender because that is who you mentioned first.
However, the Discord API does not send the mentions in the order they appear; They are sorted by their ID instead.

If the @Victim happens to have joined Discord before @Offender and has a smaller ID, they might get banned instead.  
Or maybe someone misuses a command, the bot might still accept it, but it will create an unexpected outcome.  
Say someone accidentally used the ban command like this:

<div is="discord-messages">
	<discord-message profile="user">
		!ban Because they were rude to <mention>Victim</mention>.
	</discord-message>
</div>

The bot will still ban someone, but it will be the @Victim again. `message.mentions.users` still contains a mention, which the bot will use. But in reality, you would want your bot to be able to tell the user they misused the command.

## How Discord mentions work

Discord uses a special syntax to embed mentions in a message. For user mentions, it is the user's ID with `<@` at the start and `>` at the end, like this: `<@86890631690977280>`. If they have a nickname, there will also be a `!` after the `@`.  
Role mentions and channel mentions work similarly. Role mentions look like `<@&134362454976102401>` and channel mentions like `<#222197033908436994>`.

That means when you receive a message from the Discord API, and it contains mentions, the message's content will contain that special syntax.  
If you send

<div is="discord-messages">
	<discord-message profile="user">
		I think we should add <mention>GoodPerson</mention> to the <mention type="role" color="#3eaf7c">Mod</mention> role.
	</discord-message>
</div>

then the `message.content` for that message will look something like this

<!-- eslint-skip -->
```js
'I think we should add <@86890631690977280> to the <@&134362454976102401> role.'
```

## Implementation

So, how do you use this new information for your bot?  
Most of your code will not change; however, instead of using `message.mentions` to find the mentioned users, you will have to do it manually.  
This may sound scary at first, but you will see it is pretty simple once you see the code.

Say you already have a simple command handler like this:

```js
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
});
```

Now you can quickly test the waters by upgrading the avatar command from [last time](/creating-your-bot/commands-with-user-input.md).
This is what we have so far. It is pretty simple; it will show the avatar of who used the command.

<branch version="11.x">

```js {3-7}
client.on('message', message => {
	// ...
	if (command === 'avatar') {
		const user = message.author;

		return message.channel.send(`${user.username}'s avatar: ${user.displayAvatarURL}`);
	}
});
```

</branch>
<branch version="12.x">

```js {3-7}
client.on('message', message => {
	// ...
	if (command === 'avatar') {
		const user = message.author;

		return message.channel.send(`${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true })}`);
	}
});
```

</branch>

But how do you get the correct user now? Well, this requires a few simple steps.  
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

As you can see, it is a relatively straightforward function.
It essentially just works itself through the structure of the mention bit by bit:
 1. Check if the mention starts with the `<@` and ends with a `>` and then remove those.
 2. If the user has a nickname and their mention contains a `!`, remove that as well.
 3. Only the ID should be left now, so use that to fetch the user from the <branch version="11.x" inline>`client.users`</branch><branch version="12.x" inline>`client.users.cache`</branch> Collection.
Whenever it encounters an error with the mention (i.e., invalid structure), it merely returns `undefined` to signal the mention is invalid.

::: tip
The `.slice()` method is used in a more advanced way here. You can read the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice) for more info.
:::

Now you have a nifty function you can use to convert a raw mention into a proper user object.
Plugging it into the command will give you this:

<branch version="11.x">

```js {4-11}
client.on('message', message => {
	// ...
	if (command === 'avatar') {
		if (args[0]) {
			const user = getUserFromMention(args[0]);
			if (!user) {
				return message.reply('Please use a proper mention if you want to see someone elses avatar.');
			}

			return message.channel.send(`${user.username}'s avatar: ${user.displayAvatarURL}`);
		}

		return message.channel.send(`${message.author.username}, your avatar: ${message.author.displayAvatarURL}`);
	}
});
```

</branch>
<branch version="12.x">

```js {4-11}
client.on('message', message => {
	// ...
	if (command === 'avatar') {
		if (args[0]) {
			const user = getUserFromMention(args[0]);
			if (!user) {
				return message.reply('Please use a proper mention if you want to see someone elses avatar.');
			}

			return message.channel.send(`${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true })}`);
		}

		return message.channel.send(`${message.author.username}, your avatar: ${message.author.displayAvatarURL({ dynamic: true })}`);
	}
});
```

</branch>

And here, we plug the new function into the command.  
If the user-supplied an argument, it should be the user mention, so it just gets passed right into the function.

And that is it! Simple, isn't it? Start up your bot and see if it works.

<div is="discord-messages">
	<discord-message author="AnotherUser" avatar="green">
		!avatar <mention profile="user" />
	</discord-message>
	<discord-message profile="bot">
		User's avatar:
		<a href="https://cdn.discordapp.com/avatars/328037144868290560/1cc0a3b14aec3499632225c708451d67.png" target="_blank" rel="noreferrer noopener">https://cdn.discordapp.com/avatars/328037144868290560/1cc0a3b14aec3499632225c708451d67.png</a>
		<br />
		<img src="https://cdn.discordapp.com/avatars/328037144868290560/1cc0a3b14aec3499632225c708451d67.png" alt="" />
	</discord-message>
</div>

So now, instead of using `message.mentions`, you can use your new, fantastic function.
This will allow you to add proper checks for all your args so that you can tell when a command is and isn't used correctly.

But this does not mark the end of the page. If you feel adventurous, you can read on and learn how to use Regular Expressions to easily convert a mention into a user object in just two lines.

### Ban command

You now know how to parse user mentions for a simple command like the avatar command. However, the avatar command does not benefit from it as much as the intro's example.

When writing a ban command where a mention might appear in the reason, manual parsing mentions is a lot more important. You can see an example of how to do it as follows:

<branch version="11.x">

```js {1,3-21}
client.on('message', async message => {
	// ...
	if (command === 'ban') {
		if (args.length < 2) {
			return message.reply('Please mention the user you want to ban and specify a ban reason.');
		}

		const user = getUserFromMention(args[0]);
		if (!user) {
			return message.reply('Please use a proper mention if you want to ban someone.');
		}

		const reason = args.slice(1).join(' ');
		try {
			await message.guild.ban(user, { reason });
		} catch (error) {
			return message.channel.send(`Failed to ban **${user.tag}**: ${error}`);
		}

		return message.channel.send(`Successfully banned **${user.tag}** from the server!`);
	}
});
```

</branch>
<branch version="12.x">

```js {1,3-21}
client.on('message', async message => {
	// ...
	if (command === 'ban') {
		if (args.length < 2) {
			return message.reply('Please mention the user you want to ban and specify a ban reason.');
		}

		const user = getUserFromMention(args[0]);
		if (!user) {
			return message.reply('Please use a proper mention if you want to ban someone.');
		}

		const reason = args.slice(1).join(' ');
		try {
			await message.guild.members.ban(user, { reason });
		} catch (error) {
			return message.channel.send(`Failed to ban **${user.tag}**: ${error}`);
		}

		return message.channel.send(`Successfully banned **${user.tag}** from the server!`);
	}
});
```

</branch>

Now if you send a command like the following you can always be sure it will use the mention at the very front to figure out who to ban, and will properly validate the mention:

<div is="discord-messages">
	<discord-message profile="user">
		!ban <mention>Offender</mention> because they were rude to <mention>Victim</mention>.
	</discord-message>
</div>

### Using Regular Expressions

Previously you learn how to use rudimentary string-related functions to turn the special mention syntax Discord uses into a proper discord.js User object.
But using Regular Expressions (aka "RegEx" or "RegExp"), you can condense all that logic into a single line! Crazy, right?

If you have never worked with Regular Expressions before, this might seem daunting. But in fact, you already have used regular expressions. Remember `withoutPrefix.split(/ +/);`? This little `/ +/` is a Regular Expression. The `/` on either side tell JavaScript where the Regular Expression begins and where it ends; the stuff in between is its content. 

::: tip
For a more detailed explanation, please consult the [MDN's documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp).
:::

The RegEx you will use for user mentions will look like this: `/^<@!?(\d+)>$/`.
Here is how the RegEx works:

 1. The `^` at the beginning and the `$` at the end means the mention has to take up the entire string.
 2. You have the typical `<@` and `>` at the beginning and end.
 3. The `?` after the `!` indicates that the `!` is optional.
 4. `\d+` means the RegEx will look for multiple digits, which will be the ID.
 5. The parentheses around the `\d+` create a capture group, which allows you to get the ID out of the mention.

Using the `.match()` method on strings, you can get the capture group's values, i.e., the mention's ID.

::: warning
discord.js has <docs-link path="class/MessageMentions?scrollTo=s-CHANNELS_PATTERN">built-in patterns</docs-link> for matching mentions, however as of version 11.4 they do not contain any groups
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

	// However, the first element in the matches array will be the entire mention, not just the ID,
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

	// However, the first element in the matches array will be the entire mention, not just the ID,
	// so use index 1.
	const id = matches[1];

	return client.users.cache.get(id);
}
```
</branch>

See? That is *much* shorter and not that complicated.
If you rerun your bot now, everything should still work the same.

## Resulting code

<resulting-code />
