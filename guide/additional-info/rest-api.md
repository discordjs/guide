# Using a REST API

REST APIs are extremely popular on the web and allow you to freely grab a site's data if that site has an available API over an HTTP connection.

If you've ever seen a music bot that accepts a YouTube query instead of just a video's URL, then you've seen a REST API in action. As a matter of fact, discord.js is made to use Discord's API. So, you've probably used an API yourself.

## Using a REST API with Node

In these examples we are going to be using [snekfetch](https://www.npmjs.com/package/snekfetch) which is a great library for making HTTP requests by one of the developers of discord.js. Discord.js actually uses snekfetch which is part of the reason why it's ideal; it's already installed if you're using discord.js!

If you're not using discord.js you'll simply have to do the following to install snekfetch.

```bash
npm install --save snekfetch
```

## Skeleton code

To start off, you're just going to be using this skeleton code:

```js
const Discord = require('discord.js');

const client = new Discord.Client();
const prefix = '!';

client.on('ready', () => {
	console.log('Ready!');
});

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	// ...
});

client.login('pleaseinsertyourtokenheresothistutorialcanwork');
```

<p class="tip">We're going to take advantage of [destructuring](/additional-info/es6-syntax?id=destructuring) in this tutorial to maintain readability.</p>

## Using snekfetch

snekfetch is a promise-based request library with beautiful syntax. If you aren't already familiar with promises, you should read up on them [here](/additional-info/async-await).

In this tutorial we'll be making a bot with 2 API-based commands. The first will be using [random.cat](https://aws.random.cat) and the other will use [Urban Dictionary](https://www.urbandictionary.com).

To require snekfetch, you'd do:

```js
const snekfetch = require('snekfetch');
```

### Random Cat

Random cat's API is available at https://aws.random.cat/meow and returns a [JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON) response. To actually fetch data from the API, you're going to do the following:

```js
snekfetch.get('https://aws.random.cat/meow');
```

Now, of course it seems like this does nothing but what it's doing is launching a request to the random.cat server and random.cat is returning some JSON that contains a `file` property which is a string containing a link to a random cat. So, let's implement that into a command. The code should look similar to this:

<!-- eslint-skip -->

```js
if (command === 'cat') {
	const { body } = await snekfetch.get('https://random.cat/meow');

	message.channel.send(body.file);
}
```

So, here's what's happening in this code:

1. You're sending a `GET` request to random.cat.
2. random.cat sees your request and gets a random file from their database.
3. random.cat then sends that file's URL as a JSON object that contains a link to the image.
4. snekfetch's `body` property deserializes the JSON response using [JSON#parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse).
5. You then send the object's `file` property in Discord.

<p class="warning">The response will only be parsed if the server's `Content-Type` header includes `application/json`. In some cases, you may have to get the `text` property instead of the `body` property and `JSON.parse()` it yourself.</p>

### Urban Dictionary

Urban Dictionary's API is available at https://api.urbandictionary.com/v0/define, accepts a `term` parameter, and also returns a JSON response.

First, you're going to need to fetch data from the API and get it's body. To do this, you'd do:

<!-- eslint-skip -->

```js
if (command === 'urban') {
	const { body } = await snekfetch.get('https://api.urbandictionary.com/v0/define').query({ term: args.join(' ') });
}
```

The `.query()` method appends a [query string](https://en.wikipedia.org/wiki/Query_string) to the URL so that the Urban Dictionary server can parse it and know what to search for.

If you were to do `!urban hello world`, then the URL would become https://api.urbandictionary.com/v0/define?term=hello%20world since the string gets encoded.

With the `body` variable, you can get the properties of the returned JSON response. If you were to view it in your browser, it usually looks like a bunch of mumbo jumbo. If it doesn't, great! If it does, then you should get a JSON formatter/viewer. If you're using Chrome, I'd recommend [JSON Formatter](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa). If you're not using Chrome, search for "JSON formatter/viewer <your browser>" and get one.

Now, if you look at the JSON, you can see that there are 4 properties:

- `tags`: An array of strings containing tags related to the search result.
- `result_type`: A string containing the type of the result.
- `list`: An array of objects containing various definitions for the term (maximum 10).
- `sounds`: An array of strings containg links to audio recordings of people saying the term (ignore this, we won't use it).

Something you always want to do when making API based commands is to handle there being no results. So, let's throw a random term in there (e.g. `njaksdcas`) and then look at the response. From what it looks like, when there are no results, the `result_type` property is `no_results`. Now you are ready to start writing!

First, you want to start with a check. After fetching the API and storing the body, you would do:

```js
if (body.result_type === 'no_results') {
	return message.channel.send(`No results found for **${args.join(' ')}**`);
}
```

After making sure that there are results, you will use those results. For now, let's simply send back the definition and nothing more. It's as simple as:

```js
message.channel.send(body.list[0].definition);
```

Here, you are simply getting the first object from the array of objects called `list` and grabbing its `definition` property.

If you've followed the tutorial, you should have something like this:

![Basic Urban Command](/assets/img/N0t4M.png)

Now, let's just make this an [embed](/popular-topics/miscellaneous-examples?id=sending-an-embed).

We are also going to be defining a utility function at the top of our file so that our embed doesn't error when the field value is over 1024 characters. Here is a bit of code to do that:

```js
const trim = (str, max) => (str.length > max) ? `${str.slice(0, max - 3)}...` : str;
```

This is how we'll be structuring the embed:

```js
const [answer] = body.list;

const embed = new Discord.RichEmbed()
	.setColor('#EFFF00')
	.setTitle(answer.word)
	.setURL(answer.permalink)
	.addField('Definition', trim(answer.definition, 1024))
	.addField('Example', trim(answer.example, 1024))
	.addField('Rating', `${answer.thumbs_up} thumbs up.\n${answer.thumbs_down} thumbs down.`)
	.setFooter(`Tags: ${body.tags.join(', ')}`);

message.channel.send(embed);
```

Now, if you do that same command again, you should get this:

![Embeded Urban Command](/assets/img/RMv88.png)

## Resulting code
If you want to compare your code to the code we've constructed so far, you can review it over on the GitHub repository [here](https://github.com/discordjs/guide/tree/master/code_samples/additional-info/rest-api).
