---
forceTheme: blue
---

# Removing the unknown command response

Sometimes, you may want to remove the unknown command response from your bot. Be it Cleverbot or some other reason, sometimes you just want it gone, and it's quite simple to remove.

Head over to your `index.js` file and find your `client.registry` and find the `.registerDefaultCommands` part of it. You're going to be adding a new setting here.

```js
client.registry
        .registerDefaultTypes() 	
        .registerGroups([ 
                ['first', 'Your First Command Group'],
 		['second', 'Your Second Command Group'], 
	]) 
	.registerDefaultGroups()
 	.registerDefaultCommands()
 	.registerCommandsIn(path.join(__dirname, 'commands'));
```

All you have to do to remove the unknown command response is set `unknownCommand` to `false` in `.registerDefaultCommands()`.

```js
client.registry
        .registerDefaultTypes() 	
        .registerGroups([ 
                ['first', 'Your First Command Group'],
 		['second', 'Your Second Command Group'], 
	]) 
	.registerDefaultGroups()
 	.registerDefaultCommands({
                unknownCommand: false
        })
 	.registerCommandsIn(path.join(__dirname, 'commands'));
```

That's all there is to it!
