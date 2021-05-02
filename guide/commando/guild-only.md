---
pageTheme: blue
---

# Setting a command as guild-only

Sometimes, you may need to require a command to only be usable in servers. Maybe it displays server information or gets a server emoji. No matter what it does, setting it as guild-only is straightforward!

First, get the command you want to make guild-only.

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

After `description`, add a `guildOnly` setting and set it to `true`.

```js {5}
module.exports = class MeowCommand extends Command {
	constructor(client) {
		super(client, {
			// ...
			guildOnly: true,
		});
	}
};
```

And that's all there is to it! When used in a DM, the bot will not permit the command's use, and you will no longer receive errors!
