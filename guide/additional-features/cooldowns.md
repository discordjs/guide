# Cooldowns

Spam is something you generally want to avoid–especially if one of your commands requires calls to other APIs or takes a bit of time to build/send. Cooldowns are also a very common feature bot developers want to integrate into their projects, so let's get started on that!

This section assumes you followed the [Command Handling](/guide/creating-your-bot/command-handling.md) part.

First, add a cooldown key to one of your commands (we use the ping command here) exports. This determines how long the user will have to wait (in seconds) before using this specific command again.

```js {3}
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		// ...
	},
};
```

In your main file, initialize an empty [Collection](/guide/additional-info//collections.md) which you can then fill later when commands are used:

```js {1}
client.cooldowns = new Collection();
```

The keys will be the command names, and the values will be Collections associating the user id (key) to the last time (value) this specific user used this specific command. Overall the logical path to get a specific user's last usage of a specific command will be `cooldowns > command > user > timestamp`.

In your main file, add the following code:

```js {1,3-5,7-9,11-13}
const { cooldowns } = client;

if (!cooldowns.has(command.data.name)) {
	cooldowns.set(command.data.name, new Collection());
}

const now = Date.now();
const timestamps = cooldowns.get(command.data.name);
const defaultCooldownDuration = 3;
const cooldownAmount = (command.cooldown || defaultCooldownDuration) * 1000;

if (timestamps.has(interaction.user.id)) {
	// ...
}

try {
	// ...
} catch (error) {
	// ...
}
```

You check if the `cooldowns` Collection already has an entry for the command being used right now. If this is not the case, add a new entry, where the value is initialized as an empty Collection. Next, 3 variables are created:

1. `now`: The current timestamp.
2. `timestamps`: A reference to the Collection of user-ID and timestamp key/value pairs for the triggered command.
3. `cooldownAmount`: The specified cooldown from the command file, converted to milliseconds for straightforward calculation. If none is specified, this defaults to three seconds.

If the user has already used this command in this session, get the timestamp, calculate the expiration time and inform the user of the amount of time they need to wait before using this command again. Note that you use a `return` statement here, causing the code below this snippet only to execute if the interaction user has not used this command in this session or the wait has already expired.

Continuing with your current setup, this is the complete `if` statement:

```js {2,4-7}
if (timestamps.has(interaction.user.id)) {
	const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

	if (now < expirationTime) {
		const timeLeft = Math.round(expirationTime / 1000);
		return interaction.reply({ content: `Please wait <t:${timeLeft}:R> more second(s) before reusing the \`${command.data.name}\` command.`, ephemeral: true });
	}
}
```

Since the `timestamps` Collection has the user's ID in it as a key, you `.get()` it and then sum it up with the `cooldownAmount` variable to get the correct expiration timestamp. You then check to see if it's expired or not.

The previous user check serves as a precaution. It should normally not be necessary, as you will now insert a short piece of code, causing the user's entry to be deleted after the cooldown has expired. To facilitate this, you will use the node.js `setTimeout` method, which allows you to execute a function after a specified amount of time:

```js {5-6}
if (timestamps.has(interaction.user.id)) {
	// ...
}

timestamps.set(interaction.user.id, now);
setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
```

This line causes the entry for the interaction user under the specified command to be deleted after the command's cooldown time is expired for this user.

## Resulting code

<ResultingCode path="additional-features/cooldowns" />
