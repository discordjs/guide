---
forceTheme: blue
---

# Removing the unknown command response

Sometimes, you may want to remove the unknown command response from your bot. Be it Cleverbot or some other reason, sometimes you just want it gone, and it's quite simple to remove.

Head over to your `index.js` file and find your `client.registry` variable. You're going to be adding a new setting here.

<!-- eslint-skip -->

```js
client.registry
// ... The rest of the data from your registry
```

All you have to do to remove the unknown command response is adding `unknownCommand` and setting it to `false` in `.registerDefaultCommands()`, under your registry:

```js
client.registry
	// ... The rest of the data from your registry
	.registerDefaultCommands({
		unknownCommand: false,
	});
```

That's all there is to it!
