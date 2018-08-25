## Handling Permissions

Sometimes, you may need a user to have a certain permission to use a command. Or, maybe the bot needs a permission to make the command work. Well, Commando makes both of these very simple.

### User and Client Permissions

First, go grab the command you want to use permissions with.

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

	run(msg) {
		return msg.say('Meow!');
	}
};
```

Now, just use the `userPermissions` and `clientPermissions` options to check for certain permissions. For example, say to use `meow`, the user needs the ability to Manage Messages, and the client needs full Administrator access. This is dumb, but it's just an example.

<!-- eslint-skip -->
```js
super(client, {
	name: 'meow',
	group: 'first',
	memberName: 'meow',
	description: 'Replies with a meow, kitty cat.',
	clientPermissions: ['ADMINISTRATOR'],
	userPermissions: ['MANAGE_MESSAGES'],
});
```

All you need to do is set the properties to an array of permission flags. A list of those is [here](https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS).

### Owner-Only Commands

Another thing you may want to do is set a command as owner-only. This will make a command only usable by the bot owner(s). Doing this is even simpler than the client/userPermissions, all you have to do is set the `ownerOnly` parameter to `true`.

<!-- eslint-skip -->
```js
super(client, {
	name: 'meow',
	group: 'first',
	memberName: 'meow',
	description: 'Replies with a meow, kitty cat.',
	ownerOnly: true,
});
```
