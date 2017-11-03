# Understanding async/await

If you aren't very familiar with EcmaScript 2017, you may not know about async/await. It's a useful way to handle Promises in a synchronous way instead stacking .then() callback. Also, it looks cleaner.

## How do Promises work?

Before we can get into async/await, you should know what Promises are and how they work because async/await is just a way to handle Promises (if you know what Promises are and how to deal with them you can skip this part). Promises are a way to handle asynchronous tasks in Javascript, they are the newer alternative to callbacks. A Promise has a lot of simularities to a progress bar; Promises represent an ongoing process that has not yet finished. A good example for that is a request to a server (e.g discord.js sends requests to Discord's API).

A Promise can have 3 states:

* pending
* fulfilled
* rejected

The first state, **pending**, means that the Promise still is ongoing and nether fulfilled nor rejected.
The second state, **fulfilled**, means that the Promise is done and was executed without any errors.
The third state, **rejected**, means that the Promise encountered an error and could not be executed correctly.

One important thing to know is that a Promise can only have 1 state; it can never be pending and fulfilled, rejected and fulfilled, or pending and rejected. You may be asking, "How would that look in code?". Here is a small example:
(ES6 code is being used in this example; if you do not know what that is, you should read up on that [here](/additional-info/es6-syntax).)

```js
function asyncTask() {
	return Promise((resolve, reject) => {
		setTimeout(resolve("Task is done"), 2000)
	})
}

asyncTask().then(value => {
	// asyncTask is complete and has not encountered any errors
	// The resolved value will be the String "Task is done"
}).catch(error => {
	// asyncTask encountered an error
	// the error will be an Error Object
})
```

In this scenario the asyncTask returns a Promise and we attach a .then() function and a .catch() function to it. The .then() function will trigger if the Promise was fulfilled and the .catch() function if the Promise was rejected. But with our function we resolve the Promise after 2 seconds with the String "Task is Done", so the .catch() function will never be executed.

## How to implement async/await

After knowing how Promises works and what they are for, let's look at an example in which we handle multiple Promises. Let's say you wanted to react to a message in a certain order with letters (regional indicators). For this example, I will take the basic template for a discord.js bot with some es6 adjustments.

```js
const Discord = require('discord.js');
const client = new Discord.Client();

const prefix = '?';

client.on('ready', () => {
	console.log('I am ready!');
});

client.on('message', message => {
	if (message.content === `${prefix}react`) {
		//code inside here
	}
});

client.login('tokeninhere');
```

So now we need to put the code in. If you don't know how node.js asynchronous execution works, you would probably try something like this:

```js
client.on('message', message => {
	if (message.content === `${prefix}react`) {
		message.react('🇦');
		message.react('🇧');
		message.react('🇨');
	}
});
```

But since all of these react methods are started at the same time, it would just be a race which server request finished first, so there would be no guarantee that it would react in the order you wanted it to. In order to make sure it reacts in order (a, b, c), we need to use the .then() callback from the Promises that these methods return. As a result the code we want would mostly look like this:

```js
client.on('message', message => {
	if (message.content === `${prefix}react`) {
		message.react('🇦').then(() => {
			message.react('🇧').then(() => {
				message.react('🇨').catch(error => {
				//handle failure of the third react
			})
		}).catch(error => {
			//handle failure of the second react
		})
	}).catch(error => {
		//handle failure of the first react
	})
	}
});
```

This code looks really messy and has redundant catch methods, so let's look how the same code would look with async/await.

```js
client.on('message', async message => {
	if (message.content === `${prefix}react`) {
		await message.react('🇦');
		await message.react('🇧');
		await message.react('🇨');
	}
});
```

That would mostly be the same code with async/await (note that you can only use the await keyword inside an async function!), but how do we catch Promise rejections now since we won't use .catch() anymore? That is also a useful feature with async/await; the error will be thrown if you await it so you can just wrap the awaited Promises inside a try/catch and you are 👌. 

```js
client.on('message', async message => {
	if (message.content === `${prefix}react`) {
		try{
			await message.react('🇦');
			await message.react('🇧');
			await message.react('🇨');
		}catch(error) {
			//handle failure of any Promise rejection inside here
		}
	}
});
```

A nice side effect is that you don't have redundant catch blocks now since you use a multi catch because you wrapped all Promises inside the try block. 

So you may be asking, "How would I get the value the Promise resolved with?" Well, let's look at an example where you want to delete a sent message.

```js
client.on('message', message => {
	if (message.content === `${prefix}edit`) {
		message.channel.send('this message will be edited')
		.then(sentMessage => sentMessage.delete(10000))
		.catch(error => {
			//handle error
		});
	}
});
```

The return value of a .send() is a Promise what resolves with the sent Message object, but how would the same code with Async/Await look like?

```js
client.on('message', async message => {
	if (message.content === `${prefix}edit`) {
		try{
			const sentMessage = await message.channel.send('this message will be edited')
			sentMessage.delete(10000)
		}catch(error){
			//handle error
		}
	}
});
```

With async/await you can just assign the awaited function to a variable that will represent the returned value. Now you know how you use async/await.

## When should I use async/await over .then()?

This last topic is probaly the important one because of how often I see how people use async/await in unnecessary situations. Async/await should mostly be used in situations where you need the value of mutiple Promises or need to execute a chain of Promises in order. Using async/await for only one Promise has no advantage over using .then(), and it may be slowing your code down.
