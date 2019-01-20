---
forceTheme: blue
---

# Removing the unknown command response

Sometimes, you may want to remove the unknown command response from your bot. Be it Cleverbot or some other reason, sometimes you just want it gone, and it's quite simple to remove.

Head over to your `index.js` file and find your `client` variable. You're going to be adding a new setting here.

```js
const client = new CommandoClient({
	commandPrefix: '?',
	owner: '278305350804045834',
	invite: 'https://discord.gg/bRCvFy9',
});
```

All you have to do to remove the unknown command response is set `unknownCommandResponse` to `false`.

```js
const client = new CommandoClient({
	commandPrefix: '?',
	owner: '278305350804045834',
	invite: 'https://discord.gg/bRCvFy9',
	unknownCommandResponse: false,
});
```

That's all there is to it!
