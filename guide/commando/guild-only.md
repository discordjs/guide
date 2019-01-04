---
forceTheme: blue
---

# Setting a command as guild-only

Sometimes, you may need to require a command to only be usable in servers. Maybe it displays server information, maybe it gets a server emoji, no matter what it does, setting it as guild-only is very simple!

First, go get the command you want to make guild-only.

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

<!-- eslint-skip -->

```js
super(client, {
	name: 'meow',
	group: 'first',
	memberName: 'meow',
	description: 'Replies with a meow, kitty cat.',
	guildOnly: true,
});
```

And that's all there is to it! Now when used in a DM, the bot will not permit the command to be used, and you will no longer receive errors!
