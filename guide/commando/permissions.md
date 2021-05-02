---
pageTheme: blue
---

# Handling permissions

Sometimes you may need a user to have a specific permission to use a command, or maybe your bot needs a permission to make the command work. Well, Commando makes both of these very simple.

## User and client permissions

First, grab the command that you want to have permissions.

```js
const { Command } = require('discord.js-commando');

module.exports = class MeowCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'meow',
			group: 'first',
			memberName: 'meow',
			description: 'Replies with a meow, kitty cat.',
		});
	}

	run(message) {
		return message.say('Meow!');
	}
};
```

You can then use the `userPermissions` and `clientPermissions` options to check for certain permissions. If you wanted to restrict the `meow` command, requiring the member to have the ability to manage messages and the client full administrator access, you'd do the following:

```js {5-6}
module.exports = class MeowCommand extends Command {
	constructor(client) {
		super(client, {
			// ...
			clientPermissions: ['ADMINISTRATOR'],
			userPermissions: ['MANAGE_MESSAGES'],
		});
	}
};
```

All you need to do is set the properties to an array of permission flags. A list of those can be found <docs-link path="class/Permissions?scrollTo=s-FLAGS">here</docs-link>.

## Owner-only commands

Another thing you may want to do is set a command as owner-only. This option will make a command only usable by the bot owner(s). Doing this is even simpler than the client/userPermissions; all you have to do is set the `ownerOnly` parameter to `true`.

```js {5}
module.exports = class MeowCommand extends Command {
	constructor(client) {
		super(client, {
			// ...
			ownerOnly: true,
		});
	}
};
```
