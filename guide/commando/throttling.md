## Throttling

Throttling is like rate-limiting, it only allows the command to be used in a certain period of time. A cooldown of sorts. This is useful for commands that rely on API calls, or commands that can be spammy, to allow them to not be overused by one user.

First, grab a command file you want to use throttling with.

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

Now, add the `throttling` property to the command. `throttling` is an object, which contains two things:

- `usages` is the amount of times the command can be used in the given time period.  
- `duration` is the amount of time the cooldown lasts, in seconds.

Let's make it have 2 usages allowed in a 10 second period.

<!-- eslint-skip -->
```js
super(client, {
	name: 'meow',
	group: 'first',
	memberName: 'meow',
	description: 'Replies with a meow, kitty cat.',
	throttling: {
		usages: 2,
		duration: 10,
	},
});
```

Now, the command has a cooldown. If a user tries to use the `meow` command more than 2 times in 10 seconds, it will not allow them to use it until the 10 seconds have fully passed. While useless in a command like `meow`, this can be very useful for other, more heavy commands you don't want abused.
