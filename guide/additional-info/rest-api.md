# Using a REST API

REST APIs are extremely popular on the web and allow you to freely grab a site's data if it has an available API over an HTTP connection.

If you've ever seen a music bot that accepts a YouTube query instead of just a video's URL, then you've seen a REST API in action. discord.js uses the Discord API, so you've probably used an API yourself.

## Making HTTP requests with Node

In these examples, we will be using [node-fetch](https://www.npmjs.com/package/node-fetch), an excellent library for making HTTP requests.

To install node-fetch, run the following command:

```bash
npm install node-fetch
```

## Skeleton code

To start off, you're just going to be using this skeleton code:

<!-- eslint-disable require-await -->
<branch version="11.x">

```js
const { Client, RichEmbed } = require('discord.js');

const client = new Client();
const prefix = '!';

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	// ...
});

client.login('your-token-goes-here');
```
</branch>
<branch version="12.x">
	
```js
const { Client, MessageEmbed } = require('discord.js');

const client = new Client();
const prefix = '!';

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	// ...
});

client.login('your-token-goes-here');
```
</branch>

::: tip
We're going to take advantage of [destructuring](/additional-info/es6-syntax.md#destructuring) in this tutorial to maintain readability.
:::

## Using node-fetch

node-fetch is a lightweight, Promise-based module that brings the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), which is available in browsers, to node. If you aren't already familiar with Promises, you should read up on them [here](/additional-info/async-await.md).

In this tutorial, we'll be making a bot with two API-based commands using the [random.cat](https://aws.random.cat) and [Urban Dictionary](https://www.urbandictionary.com) APIs.

To require node-fetch, you'd do:

```js
const fetch = require('node-fetch');
```

### Random Cat

Random cat's API is available at https://aws.random.cat/meow and returns a [JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON) response. To actually fetch data from the API, you're going to do the following:

```js
fetch('https://aws.random.cat/meow').then(response => response.json());
```

It may seem like this does nothing, but what it's doing is launching a request to the random.cat server. The server is returning some JSON that contains a `file` property, which is a string containing a link to a random cat. node-fetch returns a response object, which we can change into JSON with `response.json()`. Next, let's implement this into a command. The code should look similar to this:

```js {3-6}
client.on('message', async message => {
	// ...
	if (command === 'cat') {
		const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
		message.channel.send(file);
	}
});
```

So, here's what's happening in this code:

1. You're sending a `GET` request to random.cat.
2. random.cat sees your request and gets a random file from their database.
3. random.cat then sends that file's URL as a JSON object that contains a link to the image.
4. node-fetch receives the response and deserializes it with `response.json()`.
5. You then send the object's `file` property in Discord.

::: warning
The response will only be parsed if the server's `Content-Type` header includes `application/json`. In some cases you may have to apply the `.text()` method instead of `.json()` and `JSON.parse()` it yourself.
:::

### Urban Dictionary

Urban Dictionary's API is available at https://api.urbandictionary.com/v0/define, accepts a `term` parameter, and returns a JSON response.

First, you're going to need to fetch data from the API. To do this, you'd do:

```js {1,5-14}
const querystring = require('querystring');
// ...
client.on('message', async message => {
	// ...
	if (command === 'urban') {
		if (!args.length) {
			return message.channel.send('You need to supply a search term!');
		}

		const query = querystring.stringify({ term: args.join(' ') });

		const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`)
			.then(response => response.json());
	}
});
```

Here, we use Node's native [querystring module](https://nodejs.org/api/querystring.html) to create a [query string](https://en.wikipedia.org/wiki/Query_string) for the URL so that the Urban Dictionary server can parse it and know what to search.

If you were to do `!urban hello world`, then the URL would become https://api.urbandictionary.com/v0/define?term=hello%20world since the string gets encoded.

You can get the respective properties from the returned JSON. If you were to view it in your browser, it usually looks like a bunch of mumbo jumbo. If it doesn't, great! If it does, then you should get a JSON formatter/viewer. If you're using Chrome, [JSON Formatter](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa) is one of the more popular extensions. If you're not using Chrome, search for "JSON formatter/viewer &lt;your browser&gt;" and get one.

Now, if you look at the JSON, you can see that it's a `list` property, which is an array of objects containing various definitions for the term (maximum 10). Something you always want to do when making API-based commands is to handle no results. So, let's throw a random term in there (e.g. `njaksdcas`) and then look at the response. The `list` array should then be empty. Now you are ready to start writing!

As explained above, you'll want to check if the API returned any answers for your query, and send back the definition if so:

```js {3-5,7}
if (command === 'urban') {
	// ...
	if (!list.length) {
		return message.channel.send(`No results found for **${args.join(' ')}**.`);
	}

	message.channel.send(list[0].definition);
}
```

Here, you are only getting the first object from the array of objects called `list` and grabbing its `definition` property.

If you've followed the tutorial, you should have something like this:

<div is="discord-messages">
	<discord-message profile="user">
		!urban njaksdcas
	</discord-message>
	<discord-message profile="bot">
		<mention :highlight="true" profile="user" />, No results for <strong>njaksdcas</strong>
	</discord-message>
	<discord-message profile="user">
		!urban hello world
	</discord-message>
	<discord-message profile="bot">
		The easiest, and first program any newbie would write. Applies for any language. Also what you would see in the first chapter of most programming books.
	</discord-message>
</div>

Now, let's just make this an [embed](/popular-topics/embeds.md).

We are also going to be defining a utility function at the top of the file so that the embed doesn't error when the field value is over 1024 characters. Here is a bit of code to do that:

```js
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
```

The following snippet is how to structure the embed:

<branch version="11.x">

```js
const [answer] = list;

const embed = new RichEmbed()
	.setColor('#EFFF00')
	.setTitle(answer.word)
	.setURL(answer.permalink)
	.addField('Definition', trim(answer.definition, 1024))
	.addField('Example', trim(answer.example, 1024))
	.addField('Rating', `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.`);

message.channel.send(embed);
```

</branch>
<branch version="12.x">

```js
const [answer] = list;

const embed = new MessageEmbed()
	.setColor('#EFFF00')
	.setTitle(answer.word)
	.setURL(answer.permalink)
	.addFields(
		{ name: 'Definition', value: trim(answer.definition, 1024) },
		{ name: 'Example', value: trim(answer.example, 1024) },
		{ name: 'Rating', value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.` },
	);

message.channel.send(embed);
```

</branch>

Now, if you do that same command again, you should get this:

<div is="discord-messages">
	<discord-message profile="user">
		!urban hello world
	</discord-message>
	<discord-message profile="bot">
		<discord-embed slot="embeds" color="#EFFF00" title="hello world" url="https://www.urbandictionary.com/define.php?term=hello%20world" >
			<embed-fields slot="fields">
				<embed-field title="Definition">
					The easiest, and first program any newbie would write. Applies for any language. Also what you would see in the first chapter of most programming books. 
				</embed-field>
				<embed-field title="Example">
					programming noob: Hey I just attended my first programming lesson earlier! <br>
					.NET Veteran: Oh? What can you do? <br>
					programming noob: I could make a dialog box pop up which says "Hello World!" !!! <br>
					.NET Veteran: lmao.. hey guys! look.. check out this "hello world" programmer <br><br>
					Console.WriteLine("Hello World")
				</embed-field>
				<embed-field title="Rating">
					122 thumbs up. <br>
					42 thumbs down.
				</embed-field>
			</embed-fields>
		</discord-embed>
	</discord-message>
</div>

## Resulting code

<resulting-code />
