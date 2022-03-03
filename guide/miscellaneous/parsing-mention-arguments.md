# Parsing mentions

Discord.js is already geared to help you handle mentions using `message.mentions`.
However, there are situations where using `message.mentions` can lead to a few problems, in which case you may want to parse them on your own.  
For example, you cannot tell where the mention is located in the message's content, or if the same user/role/channel was mentioned more than once.

## How Discord mentions work

Discord uses a special syntax to embed mentions in a message. For user mentions, it is the user's ID with `<@` at the start and `>` at the end, like this: `<@86890631690977280>`. If they have a nickname, there will also be a `!` after the `@`.  
Role mentions and channel mentions work similarly. Role mentions look like `<@&134362454976102401>` and channel mentions like `<#222197033908436994>`.

That means when you receive a message from the Discord API, and it contains mentions, the message's content will contain that special syntax.  
If you send

<DiscordMessages>
	<DiscordMessage profile="user">
		I think we should add <DiscordMention>GoodPerson</DiscordMention> to the <DiscordMention type="role" role-color="#3eaf7c">Mod</DiscordMention> role.
	</DiscordMessage>
</DiscordMessages>

then the `message.content` for that message will look something like this

<!-- eslint-skip -->
```js
'I think we should add <@86890631690977280> to the <@&134362454976102401> role.'
```

## Implementation

Instead of using `message.mentions` to find say, a user, you will have to do it manually, which requires a few simple steps.

Putting it into a function will make it easily reusable. We will use the name `getUserFromMention` here.

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

As you can see, it is a relatively straightforward function.
It essentially just works itself through the structure of the mention bit by bit:
 1. Check if the mention starts with the `<@` and ends with a `>` and then remove those.
 2. If the user has a nickname and their mention contains a `!`, remove that as well.
 3. Only the ID should be left now, so use that to fetch the user from the `client.users.cache` Collection.
Whenever it encounters an error with the mention (i.e., invalid structure), it merely returns `undefined` to signal the mention is invalid.

::: tip
The `.slice()` method is used with a negative number. You can read [MDN's documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice) for information on how that works.
:::

### Using Regular Expressions

Previously you learned how to use rudimentary string-related functions to turn the special mention syntax Discord uses into a proper discord.js User object.
But using Regular Expressions (aka "RegEx" or "RegExp"), you can condense all that logic into a single line! Crazy, right?

::: tip
For a more detailed explanation, consult [MDN's documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) on regular expressions.
:::

The RegEx you will use for user mentions will look something like this: `/^<@!?(\d+)>$/`.
Here is how the RegEx works:

 1. The `^` at the beginning and the `$` at the end means the mention has to take up the entire string.
 2. You have the typical `<@` and `>` at the beginning and end.
 3. The `?` after the `!` indicates that the `!` is optional.
 4. `\d+` means the RegEx will look for multiple digits, which will be the ID.
 5. The parentheses around the `\d+` create a capture group, which allows you to get the ID out of the mention.

Using the `.match()` method on strings, you can get the capture group's values, i.e., the mention's ID.

::: tip
discord.js has <DocsLink path="class/MessageMentions?scrollTo=s-CHANNELS_PATTERN">built-in patterns</DocsLink> for matching mentions.
:::

Updating your `getUserFromMention` function to use RegEx gives you this:

```js
const { MessageMentions: { USERS_PATTERN } } = require('discord.js');

function getUserFromMention(mention) {
	// The id is the first and only match found by the RegEx.
	const matches = mention.matchAll(USERS_PATTERN).next().value;

	// If supplied variable was not a mention, matches will be null instead of an array.
	if (!matches) return;

	// The first element in the matches array will be the entire mention, not just the ID,
	// so use index 1.
	const id = matches[1];

	return client.users.cache.get(id);
}
```

That is *much* shorter, and not all that complicated!
