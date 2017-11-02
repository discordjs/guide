# Understanding async/await

If you aren't that familiar with ecmascript 2017 you might have not known about async/await. It's an usefull way to handle Promises in a synchronous way instead stacking .then() callbacks aswell as it just looks cleaner.

## How does Promises work?

Before we can get into async/await you should know what Promises are and how they work because async/await is only a other way to handle Promises or better an extension (if you know what Promises are and how to deal with them you can skip this part). Promises are a way to handle asynchronous tasks in Javascript, they are the newer alternative to Callbacks. A Promise have a lot of simularities to a Progress bar thats why i like to take that as an example. Like a Progressbar, Promises represent a Process what is still ongoing and not done yet a good example for that is a request to a Server (thats what Discord.js uses Promises for as example) a Promise can have 3 states

* pending
* fulfilled
* rejected

The state **pending** means that the Promise still is ongoing and nether fulfilled nor rejected.
The state **fulfilled** means that the Promise is done and was executed without any errors.
The state **rejected** means that the Promsie encountered an Error and could not be executed correctly.

Important to know is that a Promise can only have 1 state it can never be pending and fulfilled, rejected and fulfilled or pending and rejected."so how would that look in code?" you maybe ask now. I will give you an little example here.
(ES6 code is used if you dont know what that is you should read that up [here](/additional-info/es6-syntax))

```js
function asyncTask() {
	return Promise((resolve, reject) => {
		setTimeout(resolve("Task is done"), 2000)
	})
}

asyncTask().then(value => {
	// asyncTask is complete done and encountered no error
	// The resolved value will be the String "Task is done"
}).catch(error => {
	// asyncTask encountered an error
	// the error will be an Error Object
})
```

In this scenario the asyncTask returns a Promise and we attach a .then() function and a .catch() function to it, the .then() function will trigger if the Promise was fulfilled and the .catch() function if the Promise was rejected. But with our function we resolve the Promise after 2 seconds with the String "Task is Done" so the .catch() function will never be executed.

## How to implement async/await

After knowing how Promises works and what they are for, lets look at a example where you want to handle mutiple Promises. Lets say you want to react to a message in order with letters for this example i take the basic template for a Discord.js Bot with some es6 adjustments.

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

So now we need to put the code in and if you dont know how node.js asynchronous execution works you would probably try something what would look like this

```js
client.on('message', message => {
	if (message.content === `${prefix}react`) {
		message.react('🇦');
		message.react('🇧');
		message.react('🇨');
	}
});
```

But since all of these react methods are started at the same time it would just be a race what server request is done as first, so there would be no warranty that it would be react in order. but since we want that to be reacting in order we need to use the .then() callback from the Promises what these methods return. As Result the code we want would mostly look like this

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

This code looks really messy and has redundant catch methods so lets look how the same code would look with async/await

```js
client.on('message', async message => {
	if (message.content === `${prefix}react`) {
		await message.react('🇦');
		await message.react('🇧');
		await message.react('🇨');
	}
});
```

That would mostly be the same code with async/await (note that you can only use the await keyword inside an async function!) but how does we catch Promise rejections now since we won't use .catch() anymore? Thats also a usefull feature with async/await the error will be thrown if you await it so you can just wrap the awaited Promises inside a try/catch and you are git gud. 

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

A nice side effect is that you dont have redundant catch blocks now since you use a multi catch because you wrapped all Promises inside the try block. So you could maybe asking now how would i get the value the Promise resolved with async/await, well lets look at an example where you want to delete a sent message.

```js
client.on('message', message => {
	if (message.content === `${prefix}delete`) {
		message.channel.send('this message will be deleted')
		.then(sentMessage => sentMessage.delete(10000))
		.catch(error => {
			//handle error
		});
	}
});
```

The return value of a .send() is a Promise what resolves with the sent Message Object but how would the same code with async/await look like?

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

## When should i use async/await over .then()?

This last topic is probaly the important one because i often see how people use async/await in unnessescary situations. async/await should mostly be used in situations where you need the value of mutiple Promises or need to execute these Promises in order. Using async/await for only 1 Promise is mostly the same length as just use .then() and .catch() and has no advantage over it aswell as maybe slowing your code down.