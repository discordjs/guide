---
pageTheme: blue
---

# Throttling

Throttling is like rate-limiting; it allows the command to be used only in a certain period—a cooldown of sorts. This feature is useful for commands that rely on API calls or commands that can be spammy to avoid a user overusing them.

First, grab a command file you want to throttle.

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

Add the `throttling` property to the command. `throttling` is an object, which contains two things:

- `usages` is the number of times someone can use the command in the given time.
- `duration` is the amount of time the cooldown lasts, in seconds.

Make it have two usages allowed in ten seconds.

```js {5-8}
module.exports = class MeowCommand extends Command {
	constructor(client) {
		super(client, {
			// ...
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
	}
};
```

The command now has a cooldown. If a user tries to use the `meow` command more than two times in ten seconds, it will not allow them to use it until the ten seconds have fully passed. While useless in a command like `meow`, this can be very useful for other, heavier commands you don't want others to abuse.
