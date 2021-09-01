# Creating Listeners

Similar to what you learnt in [Creating Commands](./creating-commands), we will create a `listeners` folder in the same directory as your `main` file. For this page, we will make a listener for the `ready` event.

## Creating a listener class

To create a listener in Sapphire, the `Listener` class needs to be imported from `@sapphire/framework`. A listener can be exported through default or named exports.

:::: code-group
::: code-group-item CommonJS
```js
const { Listener } = require('@sapphire/framework');

module.exports = class ReadyListener extends Listener {};
// exports.default = class ReadyListener extends Listener {};
// exports.myListener = class ReadyListener extends Listener {};
```
:::
::: code-group-item ESM
```js
import { Listener } from '@sapphire/framework';

export default class ReadyListener extends Listener {}
// export class ReadyListener extends Listener {}
```
:::
::::

`module.exports` will be used for these pages. Let's begin populating the command class:

```js
module.exports = class ReadyListener extends Listener {
	constructor(context) {
		super(context, {
			once: true,
			event: 'ready',
		});
	}
};
```

An overview of what's defined in the constructor:

- `context`: an object that contains file metadata required by the `Piece` class (which `Command` extends) in order to function.
- `name`: by default, the name of the file without the extension, i.e. `ready.js` becomes `ready`, so there's no need to define it.
- `event`: by default, the resolved `name`, it defines the event to listen for.
- `once`: by default `false`, but since we want the listener to fire only once, we will set it to `true`.

If you pay attention to the example, the `event` field is unnecessary, this allows for constructor-less listeners when the file name matches the event's name.

## Creating the `run` method

Listeners have a `run` method, which executes the listener logic. Define this below the listener's constructor:

<!-- eslint-disable constructor-super -->

```js {7-8}
module.exports = class ReadyListener extends Listener {
	constructor(context) {
		// ...
	}

	run(client) {
		const { username, id } = client.user;
		this.container.logger.info(`Successfully logged in as ${username} (${id})`);
	}
};
```

<!-- eslint-enable constructor-super -->

And once discord.js emits the `ready` event, the code inside `run` will be run, and the piece will then be unloaded. This code is equivalent to the following:

```js
client.once('ready', client => {
	const { username, id } = client.user;
	container.logger.info(`Successfully logged in as ${username} (${id})`);
});
```

## Duplicated listeners

For organization purposes, you may want to create multiple listeners executing different logic that listen to the same event, for example, auto-moderation. While Sapphire does not allow you to name pieces the same, you can give them different names and specify the same `event` field. A common practice is to name the listeners by joining the event's name with the purpose of the piece, for example, if you have a `guildMemberAdd` listener that sends a log to a channel, and another that sends a greeting message, you can name them `guildMemberAddSendLog` and `guildMemberAddSendGreeting`, both of which would specify `{ event: 'guildMemberAdd' }` in their options.

## Customizing the emitter

By default, Sapphire sets the emitter as your client, however, you can specify a different emitter.

One of the options is to specify the name of the `Client`'s property that has the emitter in the following fashion:

```js {4}
module.exports = class RawGuildMemberAddListener extends Listener {
	constructor(context) {
		super(context, {
			emitter: 'ws',
			event: 'GUILD_MEMBER_ADD',
		});
	}

	run(data) {
		// `data` here is the raw packet
	}
};
```

The other way is to specify an emitter directly instead of a property name:

```js {4}
module.exports = class RawGuildMemberAddListener extends Listener {
	constructor(context) {
		super(context, {
			emitter: container.client.ws,
			event: 'GUILD_MEMBER_ADD',
		});
	}

	// ...
};
```

The code is equivalent to the following:

```js
client.ws.on('GUILD_MEMBER_ADD', data => {
	// `data` here is the raw packet
});
```
